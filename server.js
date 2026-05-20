const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const app  = express();
const PORT = 5500;
const DB   = path.join(__dirname, 'accounts.json');

app.use(express.json());
app.use(express.static(__dirname));

// ── In-memory state ──────────────────────────────────────────────────────────
var online      = {};  // { name: lastSeenTs }
var chats       = {};  // { roomId: [{from,msg,time}] }
var tradePend   = {};  // { name: [tradeObj] }
var coopRooms   = {};  // { roomId: roomObj }
var coopInvites = {};  // { name: {roomId,from,ts} }

// ── DB ───────────────────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch(e) { return {}; }
}
function save(db) { fs.writeFileSync(DB, JSON.stringify(db, null, 2)); }

// ── Crypto ───────────────────────────────────────────────────────────────────
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function genToken() { return crypto.randomBytes(24).toString('hex'); }
function isOnline(name) { return !!(online[name] && Date.now() - online[name] < 30000); }

// ── Auth middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  var name  = req.headers['x-name']  || '';
  var token = req.headers['x-token'] || '';
  if (!name || !token) return res.status(401).json({ ok:false, error:'Not logged in.' });
  var db = load();
  if (!db[name] || db[name].token !== token) return res.status(401).json({ ok:false, error:'Invalid session.' });
  req.acc  = db[name];
  req.name = name;
  req.db   = db;
  next();
}

// ── Register ─────────────────────────────────────────────────────────────────
app.post('/api/register', (req, res) => {
  var { name, password } = req.body;
  if (!name || name.length < 2 || name.length > 20)
    return res.json({ ok:false, error:'Name must be 2-20 characters.' });
  if (!/^[a-zA-Z0-9_]+$/.test(name))
    return res.json({ ok:false, error:'Name: letters, numbers and _ only.' });
  if (!password || password.length < 4)
    return res.json({ ok:false, error:'Password must be 4+ characters.' });
  var db = load();
  if (db[name]) return res.json({ ok:false, error:'Name already taken.' });
  var token = genToken();
  db[name] = { passwordHash:sha256(password), token, friends:[], friendRequests:[], gameData:{} };
  save(db);
  res.json({ ok:true, token, name, gameData:{} });
});

// ── Login ─────────────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  var { name, password } = req.body;
  if (!name || !password) return res.json({ ok:false, error:'Name and password required.' });
  var db  = load();
  var acc = db[name];
  if (!acc) return res.json({ ok:false, error:'Account not found.' });
  // Support migration from legacy plaintext passwords
  var valid = false;
  if (acc.passwordHash) {
    valid = acc.passwordHash === sha256(password);
  } else if (acc.password) {
    valid = acc.password === password;
    if (valid) { acc.passwordHash = sha256(password); delete acc.password; }
  }
  if (!valid) return res.json({ ok:false, error:'Wrong password.' });
  var token = genToken();
  acc.token = token;
  if (!acc.friends)        acc.friends        = [];
  if (!acc.friendRequests) acc.friendRequests = [];
  if (!acc.gameData)       acc.gameData       = {};
  save(db);
  res.json({ ok:true, token, name, gameData:acc.gameData });
});

// ── Save / Load game data ─────────────────────────────────────────────────────
app.post('/api/save', auth, (req, res) => {
  req.db[req.name].gameData = req.body.gameData || {};
  save(req.db);
  res.json({ ok:true });
});

app.get('/api/save', auth, (req, res) => {
  res.json({ ok:true, gameData:req.acc.gameData || {} });
});

// ── Friends ───────────────────────────────────────────────────────────────────
app.post('/api/friends/request', auth, (req, res) => {
  var { to } = req.body;
  var db = req.db;
  if (!db[to]) return res.json({ ok:false, error:'Player not found.' });
  if (to === req.name) return res.json({ ok:false, error:'Cannot add yourself.' });
  if ((req.acc.friends||[]).indexOf(to) >= 0) return res.json({ ok:false, error:'Already friends.' });
  var reqs = db[to].friendRequests || [];
  if (reqs.indexOf(req.name) < 0) reqs.push(req.name);
  db[to].friendRequests = reqs;
  save(db);
  res.json({ ok:true });
});

app.get('/api/friends', auth, (req, res) => {
  var db  = req.db;
  var acc = req.acc;
  var friends = (acc.friends || []).map(function(n) {
    var f  = db[n]; if (!f) return null;
    var gd = f.gameData || {};
    return { name:n, online:isOnline(n), level:gd.highestLevel||0, rubies:gd.rubies||0, pets:(gd.homePets||[]).length };
  }).filter(Boolean);
  res.json({ ok:true, friends, requests:acc.friendRequests||[] });
});

app.post('/api/friends/accept', auth, (req, res) => {
  var { from } = req.body;
  var db  = req.db;
  var acc = req.acc;
  if ((acc.friendRequests||[]).indexOf(from) < 0) return res.json({ ok:false, error:'No request from that player.' });
  if (!db[from]) return res.json({ ok:false, error:'Player not found.' });
  acc.friendRequests = (acc.friendRequests||[]).filter(function(r) { return r !== from; });
  if (!acc.friends) acc.friends = [];
  if (acc.friends.indexOf(from) < 0) acc.friends.push(from);
  if (!db[from].friends) db[from].friends = [];
  if (db[from].friends.indexOf(req.name) < 0) db[from].friends.push(req.name);
  save(db);
  res.json({ ok:true });
});

app.post('/api/friends/reject', auth, (req, res) => {
  var { from } = req.body;
  req.acc.friendRequests = (req.acc.friendRequests||[]).filter(function(r) { return r !== from; });
  save(req.db);
  res.json({ ok:true });
});

app.delete('/api/friends/:name', auth, (req, res) => {
  var other = req.params.name;
  var db = req.db;
  req.acc.friends = (req.acc.friends||[]).filter(function(n) { return n !== other; });
  if (db[other]) db[other].friends = (db[other].friends||[]).filter(function(n) { return n !== req.name; });
  save(db);
  res.json({ ok:true });
});

app.get('/api/user/:name', auth, (req, res) => {
  var db = req.db;
  var u  = db[req.params.name];
  if (!u) return res.json({ ok:false, error:'Player not found.' });
  var gd = u.gameData || {};
  var pets = (gd.homePets||[]).map(function(p) { return { id:p.id, e:p.e, n:p.n, uid:p.uid }; });
  res.json({ ok:true, name:req.params.name, online:isOnline(req.params.name), level:gd.highestLevel||0, rubies:gd.rubies||0, pets });
});

// ── Leaderboard ───────────────────────────────────────────────────────────────
app.get('/api/leaderboard', (req, res) => {
  var db = load();
  var rows = Object.keys(db).map(function(name) {
    var gd = db[name].gameData || {};
    return { name, level:gd.highestLevel||0, rubies:gd.rubies||0, pets:(gd.homePets||[]).length };
  });
  rows.sort(function(a, b) { return b.level - a.level || b.rubies - a.rubies; });
  res.json(rows.slice(0, 50));
});

// ── Co-op ─────────────────────────────────────────────────────────────────────
app.post('/api/coop/create', auth, (req, res) => {
  var roomId = req.name + '_' + Date.now();
  coopRooms[roomId] = { host:req.name, guest:null, hostState:{}, guestState:{}, createdAt:Date.now() };
  res.json({ ok:true, roomId });
});

app.post('/api/coop/invite', auth, (req, res) => {
  var { to, roomId } = req.body;
  if (!req.db[to]) return res.json({ ok:false, error:'Player not found.' });
  coopInvites[to] = { roomId, from:req.name, ts:Date.now() };
  res.json({ ok:true });
});

app.get('/api/coop/invite', auth, (req, res) => {
  var inv = coopInvites[req.name];
  if (!inv || Date.now() - inv.ts > 120000) { delete coopInvites[req.name]; return res.json({ ok:true, invite:null }); }
  res.json({ ok:true, invite:inv });
});

app.post('/api/coop/join', auth, (req, res) => {
  var { roomId } = req.body;
  var room = coopRooms[roomId];
  if (!room) return res.json({ ok:false, error:'Room not found.' });
  room.guest = req.name;
  delete coopInvites[req.name];
  res.json({ ok:true, host:room.host });
});

app.post('/api/coop/update', auth, (req, res) => {
  var { roomId, state } = req.body;
  var room = coopRooms[roomId];
  if (!room) return res.json({ ok:false });
  if (room.host === req.name) room.hostState = state;
  else if (room.guest === req.name) room.guestState = state;
  res.json({ ok:true });
});

app.get('/api/coop/:roomId', auth, (req, res) => {
  var room = coopRooms[req.params.roomId];
  if (!room) return res.json({ ok:false });
  var isHost       = room.host === req.name;
  var partnerState = isHost ? room.guestState : room.hostState;
  var partnerName  = isHost ? room.guest      : room.host;
  res.json({ ok:true, partnerName, partnerState:partnerState||{}, guest:room.guest });
});

app.post('/api/coop/leave', auth, (req, res) => {
  var { roomId } = req.body;
  delete coopRooms[roomId];
  res.json({ ok:true });
});

// ── Trade ─────────────────────────────────────────────────────────────────────
app.post('/api/trade/request', auth, (req, res) => {
  var { to, offer, want } = req.body;
  if (!req.db[to]) return res.json({ ok:false, error:'Player not found.' });
  if (!tradePend[to]) tradePend[to] = [];
  tradePend[to] = tradePend[to].filter(function(r) { return r.from !== req.name; });
  tradePend[to].push({ id:Date.now()+'_'+req.name, from:req.name, offer, want, ts:Date.now() });
  res.json({ ok:true });
});

app.get('/api/trade/pending', auth, (req, res) => {
  var reqs = (tradePend[req.name]||[]).filter(function(r) { return Date.now() - r.ts < 300000; });
  tradePend[req.name] = reqs;
  res.json(reqs);
});

app.post('/api/trade/respond', auth, (req, res) => {
  var { tradeId, accept } = req.body;
  var reqs  = tradePend[req.name] || [];
  var trade = reqs.find(function(r) { return r.id === tradeId; });
  if (!trade) return res.json({ ok:false, error:'Trade expired.' });
  tradePend[req.name] = reqs.filter(function(r) { return r.id !== tradeId; });
  if (!accept) return res.json({ ok:true, accepted:false });

  var db      = load();
  var fromAcc = db[trade.from];
  var toAcc   = db[req.name];
  if (!fromAcc || !toAcc) return res.json({ ok:false });
  var fromGD = fromAcc.gameData || {};
  var toGD   = toAcc.gameData   || {};
  fromGD.homePets = fromGD.homePets || [];
  toGD.homePets   = toGD.homePets   || [];

  // Transfer offered pets from sender to receiver
  (trade.offer.pets||[]).forEach(function(pet) {
    fromGD.homePets = fromGD.homePets.filter(function(p) { return p.uid !== pet.uid; });
    toGD.homePets.push(pet);
  });
  // Transfer wanted pets from receiver to sender
  (trade.want.pets||[]).forEach(function(pet) {
    toGD.homePets = toGD.homePets.filter(function(p) { return p.uid !== pet.uid; });
    fromGD.homePets.push(pet);
  });
  // Transfer rubies
  var offerRubies = trade.offer.rubies || 0;
  var wantRubies  = trade.want.rubies  || 0;
  fromGD.rubies = Math.max(0, (fromGD.rubies||0) - offerRubies + wantRubies);
  toGD.rubies   = Math.max(0, (toGD.rubies||0)   - wantRubies  + offerRubies);

  fromAcc.gameData = fromGD;
  toAcc.gameData   = toGD;
  save(db);
  res.json({ ok:true, accepted:true, myNewData:{ homePets:toGD.homePets, rubies:toGD.rubies } });
});

// ── Chat ──────────────────────────────────────────────────────────────────────
app.post('/api/chat/:room', auth, (req, res) => {
  var { msg } = req.body;
  if (!msg || !msg.trim()) return res.json({ ok:false });
  var room = req.params.room;
  if (!chats[room]) chats[room] = [];
  chats[room].push({ from:req.name, msg:msg.trim().slice(0,200), time:Date.now() });
  if (chats[room].length > 100) chats[room] = chats[room].slice(-100);
  res.json({ ok:true });
});

app.get('/api/chat/:room', auth, (req, res) => {
  var since = parseInt(req.query.since) || 0;
  res.json((chats[req.params.room]||[]).filter(function(m) { return m.time > since; }));
});

// ── Presence ──────────────────────────────────────────────────────────────────
app.post('/api/ping', (req, res) => {
  var name = req.body && req.body.name;
  if (name) online[name] = Date.now();
  res.json({ ok:true });
});

app.get('/api/online', (req, res) => {
  var alive = {};
  Object.keys(online).forEach(function(n) { if (isOnline(n)) alive[n] = true; });
  res.json(alive);
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  var os    = require('os');
  var iface = Object.values(os.networkInterfaces()).flat().find(function(i) { return i.family === 'IPv4' && !i.internal; });
  console.log('\n🎮 Animal Friend RPG server running!');
  console.log('  Local:   http://localhost:' + PORT);
  if (iface) console.log('  Network: http://' + iface.address + ':' + PORT + '  ← share with friends on same WiFi\n');
});
