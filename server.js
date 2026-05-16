const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 5500;
const DB   = path.join(__dirname, 'accounts.json');

app.use(express.json());
app.use(express.static(__dirname));

// ── In-memory presence & chat ─────────────────────────────────────────────
var online = {};  // { name: lastSeenTimestamp }
var chats  = {};  // { 'roomId': [{from, msg, time}] }

function chatRoom(a, b) { return [a, b].sort().join('__'); }
function isOnline(name) { return !!(online[name] && Date.now() - online[name] < 30000); }

// ── DB helpers ────────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch(e) { return {}; }
}
function save(data) { fs.writeFileSync(DB, JSON.stringify(data, null, 2)); }

// ── Accounts ──────────────────────────────────────────────────────────────
app.get('/api/accounts', (req, res) => {
  var db  = load();
  var pub = {};
  Object.keys(db).forEach(n => {
    pub[n] = { rubies: db[n].rubies, homePets: db[n].homePets, highestLevel: db[n].highestLevel };
  });
  res.json(pub);
});

app.post('/api/login', (req, res) => {
  var { name } = req.body;
  var db = load();
  if (!db[name]) return res.json({ ok: false, error: 'Name not found. Create an account first.' });
  res.json({ ok: true, account: db[name] });
});

app.post('/api/register', (req, res) => {
  var { name } = req.body;
  if (!name || name.length < 2) return res.json({ ok: false, error: 'Name must be 2+ characters.' });
  var db = load();
  if (db[name]) return res.json({ ok: false, error: 'Name already taken.' });
  db[name] = { rubies: 0, homePets: [], highestLevel: 0, lastWorked: 0,
               shopItems: { speed: 0, attack: 0, petluck: 0, potion: 0 } };
  save(db);
  res.json({ ok: true, account: db[name] });
});

app.post('/api/accounts/:name', (req, res) => {
  var { name } = req.params;
  var { data } = req.body;
  var db = load();
  if (!db[name]) return res.json({ ok: false, error: 'Account not found.' });
  db[name] = Object.assign({}, db[name], data);
  save(db);
  res.json({ ok: true });
});

// ── Work reward (employer gets rubies + strongest pet) ────────────────────
app.post('/api/work-reward/:name', (req, res) => {
  var { name } = req.params;
  var { rubies, pet } = req.body;
  var db = load();
  if (!db[name]) return res.json({ ok: false });
  db[name].rubies = (db[name].rubies || 0) + (rubies || 0);
  if (pet) db[name].homePets = (db[name].homePets || []).concat([pet]);
  save(db);
  res.json({ ok: true });
});

// ── Servant income collection ─────────────────────────────────────────────
app.post('/api/collect/:name', (req, res) => {
  var { name } = req.params;
  var { servants, lastCollect } = req.body;
  var db = load();
  if (!db[name]) return res.json({ ok: false });
  res.json({ ok: true, serverTime: Date.now() });
});

// ── Presence ──────────────────────────────────────────────────────────────
app.post('/api/ping', (req, res) => {
  var { name } = req.body;
  if (!name) return res.json({ ok: false });
  online[name] = Date.now();
  res.json({ ok: true });
});

app.get('/api/online', (req, res) => {
  var alive = {};
  Object.keys(online).forEach(n => { if (isOnline(n)) alive[n] = true; });
  res.json(alive);
});

// ── Chat ──────────────────────────────────────────────────────────────────
app.post('/api/chat/:room', (req, res) => {
  var { room } = req.params;
  var { name, msg } = req.body;
  if (!name || !msg || !msg.trim()) return res.json({ ok: false });
  if (!chats[room]) chats[room] = [];
  chats[room].push({ from: name, msg: msg.trim().slice(0, 200), time: Date.now() });
  if (chats[room].length > 100) chats[room] = chats[room].slice(-100);
  res.json({ ok: true });
});

app.get('/api/chat/:room', (req, res) => {
  var { room } = req.params;
  var since = parseInt(req.query.since) || 0;
  res.json((chats[room] || []).filter(m => m.time > since));
});

// ── Trades ────────────────────────────────────────────────────────────────
var tradeRequests = {}; // { targetName: [{ id, from, offer, want, ts }] }

app.post('/api/trade/request', (req, res) => {
  var { from, to, offer, want } = req.body;
  if (!from || !to || !offer || !want) return res.json({ ok: false });
  var db = load();
  if (!db[from] || !db[to]) return res.json({ ok: false, error: 'Player not found.' });
  if (!tradeRequests[to]) tradeRequests[to] = [];
  // Remove old request from same sender
  tradeRequests[to] = tradeRequests[to].filter(function(r) { return r.from !== from; });
  tradeRequests[to].push({ id: Date.now() + '_' + from, from, offer, want, ts: Date.now() });
  res.json({ ok: true });
});

app.get('/api/trade/pending/:name', (req, res) => {
  var reqs = (tradeRequests[req.params.name] || []).filter(function(r) { return Date.now() - r.ts < 300000; });
  tradeRequests[req.params.name] = reqs;
  res.json(reqs);
});

app.post('/api/trade/respond', (req, res) => {
  var { name, tradeId, accept } = req.body;
  if (!name || !tradeId) return res.json({ ok: false });
  var reqs = tradeRequests[name] || [];
  var trade = reqs.find(function(r) { return r.id === tradeId; });
  if (!trade) return res.json({ ok: false, error: 'Trade expired.' });
  tradeRequests[name] = reqs.filter(function(r) { return r.id !== tradeId; });
  if (!accept) return res.json({ ok: true, accepted: false });

  var db = load();
  var fromAcc = db[trade.from], toAcc = db[name];
  if (!fromAcc || !toAcc) return res.json({ ok: false });

  // Remove offered pets from sender
  trade.offer.forEach(function(op) {
    var idx = fromAcc.homePets.findIndex(function(p) { return p.id === op.id; });
    if (idx >= 0) fromAcc.homePets.splice(idx, 1);
  });
  // Remove wanted pets from receiver
  trade.want.forEach(function(wp) {
    var idx = toAcc.homePets.findIndex(function(p) { return p.id === wp.id; });
    if (idx >= 0) toAcc.homePets.splice(idx, 1);
  });
  // Swap
  trade.offer.forEach(function(p) { toAcc.homePets.push(p); });
  trade.want.forEach(function(p) { fromAcc.homePets.push(p); });

  save(db);
  res.json({ ok: true, accepted: true });
});

// ── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  var os = require('os');
  var ip = Object.values(os.networkInterfaces()).flat().find(i => i.family === 'IPv4' && !i.internal);
  console.log('Animal Friend RPG running!');
  console.log('  Local:   http://localhost:' + PORT);
  if (ip) console.log('  Network: http://' + ip.address + ':' + PORT + '  ← share with friends on same WiFi');
});
