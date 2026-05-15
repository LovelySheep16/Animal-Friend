(function () {
  'use strict';

  // ── Session ───────────────────────────────────────────────────────────────
  var SESSION   = null;
  var _pingInt  = null;
  var _chatInt  = null;
  var _chatLast = 0;

  function loadSession() { try { return JSON.parse(sessionStorage.getItem('af_s') || 'null'); } catch(e) { return null; } }
  function saveSession(s) { SESSION = s; try { sessionStorage.setItem('af_s', JSON.stringify(s)); } catch(e) {} }
  function clearSession()  { SESSION = null; try { sessionStorage.removeItem('af_s'); } catch(e) {} }
  function getSession()    { return SESSION || loadSession(); }

  // ── API ───────────────────────────────────────────────────────────────────
  function apiPost(url, body) {
    return fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
      .then(function(r) { return r.json(); });
  }
  function apiGet(url) { return fetch(url).then(function(r) { return r.json(); }); }

  function saveAccount(acc) {
    var s = getSession();
    if (!s) return;
    s.account = acc;
    saveSession(s);
    apiPost('/api/accounts/' + encodeURIComponent(s.name), { password: s.password, data: acc });
  }

  function ensureItems(acc) {
    if (!acc.shopItems)    acc.shopItems    = { speed:0, attack:0, petluck:0, potion:0 };
    if (!acc.homePets)     acc.homePets     = [];
    if (!acc.rubies)       acc.rubies       = 0;
    if (!acc.highestLevel) acc.highestLevel = 0;
    if (!acc.lastWorked)   acc.lastWorked   = 0;
    return acc;
  }

  // ── Presence ping ─────────────────────────────────────────────────────────
  function startPing() {
    stopPing();
    doPing();
    _pingInt = setInterval(doPing, 12000);
  }
  function stopPing() { if (_pingInt) { clearInterval(_pingInt); _pingInt = null; } }
  function doPing() {
    var s = getSession();
    if (s) apiPost('/api/ping', { name: s.name, password: s.password }).catch(function() {});
  }

  // ── Screen management ─────────────────────────────────────────────────────
  var SCREENS = ['screen-auth','screen-hub','screen-arena','screen-work','screen-meta-shop','screen-result'];

  function showScreen(id) {
    SCREENS.forEach(function(s) { var el = document.getElementById(s); if (el) el.style.display = 'none'; });
    var wrap = document.getElementById('wrap');
    if (wrap) wrap.style.display = 'none';
    hideChatPanel();
    if (id === 'game') {
      if (wrap) wrap.style.display = 'block';
    } else {
      var el = document.getElementById(id);
      if (el) el.style.display = 'flex';
    }
  }

  function setErr(msg) { document.getElementById('auth-err').textContent = msg; }

  // ── Auth ──────────────────────────────────────────────────────────────────
  window.doLogin = function () {
    var name = document.getElementById('auth-name').value.trim();
    var pass = document.getElementById('auth-pass').value;
    if (!name || !pass) { setErr('Fill in both fields.'); return; }
    setErr('Logging in…');
    apiPost('/api/login', { name: name, password: pass })
      .then(function(res) {
        if (!res.ok) { setErr(res.error || 'Login failed.'); return; }
        saveSession({ name: name, password: pass, account: ensureItems(res.account) });
        setErr(''); startPing(); showHub();
      }).catch(function() { setErr('Cannot reach server.'); });
  };

  window.doCreate = function () {
    var name = document.getElementById('auth-name').value.trim();
    var pass = document.getElementById('auth-pass').value;
    if (!name || !pass) { setErr('Fill in both fields.'); return; }
    setErr('Creating account…');
    apiPost('/api/register', { name: name, password: pass })
      .then(function(res) {
        if (!res.ok) { setErr(res.error || 'Failed.'); return; }
        saveSession({ name: name, password: pass, account: ensureItems(res.account) });
        setErr(''); startPing(); showHub();
      }).catch(function() { setErr('Cannot reach server.'); });
  };

  window.doLogout = function () { stopPing(); clearSession(); showScreen('screen-auth'); };

  // ── Hub ───────────────────────────────────────────────────────────────────
  function showHub() {
    var s = getSession();
    if (!s) { showScreen('screen-auth'); return; }
    var acc = ensureItems(s.account);
    document.getElementById('hub-user').textContent   = s.name;
    document.getElementById('hub-rubies').textContent = acc.rubies + ' 🔴';
    document.getElementById('hub-best').textContent   = 'Best: Level ' + acc.highestLevel + '/50';
    renderHomePets(acc.homePets);
    showScreen('screen-hub');
  }
  window.showHub = showHub;

  function renderHomePets(pets) {
    var el = document.getElementById('hub-pets');
    if (!pets || !pets.length) { el.innerHTML = '<div class="hub-no-pets">No pets yet — play levels to collect them!</div>'; return; }
    el.innerHTML = pets.map(function(p) {
      return '<div class="hub-pet" title="' + p.n + '">' + p.e + '<span class="hub-pet-name">' + p.n + '</span></div>';
    }).join('');
  }

  // ── Levels ────────────────────────────────────────────────────────────────
  window.playLevels = function () {
    var s = getSession();
    if (!s) return;
    var acc = ensureItems(s.account);
    var config = { speed: acc.shopItems.speed||0, attack: acc.shopItems.attack||0,
                   petluck: acc.shopItems.petluck||0, potion: acc.shopItems.potion||0 };
    acc.shopItems = { speed:0, attack:0, petluck:0, potion:0 };
    saveAccount(acc);
    showScreen('game');
    if (window.META_startGame) window.META_startGame(config);
  };

  window.META_onRunEnd = function (won, pets, level) {
    var s = getSession();
    if (!s) return;
    var acc = ensureItems(s.account);
    var rubiesEarned  = won ? 50 : 0;
    var petsGoingHome = [];
    var hadEnough     = pets && pets.length >= 3;
    if (level > acc.highestLevel) acc.highestLevel = level;
    if (hadEnough) {
      pets.forEach(function(p) {
        if (Math.random() < 0.30) {
          var hp = { id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' };
          petsGoingHome.push(hp); acc.homePets.push(hp);
        }
      });
    }
    acc.rubies += rubiesEarned;
    saveAccount(acc);
    var titleEl = document.getElementById('result-title');
    titleEl.textContent = won ? '🏆 You Won!' : '💀 You Died';
    titleEl.style.color = won ? '#ffd700' : '#ff5050';
    document.getElementById('result-level').textContent  = 'Level reached: ' + level + '/50';
    document.getElementById('result-rubies').textContent = '+' + rubiesEarned + ' 🔴 rubies' + (won ? ' for completing all 50 floors!' : '');
    var petsEl = document.getElementById('result-pets');
    if (petsGoingHome.length > 0) {
      petsEl.innerHTML = '<div class="result-pets-title">Pets that moved to your home:</div>' +
        petsGoingHome.map(function(p) { return '<span class="result-pet">' + p.e + ' ' + p.n + '</span>'; }).join('');
    } else if (!hadEnough) {
      petsEl.innerHTML = '<div class="result-note">Need at least 3 pets for any to go home.</div>';
    } else {
      petsEl.innerHTML = '<div class="result-note">No pets went home this time (30% chance each).</div>';
    }
    showScreen('screen-result');
  };

  // ── Arena ─────────────────────────────────────────────────────────────────
  window.showArena = function () {
    var s = getSession();
    if (!s) return;
    var acc = ensureItems(s.account);
    document.getElementById('arena-my-pets').innerHTML  = renderArenaPets(acc.homePets);
    document.getElementById('arena-result').innerHTML   = '';
    document.getElementById('arena-preview').style.display = 'none';
    document.getElementById('arena-players-list').textContent = 'Loading players…';
    showScreen('screen-arena');

    Promise.all([apiGet('/api/accounts'), apiGet('/api/online')]).then(function(results) {
      var accounts = results[0];
      var online   = results[1];
      var others   = Object.keys(accounts).filter(function(n) { return n !== s.name; });
      var listEl   = document.getElementById('arena-players-list');
      if (!others.length) {
        listEl.innerHTML = '<div class="work-no-players">No other players yet — invite a friend to fight!</div>';
        return;
      }
      window._arenaAccounts = accounts;
      listEl.innerHTML = others.map(function(name) {
        var isOnline = !!online[name];
        var pets     = accounts[name].homePets || [];
        var safeName = name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
        return '<div class="work-player-row" onclick="selectArenaOpponent(\'' + safeName + '\')">' +
          '<span class="work-player-dot' + (isOnline ? ' online' : '') + '"></span>' +
          '<span class="work-player-name">' + name + '</span>' +
          '<span class="arena-player-pets">' + (pets.length ? pets.slice(0,5).map(function(p){ return p.e; }).join('') : '—') + '</span>' +
          (isOnline ? '<span class="work-online-tag">● online</span>' : '') +
          '</div>';
      }).join('');
    }).catch(function() {
      document.getElementById('arena-players-list').textContent = 'Could not load players.';
    });
  };

  window.selectArenaOpponent = function (name) {
    var accounts = window._arenaAccounts || {};
    var opp = { name: name, pets: (accounts[name] && accounts[name].homePets) || [] };
    window._arenaOpp = opp;
    document.getElementById('arena-opp-name').textContent = opp.name + '\'s Pets';
    document.getElementById('arena-opp-pets').innerHTML   = renderArenaPets(opp.pets);
    document.getElementById('arena-preview').style.display = 'block';
  };

  window.doArenaFight = function () {
    var s   = getSession();
    var opp = window._arenaOpp;
    if (!s || !opp) return;
    var acc = ensureItems(s.account);
    if (!acc.homePets || !acc.homePets.length) {
      document.getElementById('arena-result').innerHTML = '<div class="work-err">You need home pets to fight! Play levels first.</div>';
      return;
    }
    showScreen('game');
    if (window.META_startArena) window.META_startArena(acc.homePets, opp.pets, opp.name);
  };

  window.META_onArenaEnd = function (won, bredPets) {
    var s   = getSession();
    var opp = window._arenaOpp || { name: 'Opponent' };
    if (!s) return;
    var acc = ensureItems(s.account);
    acc.rubies += won ? 100 : 0;

    // Bred pets (pair-bred during arena) go to home
    var homeBred = [];
    if (bredPets && bredPets.length) {
      bredPets.forEach(function(p) {
        var hp = { id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' };
        homeBred.push(hp);
        acc.homePets.push(hp);
      });
    }

    saveAccount(acc);

    var titleEl = document.getElementById('result-title');
    titleEl.textContent = won ? '🏆 Arena Victory!' : '💀 Arena Defeat';
    titleEl.style.color = won ? '#ffd700' : '#ff5050';
    document.getElementById('result-level').textContent  = won ? 'You defeated ' + opp.name + '!' : 'Defeated by ' + opp.name + '…';
    document.getElementById('result-rubies').textContent = won ? '+100 🔴 rubies!' : 'No rubies this time.';
    var petsEl = document.getElementById('result-pets');
    if (homeBred.length) {
      petsEl.innerHTML = '<div class="result-pets-title">Bred pets moving to your home:</div>' +
        homeBred.map(function(p) { return '<span class="result-pet">' + p.e + ' ' + p.n + '</span>'; }).join('');
    } else {
      petsEl.innerHTML = '<div class="result-note">No pets bred this arena run. (Breed by having 2 of the same pet!)</div>';
    }
    showScreen('screen-result');
  };

  function renderArenaPets(pets) {
    if (!pets || !pets.length) return '<div class="arena-no-pets">No pets</div>';
    return pets.map(function(p) { return '<span class="arena-pet" title="' + p.n + '">' + p.e + '</span>'; }).join('');
  }

  // ── Meta Shop ─────────────────────────────────────────────────────────────
  var META_ITEMS = [
    { id:'speed',   e:'⚡', n:'Speed Scroll', d:'+15% speed in next run',      cost:35 },
    { id:'attack',  e:'💪', n:'Power Gem',     d:'+16 attack in next run',      cost:40 },
    { id:'petluck', e:'🍀', n:'Lucky Clover',  d:'+16% pet chance in next run', cost:50 },
    { id:'potion',  e:'🧪', n:'Health Potion', d:'+30 max HP in next run',      cost:30 }
  ];

  window.showMetaShop = function () { renderMetaShop(); showScreen('screen-meta-shop'); };

  function renderMetaShop() {
    var s = getSession();
    if (!s) return;
    var acc = ensureItems(s.account);
    document.getElementById('meta-shop-rubies').textContent = acc.rubies + ' 🔴';
    document.getElementById('meta-shop-grid').innerHTML = META_ITEMS.map(function(item) {
      var owned  = acc.shopItems[item.id] || 0;
      var canBuy = acc.rubies >= item.cost;
      return '<div class="meta-shop-item' + (canBuy ? '' : ' cant-buy') + '">' +
        '<div class="meta-item-icon">' + item.e + '</div>' +
        '<div class="meta-item-name">' + item.n + '</div>' +
        '<div class="meta-item-desc">' + item.d + '</div>' +
        (owned ? '<div class="meta-item-owned">✓ Ready ×' + owned + '</div>' : '') +
        '<button class="meta-buy-btn"' + (canBuy ? ' onclick="metaBuyItem(\'' + item.id + '\')"' : ' disabled') + '>' +
        item.cost + ' 🔴</button></div>';
    }).join('');
  }

  window.metaBuyItem = function (id) {
    var s = getSession();
    if (!s) return;
    var acc  = ensureItems(s.account);
    var item = META_ITEMS.find(function(i) { return i.id === id; });
    if (!item || acc.rubies < item.cost) return;
    acc.rubies -= item.cost;
    acc.shopItems[id] = (acc.shopItems[id] || 0) + 1;
    saveAccount(acc); renderMetaShop();
  };

  // ── Work ──────────────────────────────────────────────────────────────────
  window.showWork = function () {
    document.getElementById('work-result').innerHTML  = '';
    document.getElementById('work-employer').value    = '';
    document.getElementById('work-players-list').textContent = 'Loading…';
    showScreen('screen-work');

    var s = getSession();
    if (!s) return;

    Promise.all([apiGet('/api/accounts'), apiGet('/api/online')]).then(function(results) {
      var accounts = results[0];
      var online   = results[1];
      var others   = Object.keys(accounts).filter(function(n) { return n !== s.name; });
      var listEl   = document.getElementById('work-players-list');
      if (!others.length) {
        listEl.innerHTML = '<div class="work-no-players">No other players yet — invite a friend!</div>';
        return;
      }
      listEl.innerHTML = others.map(function(name) {
        var isOnline = !!online[name];
        return '<div class="work-player-row" onclick="pickWorkPlayer(\'' + name + '\')">' +
          '<span class="work-player-dot' + (isOnline ? ' online' : '') + '"></span>' +
          '<span class="work-player-name">' + name + '</span>' +
          (isOnline ? '<span class="work-online-tag">● online</span>' : '') +
          '</div>';
      }).join('');
    }).catch(function() {
      document.getElementById('work-players-list').textContent = 'Could not load players.';
    });
  };

  window.pickWorkPlayer = function(name) {
    document.getElementById('work-employer').value = name;
  };

  window.doWork = function () {
    var s = getSession();
    if (!s) return;
    var acc          = ensureItems(s.account);
    var employerName = document.getElementById('work-employer').value.trim();
    var resEl        = document.getElementById('work-result');

    if (!employerName)           { resEl.innerHTML = '<div class="work-err">Enter a player name.</div>'; return; }
    if (employerName === s.name) { resEl.innerHTML = '<div class="work-err">You can\'t work for yourself!</div>'; return; }

    var now = Date.now();
    if (acc.lastWorked && now - acc.lastWorked < 300000) {
      var wait = Math.ceil((300000 - (now - acc.lastWorked)) / 1000);
      resEl.innerHTML = '<div class="work-err">You need rest! ' + wait + 's cooldown remaining.</div>';
      return;
    }

    resEl.innerHTML = '<div class="work-success">Checking player…</div>';

    // Validate real player
    apiGet('/api/accounts').then(function(accounts) {
      if (!accounts[employerName]) {
        resEl.innerHTML = '<div class="work-err">"' + employerName + '" doesn\'t exist. You can only work for real players!</div>';
        return;
      }
      // Check if online for chat
      apiGet('/api/online').then(function(onlinePlayers) {
        var employerOnline = !!onlinePlayers[employerName];
        window._workEmployer       = employerName;
        window._workChatRoom       = [s.name, employerName].sort().join('__');
        window._workEmployerOnline = employerOnline;

        // Post a system message so the employer sees who is working for them
        if (employerOnline) {
          apiPost('/api/chat/' + window._workChatRoom, {
            name: s.name, password: s.password,
            msg: '🔔 ' + s.name + ' has started working for you!'
          }).catch(function() {});
        }

        showScreen('game');
        if (window.META_startWork) window.META_startWork(employerName, employerOnline);
      });
    }).catch(function() {
      resEl.innerHTML = '<div class="work-err">Server error. Is the server running?</div>';
    });
  };

  window.META_onWorkEnd = function (employerName) {
    var s = getSession();
    if (!s) return;
    var acc = ensureItems(s.account);

    acc.rubies    += 25;
    acc.lastWorked = Date.now();
    acc.homePets   = acc.homePets.concat([
      { id:'bunny',  e:'🐰', n:'Bunny',  cat:'🌿 Healers',   heal:6, hi:3000, atk:0, ar:0,    sc:0,    d:'Heals 6hp/3s'   },
      { id:'mouse',  e:'🐭', n:'Mouse',  cat:'⚔️ Attackers', heal:0, hi:0,    atk:5, ar:800,  sc:0,    d:'5dmg very fast' },
      { id:'turtle', e:'🐢', n:'Turtle', cat:'🛡️ Tanks',     heal:0, hi:0,    atk:3, ar:2000, sc:0.20, d:'Blocks 20% hits'}
    ]);
    saveAccount(acc);

    var titleEl = document.getElementById('result-title');
    titleEl.textContent = '💼 Work Done!';
    titleEl.style.color = '#60dd60';
    document.getElementById('result-level').textContent  = 'You worked for ' + employerName + '!';
    document.getElementById('result-rubies').textContent = '+25 🔴 rubies earned!';
    document.getElementById('result-pets').innerHTML =
      '<div class="result-pets-title">New home pets:</div>' +
      '<span class="result-pet">🐰 Bunny</span>' +
      '<span class="result-pet">🐭 Mouse</span>' +
      '<span class="result-pet">🐢 Turtle</span>';
    showScreen('screen-result');
  };

  // ── Chat ──────────────────────────────────────────────────────────────────
  function showChatPanel(employerName) {
    var panel = document.getElementById('chat-panel');
    document.getElementById('chat-panel-name').textContent = employerName;
    document.getElementById('chat-msgs').innerHTML = '';
    panel.style.display = 'flex';
    _chatLast = 0;
    pollChat();
    _chatInt = setInterval(pollChat, 2500);
  }

  function hideChatPanel() {
    var panel = document.getElementById('chat-panel');
    if (panel) panel.style.display = 'none';
    if (_chatInt) { clearInterval(_chatInt); _chatInt = null; }
  }

  function pollChat() {
    var room = window._workChatRoom;
    if (!room) return;
    apiGet('/api/chat/' + room + '?since=' + _chatLast).then(function(msgs) {
      if (!msgs.length) return;
      var box = document.getElementById('chat-msgs');
      msgs.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'chat-msg' + (m.from === getSession().name ? ' chat-mine' : '');
        div.innerHTML = '<span class="chat-from">' + m.from + '</span> ' + escHtml(m.msg);
        box.appendChild(div);
      });
      box.scrollTop = box.scrollHeight;
      _chatLast = msgs[msgs.length - 1].time;
    }).catch(function() {});
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  window.sendWorkChat = function () {
    var s   = getSession();
    var inp = document.getElementById('chat-input');
    if (!s || !inp || !inp.value.trim()) return;
    var msg  = inp.value.trim();
    var room = window._workChatRoom;
    inp.value = '';
    apiPost('/api/chat/' + room, { name: s.name, password: s.password, msg: msg }).catch(function() {});
  };

  window.toggleChat = function () {
    var panel = document.getElementById('chat-panel');
    if (!panel) return;
    panel.classList.toggle('chat-collapsed');
  };

  // Called from game.js after META_startWork sets up the game
  window.META_showChatIfOnline = function (employerName, isOnline) {
    if (isOnline) showChatPanel(employerName);
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    SESSION = loadSession();
    if (SESSION) { startPing(); showHub(); }
    else showScreen('screen-auth');
  });
})();
