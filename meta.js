(function () {
  'use strict';

  // ── Local save (localStorage, no account/name needed) ────────────────────
  var SAVE_KEY = 'af_save';
  var _account = null;

  function loadAccount() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch(e) { return null; }
  }
  function saveAccount(acc) {
    _account = acc;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(acc)); } catch(e) {}
  }
  function getAccount() { return _account; }

  var SERVANTS = [
    // ── Knights ───────────────────────────────────────────────────────────
    {id:'squire',     e:'🛡️', n:'Squire',          rph:3,   pph:0,    cost:30,   cat:'⚔️ Knights'},
    {id:'soldier',    e:'⚔️', n:'Soldier',          rph:6,   pph:0,    cost:60,   cat:'⚔️ Knights'},
    {id:'knight',     e:'🏇', n:'Knight',           rph:10,  pph:0,    cost:100,  cat:'⚔️ Knights'},
    {id:'eliteknight',e:'⚔️', n:'Elite Knight',     rph:16,  pph:0,    cost:160,  cat:'⚔️ Knights'},
    {id:'paladin',    e:'🌟', n:'Paladin',          rph:24,  pph:0,    cost:240,  cat:'⚔️ Knights'},
    {id:'champion',   e:'🏆', n:'Champion',         rph:34,  pph:0.05, cost:340,  cat:'⚔️ Knights'},
    {id:'warlord',    e:'🗡️', n:'Warlord',          rph:46,  pph:0.05, cost:460,  cat:'⚔️ Knights'},
    {id:'hero',       e:'🦸', n:'Hero',             rph:60,  pph:0.1,  cost:600,  cat:'⚔️ Knights'},
    {id:'legend',     e:'👑', n:'Legend',           rph:78,  pph:0.1,  cost:780,  cat:'⚔️ Knights'},
    {id:'eternalknight',e:'✨',n:'Eternal Knight',  rph:100, pph:0.15, cost:1000, cat:'⚔️ Knights'},
    // ── Robots ────────────────────────────────────────────────────────────
    {id:'basicbot',   e:'🤖', n:'Basic Bot',        rph:4,   pph:0,    cost:40,   cat:'🤖 Robots'},
    {id:'workerbot',  e:'🔧', n:'Worker Bot',       rph:8,   pph:0,    cost:80,   cat:'🤖 Robots'},
    {id:'guardbot',   e:'🤖', n:'Guard Bot',        rph:13,  pph:0,    cost:130,  cat:'🤖 Robots'},
    {id:'combatbot',  e:'⚙️', n:'Combat Bot',       rph:20,  pph:0,    cost:200,  cat:'🤖 Robots'},
    {id:'miningbot',  e:'⛏️', n:'Mining Bot',       rph:28,  pph:0.05, cost:280,  cat:'🤖 Robots'},
    {id:'advancedbot',e:'🤖', n:'Advanced Bot',     rph:38,  pph:0.05, cost:380,  cat:'🤖 Robots'},
    {id:'nanobot',    e:'🔬', n:'Nano Bot',         rph:50,  pph:0.1,  cost:500,  cat:'🤖 Robots'},
    {id:'mechwarrior',e:'🦾', n:'Mech Warrior',     rph:65,  pph:0.1,  cost:650,  cat:'🤖 Robots'},
    {id:'quantumbot', e:'🌀', n:'Quantum Bot',      rph:83,  pph:0.15, cost:830,  cat:'🤖 Robots'},
    {id:'omnibot',    e:'🌌', n:'Omni Bot',         rph:105, pph:0.2,  cost:1050, cat:'🤖 Robots'},
    // ── Witches ───────────────────────────────────────────────────────────
    {id:'apprentice', e:'🪄', n:'Apprentice',       rph:5,   pph:0.1,  cost:50,   cat:'🧙 Witches'},
    {id:'hedgewitch', e:'🌿', n:'Hedge Witch',      rph:10,  pph:0.15, cost:100,  cat:'🧙 Witches'},
    {id:'mage',       e:'🔮', n:'Mage',             rph:15,  pph:0.2,  cost:150,  cat:'🧙 Witches'},
    {id:'sorcerer',   e:'🌙', n:'Sorcerer',         rph:22,  pph:0.25, cost:220,  cat:'🧙 Witches'},
    {id:'warlock',    e:'🌑', n:'Warlock',          rph:30,  pph:0.3,  cost:300,  cat:'🧙 Witches'},
    {id:'enchanter',  e:'✨', n:'Enchanter',        rph:40,  pph:0.35, cost:400,  cat:'🧙 Witches'},
    {id:'archmage',   e:'📖', n:'Archmage',         rph:52,  pph:0.4,  cost:520,  cat:'🧙 Witches'},
    {id:'grandwitch', e:'🧙', n:'Grand Witch',      rph:66,  pph:0.45, cost:660,  cat:'🧙 Witches'},
    {id:'mystic',     e:'🌟', n:'Mystic',           rph:83,  pph:0.5,  cost:830,  cat:'🧙 Witches'},
    {id:'cosmicmage', e:'🌌', n:'Cosmic Mage',      rph:105, pph:0.6,  cost:1050, cat:'🧙 Witches'},
    // ── Healers ───────────────────────────────────────────────────────────
    {id:'nurse',      e:'💊', n:'Nurse',            rph:6,   pph:0.05, cost:60,   cat:'💊 Healers'},
    {id:'medic',      e:'🏥', n:'Medic',            rph:11,  pph:0.1,  cost:110,  cat:'💊 Healers'},
    {id:'herbalist',  e:'🌿', n:'Herbalist',        rph:17,  pph:0.15, cost:170,  cat:'💊 Healers'},
    {id:'shaman',     e:'🪬', n:'Shaman',           rph:24,  pph:0.2,  cost:240,  cat:'💊 Healers'},
    {id:'druid',      e:'🌳', n:'Druid',            rph:33,  pph:0.25, cost:330,  cat:'💊 Healers'},
    {id:'oracle',     e:'👁️', n:'Oracle',           rph:43,  pph:0.3,  cost:430,  cat:'💊 Healers'},
    {id:'highpriest', e:'🙏', n:'High Priest',      rph:55,  pph:0.35, cost:550,  cat:'💊 Healers'},
    {id:'angel',      e:'😇', n:'Angel',            rph:70,  pph:0.4,  cost:700,  cat:'💊 Healers'},
    {id:'seraph',     e:'✨', n:'Seraph',           rph:88,  pph:0.45, cost:880,  cat:'💊 Healers'},
    {id:'divine',     e:'🌟', n:'Divine Being',     rph:110, pph:0.5,  cost:1100, cat:'💊 Healers'},
    // ── Legends ───────────────────────────────────────────────────────────
    {id:'goblinmerch',e:'👺', n:'Goblin Merchant',  rph:12,  pph:0.1,  cost:120,  cat:'🌟 Legends'},
    {id:'dragonrider',e:'🐉', n:'Dragon Rider',     rph:20,  pph:0.15, cost:200,  cat:'🌟 Legends'},
    {id:'phoenix',    e:'🦅', n:'Phoenix',          rph:30,  pph:0.2,  cost:300,  cat:'🌟 Legends'},
    {id:'centaur',    e:'🏇', n:'Centaur',          rph:42,  pph:0.25, cost:420,  cat:'🌟 Legends'},
    {id:'djinn',      e:'🌪️', n:'Djinn',            rph:56,  pph:0.3,  cost:560,  cat:'🌟 Legends'},
    {id:'titan',      e:'🗿', n:'Titan',            rph:72,  pph:0.35, cost:720,  cat:'🌟 Legends'},
    {id:'ancientdragon',e:'🐲',n:'Ancient Dragon',  rph:90,  pph:0.4,  cost:900,  cat:'🌟 Legends'},
    {id:'celestial',  e:'🌟', n:'Celestial',        rph:111, pph:0.45, cost:1110, cat:'🌟 Legends'},
    {id:'deity',      e:'👁️', n:'Deity',            rph:135, pph:0.5,  cost:1350, cat:'🌟 Legends'},
    {id:'cosmicbeing',e:'🌌', n:'Cosmic Being',     rph:165, pph:0.6,  cost:1650, cat:'🌟 Legends'},
  ];
  window.SERVANTS = SERVANTS;

  function ensureItems(acc) {
    if (!acc.shopItems)    acc.shopItems    = { speed:0, attack:0, petluck:0, potion:0 };
    if (!acc.homePets)     acc.homePets     = [];
    if (!acc.rubies)       acc.rubies       = 0;
    if (!acc.highestLevel) acc.highestLevel = 0;
    if (!acc.weapons)           acc.weapons           = {};
    if (!acc.activeWeapon)      acc.activeWeapon      = null;
    if (!acc.servants)          acc.servants          = {};
    if (!acc.lastServantCollect)acc.lastServantCollect = Date.now();
    return acc;
  }

function speciesCount(acc, petId) {
    return acc.homePets.filter(function(p) { return p.id === petId; }).length;
  }

  function petStrength(p) {
    return (p.cost || 0) + (p.atk || 0) * 2 + (p.heal || 0) + Math.round((p.sc || 0) * 100);
  }

  function pickBattlePets(homePets) {
    var seen = {};
    var passed = (homePets || []).filter(function(p) {
      if (seen[p.id]) return false;
      var str    = petStrength(p);
      var chance = 0.25 / (1 + str / 100);
      if (Math.random() >= chance) return false;
      seen[p.id] = true;
      return true;
    });
    return passed.sort(function(a, b) { return petStrength(b) - petStrength(a); }).slice(0, 5);
  }

  function getWeaponConfig(acc) {
    var id = acc.activeWeapon;
    if (!id || !acc.weapons[id]) return {};
    var weapons = window.WEAPONS || [];
    var w = null;
    for (var i = 0; i < weapons.length; i++) { if (weapons[i].id === id) { w = weapons[i]; break; } }
    if (!w) return {};
    var COLORS = { Close:'#ff6644', Medium:'#ffd700', Far:'#44ddff', 'Very Far':'#88ff88', Magic:'#dd88ff' };
    return { weaponDmg: w.dmg, weaponRange: w.range, weaponLevel: acc.weapons[id], weaponColor: COLORS[w.cat] || '#fff' };
  }

  // ── Screen management ─────────────────────────────────────────────────────
  var SCREENS = ['screen-hub','screen-meta-shop','screen-result','screen-weapons','screen-servants'];

  function showScreen(id) {
    SCREENS.forEach(function(s) { var el = document.getElementById(s); if (el) el.style.display = 'none'; });
    var wrap = document.getElementById('wrap');
    if (wrap) wrap.style.display = 'none';
    if (id === 'game') {
      if (wrap) wrap.style.display = 'block';
    } else {
      var el = document.getElementById(id);
      if (el) el.style.display = 'flex';
    }
  }


  // ── Hub ───────────────────────────────────────────────────────────────────
  function showHub() {
    var acc = ensureItems(getAccount());
    document.getElementById('hub-rubies').textContent = acc.rubies + ' 🔴';
    document.getElementById('hub-best').textContent   = 'Best: Level ' + acc.highestLevel;
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
    var acc = ensureItems(getAccount());
    var wc  = getWeaponConfig(acc);
    var config = Object.assign({ speed: acc.shopItems.speed||0, attack: acc.shopItems.attack||0,
                   petluck: acc.shopItems.petluck||0, potion: acc.shopItems.potion||0 }, wc);
    acc.shopItems = { speed:0, attack:0, petluck:0, potion:0 };
    saveAccount(acc);
    showScreen('game');
    if (window.META_startGame) window.META_startGame(config, pickBattlePets(acc.homePets));
  };

  window.META_onRunEnd = function (won, pets, level, homePetUIDs) {
    var acc = ensureItems(getAccount());
    if (level > acc.highestLevel) acc.highestLevel = level;
    acc.rubies += level;
    var petsGoingHome = [];
    (pets || []).forEach(function(p) {
      if (homePetUIDs && homePetUIDs[p.uid]) return;
      if (Math.random() < 0.30 && speciesCount(acc, p.id) < 30) {
        var hp = { id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' };
        petsGoingHome.push(hp); acc.homePets.push(hp);
      }
    });
    saveAccount(acc);
    var titleEl = document.getElementById('result-title');
    titleEl.textContent = '💀 You Died';
    titleEl.style.color = '#ff5050';
    document.getElementById('result-level').textContent  = 'Level reached: ' + level;
    document.getElementById('result-rubies').textContent = '+' + level + ' 🔴 rubies';
    var petsEl = document.getElementById('result-pets');
    var homePetCount = Object.keys(homePetUIDs || {}).length;
    if (petsGoingHome.length > 0) {
      petsEl.innerHTML = '<div class="result-pets-title">New pets going home:</div>' +
        petsGoingHome.map(function(p) { return '<span class="result-pet">' + p.e + ' ' + p.n + '</span>'; }).join('') +
        (homePetCount ? '<div class="result-note">' + homePetCount + ' home pet(s) returned safely.</div>' : '');
    } else {
      petsEl.innerHTML = '<div class="result-note">' +
        (homePetCount ? homePetCount + ' home pet(s) returned safely. ' : '') +
        'No new pets this run.</div>';
    }
    showScreen('screen-result');
  };

  // ── Meta Shop ─────────────────────────────────────────────────────────────
  var META_ITEMS = [
    { id:'speed',   e:'⚡', n:'Speed Scroll', d:'+15% speed in next run',      cost:35 },
    { id:'attack',  e:'💪', n:'Power Gem',     d:'+16 attack in next run',      cost:40 },
    { id:'petluck', e:'🍀', n:'Lucky Clover',  d:'+16% pet chance in next run', cost:50 },
    { id:'potion',  e:'🧪', n:'Health Potion', d:'+30 max HP in next run',      cost:30 }
  ];

  window.showMetaShop = function () { renderMetaShop(); showScreen('screen-meta-shop'); };

  function renderMetaShop() {
    var acc = ensureItems(getAccount());
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
    var acc  = ensureItems(getAccount());
    var item = META_ITEMS.find(function(i) { return i.id === id; });
    if (!item || acc.rubies < item.cost) return;
    acc.rubies -= item.cost;
    acc.shopItems[id] = (acc.shopItems[id] || 0) + 1;
    saveAccount(acc); renderMetaShop();
  };

  // ── Servants ──────────────────────────────────────────────────────────────
  window.showServants = function () {
    var acc = ensureItems(getAccount());
    renderServants(acc);
    showScreen('screen-servants');
  };

  function renderServants(acc) {
    var rubEl = document.getElementById('servant-rubies');
    if (rubEl) rubEl.textContent = acc.rubies + ' 🔴';
    var pending = calcServantIncome(acc);
    var pendEl = document.getElementById('servant-pending');
    if (pendEl) pendEl.textContent = pending.rubies > 0 || pending.pets > 0
      ? '📦 Ready to collect: +' + pending.rubies + ' 🔴' + (pending.pets > 0 ? ' · +' + pending.pets + ' pet(s)' : '')
      : 'Servants are working… check back later!';
    var grid = document.getElementById('servant-grid');
    if (!grid) return;
    var cats = ['⚔️ Knights','🤖 Robots','🧙 Witches','💊 Healers','🌟 Legends'];
    var html = '';
    cats.forEach(function(cat) {
      html += '<div class="weapon-cat-title">' + cat + '</div><div class="weapon-cat-grid">';
      SERVANTS.filter(function(sv) { return sv.cat === cat; }).forEach(function(sv) {
        var owned   = acc.servants[sv.id] || 0;
        var canBuy  = acc.rubies >= sv.cost;
        var safeId  = sv.id.replace(/'/g, "\\'");
        html += '<div class="weapon-item">' +
          '<div class="weapon-emoji">' + sv.e + '</div>' +
          '<div class="weapon-name">' + sv.n + '</div>' +
          '<div class="weapon-stats">+' + sv.rph + ' 🔴/hr' + (sv.pph > 0 ? ' · ' + Math.round(sv.pph*100) + '% pet/hr' : '') + '</div>' +
          (owned ? '<div class="weapon-level">Owned: ' + owned + '</div>' : '') +
          '<div class="weapon-btns"><button class="weapon-btn weapon-buy' + (canBuy ? '' : ' cant-buy') + '"' +
          (canBuy ? ' onclick="buyServant(\'' + safeId + '\')"' : ' disabled') + '>' +
          'Buy ' + sv.cost + ' 🔴</button></div></div>';
      });
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  function calcServantIncome(acc) {
    var elapsed  = Math.min(24 * 3600000, Date.now() - (acc.lastServantCollect || Date.now()));
    var hours    = elapsed / 3600000;
    var rubies   = 0, pets = 0;
    SERVANTS.forEach(function(sv) {
      var count = acc.servants[sv.id] || 0;
      if (!count) return;
      rubies += Math.floor(sv.rph * count * hours);
      pets   += Math.floor(sv.pph * count * hours);
    });
    return { rubies: rubies, pets: pets };
  }

  window.buyServant = function (id) {
    var acc = ensureItems(getAccount());
    var sv  = SERVANTS.find(function(x) { return x.id === id; });
    if (!sv || acc.rubies < sv.cost) return;
    acc.rubies -= sv.cost;
    acc.servants[id] = (acc.servants[id] || 0) + 1;
    saveAccount(acc);
    renderServants(acc);
  };

  window.collectServants = function () {
    var acc     = ensureItems(getAccount());
    var income  = calcServantIncome(acc);
    if (income.rubies === 0 && income.pets === 0) return;
    acc.rubies += income.rubies;
    var petPool = (window.PETS || []).slice(0, 15);
    for (var i = 0; i < income.pets; i++) {
      var p = petPool[Math.floor(Math.random() * petPool.length)];
      if (speciesCount(acc, p.id) < 30) {
        acc.homePets.push({ id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' });
      }
    }
    acc.lastServantCollect = Date.now();
    saveAccount(acc);
    renderServants(acc);
  };

  // ── Weapon Shop ───────────────────────────────────────────────────────────
  var WEAPON_CATS = ['Close','Medium','Far','Very Far','Magic'];
  var WEAPON_CAT_LABELS = { Close:'⚔️ Close Range', Medium:'🔱 Medium Range', Far:'🪃 Far Range', 'Very Far':'🏹 Very Far Range', Magic:'🪄 Magic' };

  window.showWeapons = function () {
    renderWeapons(ensureItems(getAccount()));
    showScreen('screen-weapons');
  };

  function renderWeapons(acc) {
    acc = ensureItems(acc);
    var weapons = window.WEAPONS || [];
    var el = document.getElementById('weapon-rubies');
    if (el) el.textContent = acc.rubies + ' 🔴';
    var activeId = acc.activeWeapon;
    var grid = document.getElementById('weapon-grid');
    if (!grid) return;
    var html = '';
    WEAPON_CATS.forEach(function(cat) {
      html += '<div class="weapon-cat-title">' + WEAPON_CAT_LABELS[cat] + '</div>';
      html += '<div class="weapon-cat-grid">';
      weapons.filter(function(w) { return w.cat === cat; }).forEach(function(w) {
        var owned = acc.weapons[w.id] || 0;
        var isActive = activeId === w.id;
        var canBuy = acc.rubies >= w.cost;
        var lvl = owned || 0;
        var safeName = w.id.replace(/'/g, "\\'");
        html += '<div class="weapon-item' + (isActive ? ' weapon-active' : '') + '">' +
          '<div class="weapon-emoji">' + w.e + '</div>' +
          '<div class="weapon-name">' + w.n + '</div>' +
          '<div class="weapon-stats">⚔️ ' + w.dmg * (lvl||1) + ' dmg &nbsp; 📏 ' + w.range + ' range</div>' +
          (lvl > 1 ? '<div class="weapon-level">Level ' + lvl + ' (×' + lvl + ')</div>' : '') +
          '<div class="weapon-btns">' +
          (owned
            ? '<button class="weapon-btn weapon-upgrade' + (canBuy ? '' : ' cant-buy') + '"' +
              (canBuy ? ' onclick="buyWeapon(\'' + safeName + '\')"' : ' disabled') + '>' +
              'Upgrade ' + w.cost + '🔴</button>' +
              '<button class="weapon-btn weapon-equip' + (isActive ? ' weapon-equipped' : '') + '" onclick="equipWeapon(\'' + safeName + '\')">' +
              (isActive ? '✓ Equipped' : 'Equip') + '</button>'
            : '<button class="weapon-btn weapon-buy' + (canBuy ? '' : ' cant-buy') + '"' +
              (canBuy ? ' onclick="buyWeapon(\'' + safeName + '\')"' : ' disabled') + '>' +
              'Buy ' + w.cost + '🔴</button>'
          ) +
          '</div></div>';
      });
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  window.buyWeapon = function (id) {
    var acc = ensureItems(getAccount());
    var weapons = window.WEAPONS || [];
    var w = null;
    for (var i = 0; i < weapons.length; i++) { if (weapons[i].id === id) { w = weapons[i]; break; } }
    if (!w || acc.rubies < w.cost) return;
    acc.rubies -= w.cost;
    acc.weapons[id] = (acc.weapons[id] || 0) + 1;
    if (!acc.activeWeapon) acc.activeWeapon = id;
    saveAccount(acc);
    renderWeapons(acc);
  };

  window.equipWeapon = function (id) {
    var acc = ensureItems(getAccount());
    if (!acc.weapons[id]) return;
    acc.activeWeapon = id;
    saveAccount(acc);
    renderWeapons(acc);
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var acc = loadAccount();
    if (!acc) acc = {};
    ensureItems(acc);
    _account = acc;
    showHub();
  });
})();
