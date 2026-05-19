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

  var CHARACTERS = [
    // ── Bears (starter class — bear is free) ────────────────
    {id:'brownbear',   e:'🐻', n:'Brown Bear',     cat:'🐻 Bears',      cost:0,    atkBonus:0,   blast:'damage', blastPow:1.0},
    {id:'blackbear',   e:'🐻', n:'Black Bear',     cat:'🐻 Bears',      cost:80,   atkBonus:5,   blast:'heal',   blastPow:1.0},
    {id:'grizzly',     e:'🐻', n:'Grizzly Bear',   cat:'🐻 Bears',      cost:200,  atkBonus:12,  blast:'slow',   blastPow:1.0},
    {id:'cavebear',    e:'🐻', n:'Cave Bear',      cat:'🐻 Bears',      cost:400,  atkBonus:22,  blast:'weaken', blastPow:1.0},
    {id:'kodiakbear',  e:'🐻', n:'Kodiak Bear',    cat:'🐻 Bears',      cost:700,  atkBonus:35,  blast:'dig',    blastPow:1.5},
    {id:'spiritbear',  e:'🐻', n:'Spirit Bear',    cat:'🐻 Bears',      cost:1100, atkBonus:50,  blast:'damage', blastPow:2.0},
    {id:'guardianbear',e:'🐻', n:'Guardian Bear',  cat:'🐻 Bears',      cost:1600, atkBonus:68,  blast:'heal',   blastPow:2.0},
    {id:'ancientbear', e:'🐻', n:'Ancient Bear',   cat:'🐻 Bears',      cost:2200, atkBonus:88,  blast:'damage', blastPow:3.0},
    {id:'titanbear',   e:'🐻', n:'Titan Bear',     cat:'🐻 Bears',      cost:3000, atkBonus:110, blast:'dig',    blastPow:3.0},
    {id:'cosmicbear',  e:'🐻', n:'Cosmic Bear',    cat:'🐻 Bears',      cost:4000, atkBonus:140, blast:'damage', blastPow:5.0},
    // ── Knights ─────────────────────────────────────────────
    {id:'squire2',     e:'🛡️', n:'Squire',         cat:'⚔️ Knights',    cost:100,  atkBonus:8,   blast:'damage', blastPow:1.2},
    {id:'soldier2',    e:'⚔️', n:'Soldier',        cat:'⚔️ Knights',    cost:200,  atkBonus:16,  blast:'damage', blastPow:1.4},
    {id:'knight2',     e:'🏇', n:'Knight',         cat:'⚔️ Knights',    cost:350,  atkBonus:26,  blast:'damage', blastPow:1.6},
    {id:'elitek',      e:'⚔️', n:'Elite Knight',   cat:'⚔️ Knights',    cost:550,  atkBonus:38,  blast:'damage', blastPow:1.8},
    {id:'champ2',      e:'🏆', n:'Champion',       cat:'⚔️ Knights',    cost:800,  atkBonus:52,  blast:'damage', blastPow:2.0},
    {id:'warlord2',    e:'🗡️', n:'Warlord',        cat:'⚔️ Knights',    cost:1100, atkBonus:68,  blast:'damage', blastPow:2.5},
    {id:'hero2',       e:'🦸', n:'Hero',           cat:'⚔️ Knights',    cost:1500, atkBonus:86,  blast:'damage', blastPow:3.0},
    {id:'legend2',     e:'👑', n:'Legend',         cat:'⚔️ Knights',    cost:2000, atkBonus:106, blast:'damage', blastPow:3.5},
    {id:'crusader',    e:'⚜️', n:'Crusader',       cat:'⚔️ Knights',    cost:2600, atkBonus:130, blast:'damage', blastPow:4.0},
    {id:'eternalk2',   e:'✨', n:'Eternal Knight', cat:'⚔️ Knights',    cost:3500, atkBonus:160, blast:'damage', blastPow:5.0},
    // ── Archers ──────────────────────────────────────────────
    {id:'hunter',      e:'🏹', n:'Hunter',         cat:'🏹 Archers',    cost:75,   atkBonus:6,   blast:'slow',   blastPow:1.0},
    {id:'scout',       e:'🏹', n:'Scout',          cat:'🏹 Archers',    cost:160,  atkBonus:14,  blast:'slow',   blastPow:1.2},
    {id:'ranger2',     e:'🏹', n:'Ranger',         cat:'🏹 Archers',    cost:280,  atkBonus:24,  blast:'slow',   blastPow:1.4},
    {id:'tracker',     e:'🏹', n:'Tracker',        cat:'🏹 Archers',    cost:440,  atkBonus:36,  blast:'slow',   blastPow:1.6},
    {id:'sharpshot',   e:'🎯', n:'Sharpshooter',   cat:'🏹 Archers',    cost:640,  atkBonus:50,  blast:'slow',   blastPow:2.0},
    {id:'woodsman',    e:'🌲', n:'Woodsman',       cat:'🏹 Archers',    cost:880,  atkBonus:66,  blast:'slow',   blastPow:2.5},
    {id:'bladedancer', e:'🏹', n:'Blade Dancer',   cat:'🏹 Archers',    cost:1200, atkBonus:84,  blast:'slow',   blastPow:3.0},
    {id:'windwalker',  e:'💨', n:'Wind Walker',    cat:'🏹 Archers',    cost:1600, atkBonus:104, blast:'slow',   blastPow:3.5},
    {id:'skyarcher',   e:'☁️', n:'Sky Archer',     cat:'🏹 Archers',    cost:2100, atkBonus:128, blast:'slow',   blastPow:4.0},
    {id:'godbow',      e:'🌟', n:'God Bow',        cat:'🏹 Archers',    cost:2800, atkBonus:158, blast:'slow',   blastPow:5.0},
    // ── Wizards ──────────────────────────────────────────────
    {id:'apprentice2', e:'🪄', n:'Apprentice',     cat:'🧙 Wizards',    cost:90,   atkBonus:7,   blast:'weaken', blastPow:1.0},
    {id:'mage2',       e:'🔮', n:'Mage',           cat:'🧙 Wizards',    cost:180,  atkBonus:15,  blast:'weaken', blastPow:1.2},
    {id:'sorcerer2',   e:'🌙', n:'Sorcerer',       cat:'🧙 Wizards',    cost:320,  atkBonus:25,  blast:'weaken', blastPow:1.4},
    {id:'warlock2',    e:'🌑', n:'Warlock',        cat:'🧙 Wizards',    cost:500,  atkBonus:37,  blast:'weaken', blastPow:1.6},
    {id:'archmage2',   e:'📖', n:'Archmage',       cat:'🧙 Wizards',    cost:720,  atkBonus:51,  blast:'weaken', blastPow:2.0},
    {id:'enchanter2',  e:'✨', n:'Enchanter',      cat:'🧙 Wizards',    cost:1000, atkBonus:67,  blast:'weaken', blastPow:2.5},
    {id:'spellbinder', e:'🌀', n:'Spell Binder',   cat:'🧙 Wizards',    cost:1350, atkBonus:85,  blast:'weaken', blastPow:3.0},
    {id:'voidmage',    e:'🌑', n:'Void Mage',      cat:'🧙 Wizards',    cost:1800, atkBonus:106, blast:'weaken', blastPow:3.5},
    {id:'stormwiz',    e:'⚡', n:'Storm Wizard',   cat:'🧙 Wizards',    cost:2400, atkBonus:130, blast:'weaken', blastPow:4.0},
    {id:'cosmicmage2', e:'🌌', n:'Cosmic Mage',    cat:'🧙 Wizards',    cost:3200, atkBonus:160, blast:'weaken', blastPow:5.0},
    // ── Witches ──────────────────────────────────────────────
    {id:'hedgewitch2', e:'🌿', n:'Hedge Witch',    cat:'🧙 Witches',    cost:120,  atkBonus:8,   blast:'heal',   blastPow:1.0},
    {id:'cauldrwitch', e:'🫙', n:'Cauldron Witch', cat:'🧙 Witches',    cost:240,  atkBonus:16,  blast:'heal',   blastPow:1.2},
    {id:'shadowwitch', e:'🌑', n:'Shadow Witch',   cat:'🧙 Witches',    cost:400,  atkBonus:26,  blast:'heal',   blastPow:1.4},
    {id:'moonsinger',  e:'🌙', n:'Moon Singer',    cat:'🧙 Witches',    cost:600,  atkBonus:38,  blast:'heal',   blastPow:1.6},
    {id:'curseweaver', e:'🕸️', n:'Curse Weaver',   cat:'🧙 Witches',    cost:850,  atkBonus:52,  blast:'heal',   blastPow:2.0},
    {id:'hexmaster',   e:'💜', n:'Hex Master',     cat:'🧙 Witches',    cost:1150, atkBonus:68,  blast:'heal',   blastPow:2.5},
    {id:'spiritcallr', e:'👻', n:'Spirit Caller',  cat:'🧙 Witches',    cost:1550, atkBonus:86,  blast:'heal',   blastPow:3.0},
    {id:'bloodmage',   e:'🩸', n:'Blood Mage',     cat:'🧙 Witches',    cost:2050, atkBonus:106, blast:'heal',   blastPow:3.5},
    {id:'voidwitch',   e:'🌀', n:'Void Witch',     cat:'🧙 Witches',    cost:2700, atkBonus:130, blast:'heal',   blastPow:4.0},
    {id:'grandwitch2', e:'🧙', n:'Grand Witch',    cat:'🧙 Witches',    cost:3600, atkBonus:160, blast:'heal',   blastPow:5.0},
    // ── Smiths ───────────────────────────────────────────────
    {id:'appsmith',    e:'🔧', n:'Apprentice Smith',cat:'⚒️ Smiths',    cost:60,   atkBonus:6,   blast:'dig',    blastPow:1.0},
    {id:'tinker',      e:'⚙️', n:'Tinker',         cat:'⚒️ Smiths',     cost:130,  atkBonus:13,  blast:'dig',    blastPow:1.2},
    {id:'forger',      e:'🔨', n:'Forger',         cat:'⚒️ Smiths',     cost:240,  atkBonus:22,  blast:'dig',    blastPow:1.4},
    {id:'armorer',     e:'⚒️', n:'Armorer',        cat:'⚒️ Smiths',     cost:380,  atkBonus:33,  blast:'dig',    blastPow:1.6},
    {id:'mastersmith', e:'🔨', n:'Master Smith',   cat:'⚒️ Smiths',     cost:560,  atkBonus:46,  blast:'dig',    blastPow:2.0},
    {id:'runesmith',   e:'🪄', n:'Rune Smith',     cat:'⚒️ Smiths',     cost:780,  atkBonus:61,  blast:'dig',    blastPow:2.5},
    {id:'artificer',   e:'⚙️', n:'Artificer',      cat:'⚒️ Smiths',     cost:1050, atkBonus:78,  blast:'dig',    blastPow:3.0},
    {id:'goldsmith',   e:'⭐', n:'Gold Smith',     cat:'⚒️ Smiths',     cost:1380, atkBonus:97,  blast:'dig',    blastPow:3.5},
    {id:'legendsmith', e:'✨', n:'Legend Smith',   cat:'⚒️ Smiths',     cost:1800, atkBonus:120, blast:'dig',    blastPow:4.0},
    {id:'godsmith',    e:'👑', n:'God Smith',      cat:'⚒️ Smiths',     cost:2400, atkBonus:150, blast:'dig',    blastPow:5.0},
    // ── Rangers ──────────────────────────────────────────────
    {id:'pathfinder',  e:'🌿', n:'Pathfinder',     cat:'🌿 Rangers',    cost:80,   atkBonus:7,   blast:'slow',   blastPow:1.1},
    {id:'stalker',     e:'🦅', n:'Stalker',        cat:'🌿 Rangers',    cost:160,  atkBonus:15,  blast:'slow',   blastPow:1.3},
    {id:'beastmaster', e:'🐾', n:'Beast Master',   cat:'🌿 Rangers',    cost:290,  atkBonus:25,  blast:'slow',   blastPow:1.5},
    {id:'trapper',     e:'🕸️', n:'Trapper',        cat:'🌿 Rangers',    cost:450,  atkBonus:37,  blast:'slow',   blastPow:1.7},
    {id:'forestrngr',  e:'🌲', n:'Forest Ranger',  cat:'🌿 Rangers',    cost:640,  atkBonus:51,  blast:'slow',   blastPow:2.0},
    {id:'moonranger',  e:'🌙', n:'Moon Ranger',    cat:'🌿 Rangers',    cost:880,  atkBonus:67,  blast:'slow',   blastPow:2.5},
    {id:'wildhunter',  e:'🐺', n:'Wild Hunter',    cat:'🌿 Rangers',    cost:1170, atkBonus:85,  blast:'slow',   blastPow:3.0},
    {id:'shadowrngr',  e:'🌑', n:'Shadow Ranger',  cat:'🌿 Rangers',    cost:1530, atkBonus:105, blast:'slow',   blastPow:3.5},
    {id:'stormranger', e:'⛈️', n:'Storm Ranger',   cat:'🌿 Rangers',    cost:2000, atkBonus:130, blast:'slow',   blastPow:4.0},
    {id:'legendrngr',  e:'🌟', n:'Legend Ranger',  cat:'🌿 Rangers',    cost:2700, atkBonus:160, blast:'slow',   blastPow:5.0},
    // ── Paladins ─────────────────────────────────────────────
    {id:'initiate',    e:'🙏', n:'Initiate',       cat:'✝️ Paladins',   cost:150,  atkBonus:10,  blast:'heal',   blastPow:1.2},
    {id:'cleric',      e:'✝️', n:'Cleric',         cat:'✝️ Paladins',   cost:280,  atkBonus:20,  blast:'heal',   blastPow:1.4},
    {id:'friar',       e:'🙏', n:'Friar',          cat:'✝️ Paladins',   cost:450,  atkBonus:32,  blast:'heal',   blastPow:1.6},
    {id:'paladin2',    e:'⚔️', n:'Paladin',        cat:'✝️ Paladins',   cost:660,  atkBonus:46,  blast:'heal',   blastPow:2.0},
    {id:'templar',     e:'🛡️', n:'Templar',        cat:'✝️ Paladins',   cost:920,  atkBonus:62,  blast:'heal',   blastPow:2.5},
    {id:'inquisitor',  e:'🌟', n:'Inquisitor',     cat:'✝️ Paladins',   cost:1240, atkBonus:80,  blast:'heal',   blastPow:3.0},
    {id:'justicar',    e:'⚖️', n:'Justicar',       cat:'✝️ Paladins',   cost:1640, atkBonus:100, blast:'heal',   blastPow:3.5},
    {id:'sunguard',    e:'☀️', n:'Sun Guard',      cat:'✝️ Paladins',   cost:2150, atkBonus:124, blast:'heal',   blastPow:4.0},
    {id:'angelpaladin',e:'😇', n:'Angel Paladin',  cat:'✝️ Paladins',   cost:2800, atkBonus:150, blast:'heal',   blastPow:4.5},
    {id:'holyavenger', e:'✨', n:'Holy Avenger',   cat:'✝️ Paladins',   cost:3800, atkBonus:185, blast:'heal',   blastPow:6.0},
    // ── Assassins ────────────────────────────────────────────
    {id:'cutpurse',    e:'🗡️', n:'Cutpurse',       cat:'🗡️ Assassins',  cost:110,  atkBonus:10,  blast:'damage', blastPow:1.5},
    {id:'thief',       e:'🗡️', n:'Thief',          cat:'🗡️ Assassins',  cost:220,  atkBonus:20,  blast:'damage', blastPow:1.8},
    {id:'rogue',       e:'🗡️', n:'Rogue',          cat:'🗡️ Assassins',  cost:370,  atkBonus:32,  blast:'damage', blastPow:2.0},
    {id:'shadowblade', e:'🌑', n:'Shadow Blade',   cat:'🗡️ Assassins',  cost:570,  atkBonus:46,  blast:'damage', blastPow:2.3},
    {id:'infiltrator', e:'🗡️', n:'Infiltrator',    cat:'🗡️ Assassins',  cost:810,  atkBonus:62,  blast:'damage', blastPow:2.6},
    {id:'specter',     e:'👤', n:'Specter',        cat:'🗡️ Assassins',  cost:1100, atkBonus:80,  blast:'damage', blastPow:3.0},
    {id:'deathblade',  e:'💀', n:'Death Blade',    cat:'🗡️ Assassins',  cost:1450, atkBonus:100, blast:'damage', blastPow:3.5},
    {id:'shadowlord2', e:'🌑', n:'Shadow Lord',    cat:'🗡️ Assassins',  cost:1900, atkBonus:124, blast:'damage', blastPow:4.0},
    {id:'voidblade',   e:'🌀', n:'Void Blade',     cat:'🗡️ Assassins',  cost:2500, atkBonus:150, blast:'damage', blastPow:4.5},
    {id:'cosmicblade', e:'🌌', n:'Cosmic Blade',   cat:'🗡️ Assassins',  cost:3300, atkBonus:185, blast:'damage', blastPow:6.0},
    // ── Berserkers ───────────────────────────────────────────
    {id:'brute',       e:'😤', n:'Brute',          cat:'😤 Berserkers', cost:130,  atkBonus:12,  blast:'damage', blastPow:1.5},
    {id:'raider',      e:'⚔️', n:'Raider',         cat:'😤 Berserkers', cost:260,  atkBonus:24,  blast:'damage', blastPow:1.8},
    {id:'berserk',     e:'😡', n:'Berserker',      cat:'😤 Berserkers', cost:430,  atkBonus:38,  blast:'damage', blastPow:2.0},
    {id:'ravager',     e:'💥', n:'Ravager',        cat:'😤 Berserkers', cost:650,  atkBonus:54,  blast:'damage', blastPow:2.3},
    {id:'slayer',      e:'⚔️', n:'Slayer',         cat:'😤 Berserkers', cost:920,  atkBonus:72,  blast:'damage', blastPow:2.6},
    {id:'warchief',    e:'🗡️', n:'War Chief',      cat:'😤 Berserkers', cost:1240, atkBonus:92,  blast:'damage', blastPow:3.0},
    {id:'doomslayer',  e:'💀', n:'Doom Slayer',    cat:'😤 Berserkers', cost:1650, atkBonus:114, blast:'damage', blastPow:3.5},
    {id:'warmonger',   e:'😤', n:'War Monger',     cat:'😤 Berserkers', cost:2150, atkBonus:140, blast:'damage', blastPow:4.0},
    {id:'titanslayer', e:'🗿', n:'Titan Slayer',   cat:'😤 Berserkers', cost:2800, atkBonus:170, blast:'damage', blastPow:4.5},
    {id:'godslayer',   e:'⚡', n:'God Slayer',     cat:'😤 Berserkers', cost:3800, atkBonus:210, blast:'damage', blastPow:6.0},
  ];
  window.CHARACTERS = CHARACTERS;

  var DRAGON_TYPES = {
    aquarium: { e:'💧', n:'Sea Dragon',     rubyPerDay:3  },
    forest:   { e:'🍃', n:'Forest Dragon',  rubyPerDay:5  },
    savanna:  { e:'🔥', n:'Fire Dragon',    rubyPerDay:7  },
    sky:      { e:'⚡', n:'Storm Dragon',   rubyPerDay:10 },
    mythical: { e:'💎', n:'Crystal Dragon', rubyPerDay:15 },
    world:    { e:'🌍', n:'Earth Dragon',   rubyPerDay:6  },
  };

  function dragonTimeLeft(ms) {
    if (ms <= 0) return 'ready!';
    var d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    if (d > 0) return d + 'd ' + h + 'h';
    if (h > 0) return h + 'h ' + m + 'm';
    return m + 'm';
  }

  function getOccupiedHabitats(homePets) {
    var keys = ['aquarium','forest','savanna','sky','mythical'];
    var occupied = {};
    (homePets || []).forEach(function(p) {
      for (var i = 0; i < HABITATS.length - 1; i++) {
        if (HABITATS[i].ids.indexOf(p.id) >= 0) { occupied[keys[i]] = true; break; }
      }
    });
    var result = Object.keys(occupied);
    return result.length ? result : keys;
  }

  function checkDragonHatch(acc) {
    var now = Date.now(), changed = false;
    acc.dragonEggs = (acc.dragonEggs || []).filter(function(egg) {
      if (now >= egg.hatchAt) {
        acc.dragons.push({ habitat: egg.habitat, hatchedAt: now, lastCollect: now });
        changed = true; return false;
      }
      return true;
    });
    if (changed) saveAccount(acc);
  }

  // ── Awards helpers ────────────────────────────────────────────────────────
  function countSpecies(acc) {
    var seen = {};
    (acc.homePets||[]).forEach(function(p){ seen[p.id]=true; });
    return Object.keys(seen).length;
  }
  function countHabitats(acc) {
    var filled = 0;
    for (var hi = 0; hi < HABITATS.length - 1; hi++) {
      var h = HABITATS[hi];
      if ((acc.homePets||[]).some(function(p){ return h.ids.indexOf(p.id)>=0; })) filled++;
    }
    return filled;
  }
  function countHabSpec(acc, hi) {
    var h = HABITATS[hi]; if (!h) return 0;
    var seen = {};
    (acc.homePets||[]).forEach(function(p){ if (h.ids.indexOf(p.id)>=0) seen[p.id]=true; });
    return Object.keys(seen).length;
  }
  function hasdragon(acc, habitat) {
    return (acc.dragons||[]).some(function(d){ return d.habitat===habitat; });
  }
  function countServants(acc) {
    return Object.keys(acc.servants||{}).length;
  }
  function maxWeaponLevel(acc) {
    var max = 0;
    Object.keys(acc.weapons||{}).forEach(function(id){ if ((acc.weapons[id]||0)>max) max=acc.weapons[id]; });
    return max;
  }
  function hasMagicWeapon(acc) {
    var weps = window.WEAPONS||[];
    return Object.keys(acc.weapons||{}).some(function(id){
      var w = weps.filter(function(x){return x.id===id;})[0];
      return w && w.cat==='Magic';
    });
  }
  function hasAllWeaponCats(acc) {
    var cats = ['Close','Medium','Far','Very Far','Magic'];
    var weps = window.WEAPONS||[];
    var owned = Object.keys(acc.weapons||{});
    return cats.every(function(cat){
      return owned.some(function(id){
        var w = weps.filter(function(x){return x.id===id;})[0];
        return w && w.cat===cat;
      });
    });
  }
  function hasAllPetCats(acc) {
    var cats = ['🌿 Healers','⚔️ Attackers','🛡️ Tanks','✨ Hybrids','🔥 Legendaries'];
    return cats.every(function(cat){
      return (acc.homePets||[]).some(function(p){ return p.cat===cat; });
    });
  }

  var AWARDS = [
    // FIRST STEPS
    {id:'first_run',      e:'🎮', n:'First Steps',        d:'Play your first run',                 r:5,   check:function(a){return a.stats.runsPlayed>=1;}},
    {id:'first_pet',      e:'🐾', n:'Pet Owner',          d:'Bring a pet home',                    r:5,   check:function(a){return (a.homePets||[]).length>=1;}},
    {id:'first_egg',      e:'🥚', n:'Dragon Dreamer',     d:'Get a dragon egg',                    r:10,  check:function(a){return (a.dragonEggs||[]).length+(a.dragons||[]).length>=1;}},
    {id:'first_dragon',   e:'🐲', n:'Dragon Keeper',      d:'Hatch your first dragon',             r:15,  check:function(a){return (a.dragons||[]).length>=1;}},
    {id:'first_weapon',   e:'⚔️', n:'Armed',              d:'Buy a weapon',                        r:5,   check:function(a){return Object.keys(a.weapons||{}).length>=1;}},
    {id:'first_servant',  e:'🏰', n:'First Hire',         d:'Hire a servant',                      r:5,   check:function(a){return Object.keys(a.servants||{}).length>=1;}},
    {id:'first_boost',    e:'🛒', n:'Power Shopper',      d:'Buy a shop boost',                    r:5,   check:function(a){return a.stats.boostsUsed>=1;}},
    {id:'first_ruby',     e:'🔴', n:'Ruby Earner',        d:'Earn your first ruby',                r:3,   check:function(a){return a.stats.rubiesEarned>=1;}},
    {id:'first_win',      e:'🏆', n:'Champion!',          d:'Beat all 50 levels',                  r:50,  check:function(a){return a.stats.runsWon>=1;}},
    {id:'level_5',        e:'⭐', n:'Adventurer',         d:'Reach level 5',                       r:5,   check:function(a){return a.highestLevel>=5;}},
    // LEVELS
    {id:'level_10',       e:'⭐', n:'Veteran',            d:'Reach level 10',                      r:10,  check:function(a){return a.highestLevel>=10;}},
    {id:'level_15',       e:'⭐', n:'Explorer',           d:'Reach level 15',                      r:12,  check:function(a){return a.highestLevel>=15;}},
    {id:'level_20',       e:'⭐', n:'Warrior',            d:'Reach level 20',                      r:15,  check:function(a){return a.highestLevel>=20;}},
    {id:'level_25',       e:'⭐', n:'Elite',              d:'Reach level 25',                      r:18,  check:function(a){return a.highestLevel>=25;}},
    {id:'level_30',       e:'⭐', n:'Expert',             d:'Reach level 30',                      r:22,  check:function(a){return a.highestLevel>=30;}},
    {id:'level_35',       e:'⭐', n:'Master',             d:'Reach level 35',                      r:26,  check:function(a){return a.highestLevel>=35;}},
    {id:'level_40',       e:'⭐', n:'Grandmaster',        d:'Reach level 40',                      r:30,  check:function(a){return a.highestLevel>=40;}},
    {id:'level_45',       e:'⭐', n:'Legend',             d:'Reach level 45',                      r:35,  check:function(a){return a.highestLevel>=45;}},
    {id:'level_50',       e:'🌟', n:'True Champion',      d:'Complete all 50 levels',              r:50,  check:function(a){return a.highestLevel>=50;}},
    // SCORE
    {id:'score_1k',       e:'📊', n:'Score Seeker',       d:'Reach 1,000 score in a run',          r:5,   check:function(a){return a.stats.bestScore>=1000;}},
    {id:'score_5k',       e:'📊', n:'High Scorer',        d:'Reach 5,000 score in a run',          r:10,  check:function(a){return a.stats.bestScore>=5000;}},
    {id:'score_10k',      e:'📊', n:'Score Hunter',       d:'Reach 10,000 score in a run',         r:15,  check:function(a){return a.stats.bestScore>=10000;}},
    {id:'score_25k',      e:'📊', n:'Score Master',       d:'Reach 25,000 score in a run',         r:20,  check:function(a){return a.stats.bestScore>=25000;}},
    {id:'score_50k',      e:'📊', n:'Score Legend',       d:'Reach 50,000 score in a run',         r:30,  check:function(a){return a.stats.bestScore>=50000;}},
    {id:'score_100k',     e:'📊', n:'Score God',          d:'Reach 100,000 score in a run',        r:50,  check:function(a){return a.stats.bestScore>=100000;}},
    {id:'score_250k',     e:'📊', n:'Untouchable',        d:'Reach 250,000 score in a run',        r:75,  check:function(a){return a.stats.bestScore>=250000;}},
    {id:'score_500k',     e:'📊', n:'Score Emperor',      d:'Reach 500,000 score in a run',        r:100, check:function(a){return a.stats.bestScore>=500000;}},
    {id:'total_score_500k',e:'📊',n:'Score Veteran',      d:'Total 500,000 score ever',            r:30,  check:function(a){return a.stats.totalScore>=500000;}},
    {id:'total_score_1m', e:'📊', n:'Scorer of Scores',   d:'Total 1,000,000 score ever',          r:50,  check:function(a){return a.stats.totalScore>=1000000;}},
    // HOME PETS
    {id:'home_5',         e:'🏠', n:'Cozy Home',          d:'5 pets at home',                      r:8,   check:function(a){return (a.homePets||[]).length>=5;}},
    {id:'home_10',        e:'🏠', n:'Pet Lover',          d:'10 pets at home',                     r:12,  check:function(a){return (a.homePets||[]).length>=10;}},
    {id:'home_25',        e:'🏠', n:'Animal Shelter',     d:'25 pets at home',                     r:18,  check:function(a){return (a.homePets||[]).length>=25;}},
    {id:'home_50',        e:'🏠', n:'Zoo Keeper',         d:'50 pets at home',                     r:25,  check:function(a){return (a.homePets||[]).length>=50;}},
    {id:'home_100',       e:'🏠', n:'Wildlife Sanctuary', d:'100 pets at home',                    r:35,  check:function(a){return (a.homePets||[]).length>=100;}},
    {id:'home_200',       e:'🏠', n:"Noah's Ark",         d:'200 pets at home',                    r:50,  check:function(a){return (a.homePets||[]).length>=200;}},
    {id:'species_5',      e:'🌿', n:'Naturalist',         d:'5 species at home',                   r:10,  check:function(a){return countSpecies(a)>=5;}},
    {id:'species_10',     e:'🌿', n:'Biologist',          d:'10 species at home',                  r:20,  check:function(a){return countSpecies(a)>=10;}},
    {id:'species_20',     e:'🌿', n:'Zoologist',          d:'20 species at home',                  r:35,  check:function(a){return countSpecies(a)>=20;}},
    {id:'species_30',     e:'🌿', n:'Encyclopedist',      d:'30 species at home',                  r:50,  check:function(a){return countSpecies(a)>=30;}},
    // HABITATS
    {id:'all_habitats',   e:'🌍', n:'World Traveler',     d:'Pets in all 5 habitats',              r:20,  check:function(a){return countHabitats(a)>=5;}},
    {id:'hab_aquarium',   e:'🌊', n:'Aquarium Master',    d:'6+ aquarium species at home',         r:20,  check:function(a){return countHabSpec(a,0)>=6;}},
    {id:'hab_forest',     e:'🌿', n:'Forest Keeper',      d:'6+ forest species at home',           r:20,  check:function(a){return countHabSpec(a,1)>=6;}},
    {id:'hab_savanna',    e:'🦁', n:'Safari Expert',      d:'6+ savanna species at home',          r:20,  check:function(a){return countHabSpec(a,2)>=6;}},
    {id:'hab_sky',        e:'☁️', n:'Cloud Walker',       d:'5+ sky species at home',              r:20,  check:function(a){return countHabSpec(a,3)>=5;}},
    {id:'hab_mythical',   e:'✨', n:'Myth Keeper',        d:'All 5 mythical species at home',      r:30,  check:function(a){return countHabSpec(a,4)>=5;}},
    // DRAGONS
    {id:'dragon_3',       e:'🐲', n:'Dragon Breeder',     d:'Own 3 dragons',                       r:20,  check:function(a){return (a.dragons||[]).length>=3;}},
    {id:'dragon_6',       e:'🐲', n:'Dragon Master',      d:'Own 6 dragons',                       r:50,  check:function(a){return (a.dragons||[]).length>=6;}},
    {id:'dragon_sea',     e:'💧', n:'Sea Dragon Owner',   d:'Own a Sea Dragon',                    r:10,  check:function(a){return hasdragon(a,'aquarium');}},
    {id:'dragon_storm',   e:'⚡', n:'Storm Dragon Owner', d:'Own a Storm Dragon',                  r:20,  check:function(a){return hasdragon(a,'sky');}},
    {id:'dragon_crystal', e:'💎', n:'Crystal Dragon',     d:'Own a Crystal Dragon',                r:30,  check:function(a){return hasdragon(a,'mythical');}},
    {id:'dragon_inc100',  e:'💰', n:'Dragon Investor',    d:'Collect 100 rubies from dragons',     r:20,  check:function(a){return a.stats.dragonRubies>=100;}},
    {id:'dragon_inc500',  e:'💰', n:'Dragon Empire',      d:'Collect 500 rubies from dragons',     r:50,  check:function(a){return a.stats.dragonRubies>=500;}},
    // SERVANTS
    {id:'servant_5',      e:'🏰', n:'Growing Staff',      d:'Own 5 different servants',            r:10,  check:function(a){return countServants(a)>=5;}},
    {id:'servant_10',     e:'🏰', n:'Large Staff',        d:'Own 10 different servants',           r:20,  check:function(a){return countServants(a)>=10;}},
    {id:'servant_inc100', e:'💰', n:'Servant Investor',   d:'Collect 100 rubies from servants',    r:15,  check:function(a){return a.stats.servantRubies>=100;}},
    {id:'servant_inc500', e:'💰', n:'Servant Empire',     d:'Collect 500 rubies from servants',    r:30,  check:function(a){return a.stats.servantRubies>=500;}},
    {id:'servant_1000',   e:'💰', n:'Servant Kingdom',    d:'Collect 1,000 rubies from servants',  r:50,  check:function(a){return a.stats.servantRubies>=1000;}},
    {id:'servant_knight', e:'⚔️', n:'Eternal Guard',      d:'Own an Eternal Knight',               r:25,  check:function(a){return !!(a.servants&&a.servants.eternalknight);}},
    {id:'servant_cosmic', e:'🌌', n:'Cosmic Power',       d:'Own a Cosmic Being',                  r:40,  check:function(a){return !!(a.servants&&a.servants.cosmicbeing);}},
    // WEAPONS
    {id:'weapon_3',       e:'⚔️', n:'Armory',             d:'Own 3 weapons',                       r:10,  check:function(a){return Object.keys(a.weapons||{}).length>=3;}},
    {id:'weapon_5',       e:'⚔️', n:'Arsenal',            d:'Own 5 weapons',                       r:15,  check:function(a){return Object.keys(a.weapons||{}).length>=5;}},
    {id:'weapon_10',      e:'⚔️', n:'War Chest',          d:'Own 10 weapons',                      r:25,  check:function(a){return Object.keys(a.weapons||{}).length>=10;}},
    {id:'weapon_lvl5',    e:'⬆️', n:'Sharpened',          d:'Upgrade a weapon to level 5',         r:20,  check:function(a){return maxWeaponLevel(a)>=5;}},
    {id:'weapon_lvl10',   e:'⬆️', n:'Masterwork',         d:'Upgrade a weapon to level 10',        r:40,  check:function(a){return maxWeaponLevel(a)>=10;}},
    {id:'weapon_magic',   e:'🪄', n:'Magic User',         d:'Own a magic weapon',                  r:10,  check:function(a){return hasMagicWeapon(a);}},
    {id:'weapon_cats',    e:'🎯', n:'Jack of All Arms',   d:'One weapon from each category',       r:30,  check:function(a){return hasAllWeaponCats(a);}},
    // ECONOMY
    {id:'rubies_100',     e:'🔴', n:'Ruby Stash',         d:'Earn 100 rubies total',               r:10,  check:function(a){return a.stats.rubiesEarned>=100;}},
    {id:'rubies_500',     e:'🔴', n:'Ruby Hoard',         d:'Earn 500 rubies total',               r:20,  check:function(a){return a.stats.rubiesEarned>=500;}},
    {id:'rubies_1000',    e:'🔴', n:'Ruby Treasury',      d:'Earn 1,000 rubies total',             r:35,  check:function(a){return a.stats.rubiesEarned>=1000;}},
    {id:'rubies_5000',    e:'🔴', n:'Ruby Empire',        d:'Earn 5,000 rubies total',             r:75,  check:function(a){return a.stats.rubiesEarned>=5000;}},
    {id:'spent_500',      e:'💸', n:'Big Spender',        d:'Spend 500 rubies total',              r:20,  check:function(a){return a.stats.rubiesSpent>=500;}},
    {id:'spent_1000',     e:'💸', n:'High Roller',        d:'Spend 1,000 rubies total',            r:35,  check:function(a){return a.stats.rubiesSpent>=1000;}},
    {id:'boosts_20',      e:'⚡', n:'Boost Addict',       d:'Use 20 shop boosts',                  r:15,  check:function(a){return a.stats.boostsUsed>=20;}},
    // COMBAT
    {id:'wall_1',         e:'🧱', n:'Wall Breaker',       d:'Break your first wall',               r:5,   check:function(a){return a.stats.wallsBroken>=1;}},
    {id:'walls_50',       e:'🧱', n:'Demolisher',         d:'Break 50 walls total',                r:15,  check:function(a){return a.stats.wallsBroken>=50;}},
    {id:'walls_200',      e:'🧱', n:'Wrecking Ball',      d:'Break 200 walls total',               r:30,  check:function(a){return a.stats.wallsBroken>=200;}},
    {id:'walls_500',      e:'🧱', n:'Earth Shaker',       d:'Break 500 walls total',               r:50,  check:function(a){return a.stats.wallsBroken>=500;}},
    {id:'monsters_500',   e:'💀', n:'Monster Slayer',     d:'Kill 500 monsters total',             r:10,  check:function(a){return a.stats.monstersKilled>=500;}},
    {id:'monsters_2000',  e:'💀', n:'Monster Hunter',     d:'Kill 2,000 monsters total',           r:25,  check:function(a){return a.stats.monstersKilled>=2000;}},
    {id:'monsters_5000',  e:'💀', n:'Monster Destroyer',  d:'Kill 5,000 monsters total',           r:50,  check:function(a){return a.stats.monstersKilled>=5000;}},
    {id:'volcano_10',     e:'🌋', n:'Volcano Miner',      d:'Get 10 gems from the volcano',        r:10,  check:function(a){return a.stats.volcanoGems>=10;}},
    {id:'volcano_50',     e:'🌋', n:'Volcano Tamer',      d:'Get 50 gems from the volcano',        r:20,  check:function(a){return a.stats.volcanoGems>=50;}},
    {id:'volcano_100',    e:'🌋', n:'Volcano Master',     d:'Get 100 gems from the volcano',       r:35,  check:function(a){return a.stats.volcanoGems>=100;}},
    {id:'gems_50_run',    e:'💎', n:'Gem Digger',         d:'Collect 50 gems in one run',          r:10,  check:function(a){return a.stats.bestGems>=50;}},
    {id:'gems_100_run',   e:'💎', n:'Gem Lord',           d:'Collect 100 gems in one run',         r:20,  check:function(a){return a.stats.bestGems>=100;}},
    // RUNS
    {id:'runs_5',         e:'▶️', n:'Regular',            d:'Play 5 runs',                         r:8,   check:function(a){return a.stats.runsPlayed>=5;}},
    {id:'runs_10',        e:'▶️', n:'Dedicated',          d:'Play 10 runs',                        r:15,  check:function(a){return a.stats.runsPlayed>=10;}},
    {id:'runs_25',        e:'▶️', n:'Committed',          d:'Play 25 runs',                        r:25,  check:function(a){return a.stats.runsPlayed>=25;}},
    {id:'runs_50',        e:'▶️', n:'Hardcore',           d:'Play 50 runs',                        r:40,  check:function(a){return a.stats.runsPlayed>=50;}},
    {id:'wins_3',         e:'🏆', n:'Triple Champion',    d:'Win 3 complete runs',                 r:60,  check:function(a){return a.stats.runsWon>=3;}},
    {id:'wins_5',         e:'🏆', n:'Legend Champion',    d:'Win 5 complete runs',                 r:80,  check:function(a){return a.stats.runsWon>=5;}},
    {id:'wins_10',        e:'🏆', n:'Supreme Champion',   d:'Win 10 complete runs',                r:100, check:function(a){return a.stats.runsWon>=10;}},
    {id:'total_gems_500', e:'💎', n:'Gem Collector',      d:'Collect 500 gems total',              r:20,  check:function(a){return a.stats.totalGems>=500;}},
    {id:'total_gems_2000',e:'💎', n:'Gem Hoarder',        d:'Collect 2,000 gems total',            r:50,  check:function(a){return a.stats.totalGems>=2000;}},
    // SPECIAL
    {id:'all_cats_home',  e:'🎪', n:'Pet Diversity',      d:'All 5 pet types at home',             r:25,  check:function(a){return hasAllPetCats(a);}},
    {id:'rich_run',       e:'💎', n:'Rich Run',           d:'Earn 50+ rubies in one run',          r:20,  check:function(a){return a.stats.bestRunRubies>=50;}},
    {id:'mega_run',       e:'💎', n:'Mega Run',           d:'Earn 100+ rubies in one run',         r:50,  check:function(a){return a.stats.bestRunRubies>=100;}},
    {id:'hoarder',        e:'💰', n:'Ruby Baron',         d:'Have 500 rubies at once',             r:25,  check:function(a){return a.stats.maxRubies>=500;}},
    {id:'home_500_total', e:'🏠', n:'Megafarm',           d:'500 total pets brought home',         r:40,  check:function(a){return a.stats.totalPetsHome>=500;}},
    {id:'grandmaster',    e:'👑', n:'Grandmaster',        d:'Earn all 99 other awards',            r:200, check:function(a){return (a.unlockedAwards||[]).length>=99;}},
  ];

  function checkAwards(acc) {
    if (!acc.unlockedAwards) acc.unlockedAwards = [];
    var newOnes = [];
    var unlocked = acc.unlockedAwards;
    AWARDS.forEach(function(aw) {
      if (unlocked.indexOf(aw.id) >= 0) return;
      try {
        if (aw.check(acc)) {
          unlocked.push(aw.id);
          acc.rubies += aw.r;
          if (acc.stats) acc.stats.rubiesEarned = (acc.stats.rubiesEarned||0) + aw.r;
          newOnes.push(aw);
        }
      } catch(e) {}
    });
    return newOnes;
  }

  function ensureItems(acc) {
    if (!acc.shopItems)    acc.shopItems    = { speed:0, attack:0, petluck:0, potion:0 };
    if (!acc.homePets)     acc.homePets     = [];
    if (!acc.rubies)       acc.rubies       = 0;
    if (!acc.highestLevel) acc.highestLevel = 0;
    if (!acc.weapons)           acc.weapons           = {};
    if (!acc.activeWeapon)      acc.activeWeapon      = null;
    if (!acc.servants)          acc.servants          = {};
    if (!acc.lastServantCollect)acc.lastServantCollect = Date.now();
    if (!acc.dragonEggs)        acc.dragonEggs        = [];
    if (!acc.dragons)           acc.dragons           = [];
    if (!acc.unlockedAwards)    acc.unlockedAwards    = [];
    if (!acc.characters)        acc.characters        = ['brownbear'];
    if (!acc.activeCharacter)   acc.activeCharacter   = 'brownbear';
    if (!acc.lastBossRun)       acc.lastBossRun       = 0;
    if (!acc.stats) acc.stats = {
      runsPlayed:0, runsWon:0, bestScore:0, bestGems:0, bestRunRubies:0,
      totalScore:0, totalGems:0, totalPetsHome:0, monstersKilled:0,
      wallsBroken:0, volcanoGems:0, servantRubies:0, dragonRubies:0,
      rubiesEarned:0, rubiesSpent:0, boostsUsed:0, maxRubies:0
    };
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
  var SCREENS = ['screen-hub','screen-meta-shop','screen-result','screen-weapons','screen-servants','screen-dragons','screen-awards','screen-habitats','screen-characters'];

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


  // ── Awards ────────────────────────────────────────────────────────────────
  window.showAwards = function() {
    var acc = ensureItems(getAccount());
    checkAwards(acc);
    saveAccount(acc);
    document.getElementById('awards-rubies').textContent = acc.rubies + ' 🔴';
    var unlocked = acc.unlockedAwards || [];
    document.getElementById('awards-progress').textContent = unlocked.length + ' / ' + AWARDS.length + ' awards';
    var cats = [
      {label:'🎮 First Steps',  ids:['first_run','first_pet','first_egg','first_dragon','first_weapon','first_servant','first_boost','first_ruby','first_win','level_5']},
      {label:'⭐ Levels',       ids:['level_10','level_15','level_20','level_25','level_30','level_35','level_40','level_45','level_50']},
      {label:'📊 Score',        ids:['score_1k','score_5k','score_10k','score_25k','score_50k','score_100k','score_250k','score_500k','total_score_500k','total_score_1m']},
      {label:'🏠 Home Pets',    ids:['home_5','home_10','home_25','home_50','home_100','home_200','species_5','species_10','species_20','species_30']},
      {label:'🌍 Habitats',     ids:['all_habitats','hab_aquarium','hab_forest','hab_savanna','hab_sky','hab_mythical']},
      {label:'🐲 Dragons',      ids:['dragon_3','dragon_6','dragon_sea','dragon_storm','dragon_crystal','dragon_inc100','dragon_inc500']},
      {label:'🏰 Servants',     ids:['servant_5','servant_10','servant_inc100','servant_inc500','servant_1000','servant_knight','servant_cosmic']},
      {label:'⚔️ Weapons',      ids:['weapon_3','weapon_5','weapon_10','weapon_lvl5','weapon_lvl10','weapon_magic','weapon_cats']},
      {label:'🔴 Economy',      ids:['rubies_100','rubies_500','rubies_1000','rubies_5000','spent_500','spent_1000','boosts_20']},
      {label:'💀 Combat',       ids:['wall_1','walls_50','walls_200','walls_500','monsters_500','monsters_2000','monsters_5000','volcano_10','volcano_50','volcano_100','gems_50_run','gems_100_run']},
      {label:'▶️ Runs',         ids:['runs_5','runs_10','runs_25','runs_50','wins_3','wins_5','wins_10','total_gems_500','total_gems_2000']},
      {label:'✨ Special',      ids:['all_cats_home','rich_run','mega_run','hoarder','home_500_total','grandmaster']},
    ];
    var awMap = {};
    AWARDS.forEach(function(aw){ awMap[aw.id]=aw; });
    var html = '';
    cats.forEach(function(cat) {
      html += '<div class="award-cat-title">' + cat.label + '</div><div class="award-cat-grid">';
      cat.ids.forEach(function(id) {
        var aw = awMap[id]; if (!aw) return;
        var done = unlocked.indexOf(id) >= 0;
        html += '<div class="award-item' + (done ? ' award-done' : '') + '">' +
          '<div class="award-emoji">' + aw.e + '</div>' +
          '<div class="award-name">' + aw.n + '</div>' +
          '<div class="award-desc">' + aw.d + '</div>' +
          '<div class="award-ruby">' + (done ? '✓ +' : '') + aw.r + ' 🔴</div>' +
          '</div>';
      });
      html += '</div>';
    });
    document.getElementById('awards-grid').innerHTML = html;
    showScreen('screen-awards');
  };

  // ── Habitats ──────────────────────────────────────────────────────────────
  var HAB_THEMES = [
    { bg:'linear-gradient(160deg,#001428 0%,#002a55 60%,#001428 100%)', border:'#0077cc', wave:'rgba(0,120,220,0.15)', icon:'🌊', name:'Sea Habitat',     desc:'Ocean, rivers & water creatures' },
    { bg:'linear-gradient(160deg,#061202 0%,#0e2e08 60%,#061202 100%)', border:'#2d8a2d', wave:'rgba(40,160,40,0.12)',  icon:'🌿', name:'Forest Habitat',  desc:'Woodland, jungle & meadow animals' },
    { bg:'linear-gradient(160deg,#1a0c00 0%,#361800 60%,#1a0c00 100%)', border:'#cc6600', wave:'rgba(200,100,0,0.12)', icon:'🦁', name:'Savanna Habitat', desc:'Desert, plains & savanna beasts' },
    { bg:'linear-gradient(160deg,#010818 0%,#020f28 60%,#010818 100%)', border:'#3366cc', wave:'rgba(50,100,220,0.12)',icon:'☁️', name:'Sky Habitat',     desc:'Flying & aerial creatures' },
    { bg:'linear-gradient(160deg,#0a0018 0%,#160028 60%,#0a0018 100%)', border:'#9933cc', wave:'rgba(150,50,220,0.12)',icon:'✨', name:'Mythical Habitat','desc':'Legendary & magical beings' },
  ];

  window.showHabitats = function() {
    var acc = ensureItems(getAccount());
    document.getElementById('habitats-rubies').textContent = acc.rubies + ' 🔴';

    var pets = window.PETS || [];
    var petMap = {};
    pets.forEach(function(p) { petMap[p.id] = p; });

    var owned = {};
    (acc.homePets || []).forEach(function(p) { owned[p.id] = (owned[p.id] || 0) + 1; });

    var html = '';
    for (var i = 0; i < HABITATS.length - 1; i++) {
      var h = HABITATS[i];
      var th = HAB_THEMES[i] || HAB_THEMES[0];
      var ownedCount = h.ids.filter(function(id) { return owned[id]; }).length;

      html += '<div class="hab-card" style="background:' + th.bg + ';border-color:' + th.border + '">';
      html += '<div class="hab-card-header" style="border-bottom-color:' + th.border + '44">';
      html += '<span class="hab-card-icon">' + th.icon + '</span>';
      html += '<div><div class="hab-card-title" style="color:' + th.border + '">' + th.name + '</div>';
      html += '<div class="hab-card-desc">' + th.desc + '</div></div>';
      html += '<div class="hab-card-count" style="color:' + th.border + '">' + ownedCount + '<span style="color:#605080">/' + h.ids.length + '</span></div>';
      html += '</div>';
      html += '<div class="hab-card-pets">';
      h.ids.forEach(function(id) {
        var p = petMap[id];
        if (!p) return;
        var cnt = owned[id] || 0;
        var has = cnt > 0;
        var buyCost = p.cost * 20;
        var canAfford = acc.rubies >= buyCost;
        var chipCls = has ? 'hab-pet-has' : (canAfford ? 'hab-pet-buyable' : 'hab-pet-no');
        html += '<div class="hab-pet-chip ' + chipCls + '" style="' + (has ? 'border-color:' + th.border + '88' : '') + '">';
        html += '<span class="hab-chip-emoji">' + p.e + '</span>';
        html += '<span class="hab-chip-name">' + p.n + '</span>';
        if (has) html += '<span class="hab-chip-count" style="color:' + th.border + '">×' + cnt + '</span>';
        html += '<button class="hab-buy-btn' + (canAfford ? '' : ' hab-buy-cant') + '"' +
          (canAfford ? ' onclick="buyHabitatPet(\'' + id + '\')"' : ' disabled') + '>' +
          (has ? '+1 · ' : 'Buy · ') + buyCost + '🔴</button>';
        html += '</div>';
      });
      html += '</div></div>';
    }

    document.getElementById('habitats-grid').innerHTML = html;
    showScreen('screen-habitats');
  };

  window.buyHabitatPet = function(id) {
    var acc = ensureItems(getAccount());
    var pets = window.PETS || [];
    var petDef = null;
    for (var i = 0; i < pets.length; i++) { if (pets[i].id === id) { petDef = pets[i]; break; } }
    if (!petDef) return;
    var cost = petDef.cost * 20;
    if (acc.rubies < cost) return;
    if (speciesCount(acc, id) >= 30) return;
    acc.rubies -= cost;
    acc.stats.rubiesSpent += cost;
    acc.homePets.push({ id:petDef.id, e:petDef.e, n:petDef.n, cat:petDef.cat||'',
      heal:petDef.heal||0, hi:petDef.hi||0, atk:petDef.atk||0, ar:petDef.ar||0, sc:petDef.sc||0, d:petDef.d||'' });
    acc.stats.totalPetsHome += 1;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    checkAwards(acc);
    saveAccount(acc);
    window.showHabitats();
  };

  // ── Characters ────────────────────────────────────────────
  var BLAST_LABELS = { damage:'💥 Blast Dmg', slow:'❄️ Slow All', weaken:'⬇️ Weaken', heal:'❤️ Heal All', dig:'⛏️ Dig Rubies' };

  window.showCharacters = function() {
    var acc = ensureItems(getAccount());
    document.getElementById('char-rubies').textContent = acc.rubies + ' 🔴';
    var chars = window.CHARACTERS || [];
    var owned = acc.characters || ['brownbear'];
    var active = acc.activeCharacter || 'brownbear';
    var cats = {}, catOrder = [];
    chars.forEach(function(c) {
      if (!cats[c.cat]) { cats[c.cat] = []; catOrder.push(c.cat); }
      cats[c.cat].push(c);
    });
    var html = '';
    catOrder.forEach(function(cat) {
      html += '<div class="weapon-cat-title">' + cat + '</div><div class="weapon-cat-grid">';
      cats[cat].forEach(function(c) {
        var isOwned  = owned.indexOf(c.id) >= 0;
        var isActive = active === c.id;
        var canBuy   = acc.rubies >= c.cost && !isOwned;
        var safeId   = c.id.replace(/'/g, "\\'");
        html += '<div class="weapon-item char-item' + (isActive ? ' weapon-active' : '') + '">';
        html += '<div class="weapon-emoji">' + c.e + '</div>';
        html += '<div class="weapon-name">' + c.n + '</div>';
        html += '<div class="weapon-stats">+' + c.atkBonus + ' atk &nbsp; ' + BLAST_LABELS[c.blast] + '</div>';
        if (isOwned) {
          html += '<div class="weapon-level" style="color:#a0d0ff">Owned</div>';
        }
        html += '<div class="weapon-btns">';
        if (!isOwned) {
          html += '<button class="weapon-btn weapon-buy' + (canBuy ? '' : ' cant-buy') + '"' +
            (canBuy ? ' onclick="buyCharacter(\'' + safeId + '\')"' : ' disabled') + '>' +
            (c.cost === 0 ? 'Free' : 'Buy ' + c.cost + '🔴') + '</button>';
        } else {
          html += '<button class="weapon-btn weapon-equip' + (isActive ? ' weapon-equipped' : '') + '" onclick="equipCharacter(\'' + safeId + '\')">' +
            (isActive ? '✓ Playing' : 'Play') + '</button>';
        }
        html += '</div></div>';
      });
      html += '</div>';
    });
    document.getElementById('char-grid').innerHTML = html;
    showScreen('screen-characters');
  };

  window.buyCharacter = function(id) {
    var acc = ensureItems(getAccount());
    var chars = window.CHARACTERS || [];
    var c = null;
    for (var i = 0; i < chars.length; i++) { if (chars[i].id === id) { c = chars[i]; break; } }
    if (!c || acc.rubies < c.cost) return;
    if ((acc.characters || []).indexOf(id) >= 0) return;
    acc.rubies -= c.cost;
    acc.stats.rubiesSpent += c.cost;
    acc.characters.push(id);
    checkAwards(acc);
    saveAccount(acc);
    window.showCharacters();
  };

  window.equipCharacter = function(id) {
    var acc = ensureItems(getAccount());
    if ((acc.characters || []).indexOf(id) < 0) return;
    acc.activeCharacter = id;
    saveAccount(acc);
    window.showCharacters();
  };

  // ── Boss Run ──────────────────────────────────────────────
  window.playBossRun = function() {
    var acc = ensureItems(getAccount());
    var NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
    var remaining = NINETY_DAYS - (Date.now() - (acc.lastBossRun || 0));
    if (remaining > 0) {
      alert('⏳ Boss cooldown: ' + dragonTimeLeft(remaining) + ' remaining.\nYou can only challenge the Cosmic Terror once every 90 days!');
      return;
    }
    acc.lastBossRun = Date.now();
    saveAccount(acc);
    showScreen('game');
    var charDef = null;
    var chars = window.CHARACTERS || [];
    var cid = acc.activeCharacter || 'brownbear';
    for (var i = 0; i < chars.length; i++) { if (chars[i].id === cid) { charDef = chars[i]; break; } }
    if (window.META_startBossGame) window.META_startBossGame(acc.homePets || [], charDef);
  };

  window.META_onBossWin = function() {
    var acc = ensureItems(getAccount());
    acc.rubies += 10000;
    acc.stats.rubiesEarned += 10000;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    checkAwards(acc);
    saveAccount(acc);
    var wov = document.getElementById('wov');
    wov.querySelector('.otitle').textContent = '🌠 BOSS DEFEATED!';
    document.getElementById('wscore').textContent = '+10,000 🔴 Rubies!';
    wov.style.display = 'flex';
  };

  // ── Hub ───────────────────────────────────────────────────────────────────
  function showHub() {
    var acc = ensureItems(getAccount());
    checkDragonHatch(acc);
    document.getElementById('hub-rubies').textContent = acc.rubies + ' 🔴';
    document.getElementById('hub-best').textContent   = 'Best: Level ' + acc.highestLevel;
    renderHomePets(acc.homePets);
    showScreen('screen-hub');
  }
  window.showHub = showHub;

  // ── Dragons ───────────────────────────────────────────────────────────────
  function showDragons() {
    var acc = ensureItems(getAccount());
    checkDragonHatch(acc);
    document.getElementById('dragon-rubies').textContent = acc.rubies + ' 🔴';

    var eggsEl = document.getElementById('dragon-eggs-section');
    if (acc.dragonEggs.length) {
      eggsEl.innerHTML = '<div class="dragon-section-title">🥚 Eggs Hatching</div>' +
        acc.dragonEggs.map(function(egg) {
          var dt = DRAGON_TYPES[egg.habitat] || DRAGON_TYPES.world;
          var left = dragonTimeLeft(egg.hatchAt - Date.now());
          return '<div class="dragon-egg-row">' + dt.e + ' <b>' + dt.n + ' Egg</b> — hatches in <span class="dragon-time">' + left + '</span></div>';
        }).join('');
    } else {
      eggsEl.innerHTML = '<div class="dragon-section-title">🥚 Eggs Hatching</div>' +
        '<div class="dragon-none">No eggs — reach level 5, 10, 15… for a 20% chance each!</div>';
    }

    var listEl = document.getElementById('dragon-list-section');
    if (acc.dragons.length) {
      listEl.innerHTML = '<div class="dragon-section-title">🐲 Your Dragons</div>' +
        acc.dragons.map(function(d, i) {
          var dt = DRAGON_TYPES[d.habitat] || DRAGON_TYPES.world;
          var elapsed = Math.max(0, Date.now() - (d.lastCollect || d.hatchedAt));
          var pending = Math.floor(elapsed / 86400000) * dt.rubyPerDay;
          return '<div class="dragon-item">' +
            '<span class="dragon-icon">' + dt.e + '</span>' +
            '<div class="dragon-info"><b>' + dt.n + '</b><small>' + dt.rubyPerDay + ' 🔴/day</small></div>' +
            '<button class="btn' + (pending > 0 ? ' btng' : '') + ' dragon-btn" onclick="collectDragon(' + i + ')"' +
            (pending <= 0 ? ' disabled' : '') + '>📦 +' + pending + ' 🔴</button>' +
            '</div>';
        }).join('');
    } else {
      listEl.innerHTML = '<div class="dragon-section-title">🐲 Your Dragons</div>' +
        '<div class="dragon-none">No dragons yet — wait 30 days for an egg to hatch!</div>';
    }
    showScreen('screen-dragons');
  }
  window.showDragons = showDragons;

  window.collectDragon = function(idx) {
    var acc = ensureItems(getAccount());
    var d = acc.dragons[idx]; if (!d) return;
    var dt = DRAGON_TYPES[d.habitat] || DRAGON_TYPES.world;
    var elapsed = Math.max(0, Date.now() - (d.lastCollect || d.hatchedAt));
    var rubies = Math.floor(elapsed / 86400000) * dt.rubyPerDay;
    if (rubies <= 0) return;
    acc.rubies += rubies; d.lastCollect = Date.now();
    acc.stats.dragonRubies += rubies;
    acc.stats.rubiesEarned += rubies;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    checkAwards(acc);
    saveAccount(acc); showDragons();
  };

  window.collectAllDragons = function() {
    var acc = ensureItems(getAccount()), total = 0;
    acc.dragons.forEach(function(d) {
      var dt = DRAGON_TYPES[d.habitat] || DRAGON_TYPES.world;
      var elapsed = Math.max(0, Date.now() - (d.lastCollect || d.hatchedAt));
      var rubies = Math.floor(elapsed / 86400000) * dt.rubyPerDay;
      if (rubies > 0) { acc.rubies += rubies; d.lastCollect = Date.now(); total += rubies; }
    });
    if (total > 0) {
      acc.stats.dragonRubies += total;
      acc.stats.rubiesEarned += total;
      if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
      checkAwards(acc);
    }
    saveAccount(acc); showDragons();
  };

  var HABITATS = [
    { label:'🌊 Aquarium', bg:'#001830', border:'#0055bb',
      ids:['shark','kraken','narwhal','whale','leviathan','otter','crab','turtle','penguin','duck','swan','frog'] },
    { label:'🌿 Forest',   bg:'#091a04', border:'#2d8a2d',
      ids:['bunny','deer','fox','wolf','panda','koala','monkey','dog','cat','mouse','polarbear','chick','owl'] },
    { label:'🦁 Savanna',  bg:'#1e1000', border:'#cc6600',
      ids:['lion','tiger','trex','rhino','hippo','gorilla','elephant','mammoth','direlion','stonegiant','scorpion','serpent'] },
    { label:'☁️ Sky',      bg:'#04102a', border:'#3366cc',
      ids:['parrot','dove','flamingo','peacock','phoenix','gryphon','starbird','vampbat'] },
    { label:'✨ Mythical', bg:'#12002a', border:'#9933cc',
      ids:['dragon','kirin','unicorn','cerberus','god'] },
    { label:'🌍 World',    bg:'#0a0a1a', border:'#445566', ids:[] }
  ];

  function renderHomePets(pets) {
    var el = document.getElementById('hub-pets');
    if (!pets || !pets.length) { el.innerHTML = '<div class="hub-no-pets">No pets yet — play levels to collect them!</div>'; return; }

    // Deduplicate by species, keep count
    var seen = {}, unique = [];
    pets.forEach(function(p) { if (!seen[p.id]) { seen[p.id] = 0; unique.push(p); } seen[p.id]++; });

    // Assign each unique pet to its habitat
    HABITATS.forEach(function(h) { h.pets = []; });
    unique.forEach(function(p) {
      var placed = false;
      for (var i = 0; i < HABITATS.length - 1; i++) {
        if (HABITATS[i].ids.indexOf(p.id) >= 0) { HABITATS[i].pets.push(p); placed = true; break; }
      }
      if (!placed) HABITATS[HABITATS.length - 1].pets.push(p);
    });

    var html = '<div class="habitat-wrap">';
    HABITATS.forEach(function(h) {
      if (!h.pets.length) return;
      var dur = 8, shown = h.pets.slice(0, 8);
      html += '<div class="habitat" style="background:' + h.bg + ';border-color:' + h.border + '">';
      html += '<div class="habitat-label">' + h.label + '</div>';
      shown.forEach(function(p, i) {
        var delay = (-(i / shown.length) * dur).toFixed(2);
        var count = seen[p.id] > 1 ? '<span class="habitat-count">×' + seen[p.id] + '</span>' : '';
        html += '<div class="habitat-pet" style="animation-duration:' + dur + 's;animation-delay:' + delay + 's" title="' + p.n + ' ×' + seen[p.id] + '">' + p.e + count + '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // ── Levels ────────────────────────────────────────────────────────────────
  window.playLevels = function () {
    var acc = ensureItems(getAccount());
    var wc  = getWeaponConfig(acc);
    var boostsCount = (acc.shopItems.speed||0)+(acc.shopItems.attack||0)+(acc.shopItems.petluck||0)+(acc.shopItems.potion||0);
    acc.stats.boostsUsed += boostsCount;
    var config = Object.assign({ speed: acc.shopItems.speed||0, attack: acc.shopItems.attack||0,
                   petluck: acc.shopItems.petluck||0, potion: acc.shopItems.potion||0,
                   character: acc.activeCharacter || 'brownbear' }, wc);
    acc.shopItems = { speed:0, attack:0, petluck:0, potion:0 };
    saveAccount(acc);
    showScreen('game');
    if (window.META_startGame) window.META_startGame(config, pickBattlePets(acc.homePets));
  };

  window.META_onRunEnd = function (won, pets, level, homePetUIDs, score, gems, runStats) {
    var acc = ensureItems(getAccount());
    if (level > acc.highestLevel) acc.highestLevel = level;
    // Performance bonus: 1 ruby per 500 score points
    var perfBonus = Math.floor((score || 0) / 500);
    // Gem conversion: 1/20 of gems become rubies
    var gemRubies = Math.floor((gems || 0) / 20);
    // Dig blast bonus rubies
    var digRubies = (runStats && runStats.digRubies) || 0;
    var totalRubies = perfBonus + gemRubies + digRubies;
    acc.rubies += totalRubies;
    // Stats tracking
    acc.stats.runsPlayed++;
    if (won) acc.stats.runsWon++;
    if ((score||0) > acc.stats.bestScore) acc.stats.bestScore = score||0;
    if ((gems||0) > acc.stats.bestGems) acc.stats.bestGems = gems||0;
    if (totalRubies > acc.stats.bestRunRubies) acc.stats.bestRunRubies = totalRubies;
    acc.stats.totalScore += score||0;
    acc.stats.totalGems += gems||0;
    acc.stats.rubiesEarned += totalRubies;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    if (runStats) {
      acc.stats.monstersKilled += runStats.monstersKilled||0;
      acc.stats.wallsBroken += runStats.wallsBroken||0;
      acc.stats.volcanoGems += runStats.volcanoGems||0;
    }
    // Dragon egg: 1 roll per 5-level milestone passed, 20% each
    var eggRolls = Math.floor(level / 5), eggsGot = 0;
    for (var ri = 0; ri < eggRolls; ri++) {
      if (Math.random() < 0.20) {
        var habPool = getOccupiedHabitats(acc.homePets);
        var allHabs = ['aquarium','forest','savanna','sky','mythical','world'];
        var pool = habPool.length ? habPool : allHabs;
        var hab = pool[Math.floor(Math.random() * pool.length)];
        acc.dragonEggs.push({ habitat: hab, hatchAt: Date.now() + 30*24*60*60*1000 });
        eggsGot++;
      }
    }
    var petsGoingHome = [];
    (pets || []).forEach(function(p) {
      if (homePetUIDs && homePetUIDs[p.uid]) return;
      if (Math.random() < 0.30 && speciesCount(acc, p.id) < 30) {
        var hp = { id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' };
        petsGoingHome.push(hp); acc.homePets.push(hp);
      }
    });
    acc.stats.totalPetsHome += petsGoingHome.length;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    var newAwards = checkAwards(acc);
    saveAccount(acc);
    var titleEl = document.getElementById('result-title');
    titleEl.textContent = '💀 You Died';
    titleEl.style.color = '#ff5050';
    document.getElementById('result-level').textContent  = 'Level reached: ' + level;
    document.getElementById('result-rubies').textContent =
      '+' + totalRubies + ' 🔴  (score: ' + perfBonus + '  ·  gems: ' + gemRubies + (digRubies ? '  ·  ⛏️ dig: ' + digRubies : '') + ')' +
      (eggsGot ? '  ·  🥚 ×' + eggsGot + ' dragon egg' + (eggsGot > 1 ? 's' : '') + '!' : '') +
      (newAwards.length ? '  ·  🏅 ' + newAwards.length + ' award' + (newAwards.length>1?'s':'') + '!' : '');
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
    if (newAwards.length) {
      petsEl.innerHTML += '<div class="result-awards"><div class="result-pets-title">🏅 Awards Unlocked:</div>' +
        newAwards.map(function(aw) {
          return '<span class="result-award">' + aw.e + ' ' + aw.n + ' <span class="award-ruby">+' + aw.r + '🔴</span></span>';
        }).join('') + '</div>';
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
    acc.stats.rubiesSpent += item.cost;
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
    acc.stats.rubiesSpent += sv.cost;
    acc.servants[id] = (acc.servants[id] || 0) + 1;
    checkAwards(acc);
    saveAccount(acc);
    renderServants(acc);
  };

  window.collectServants = function () {
    var acc     = ensureItems(getAccount());
    var income  = calcServantIncome(acc);
    if (income.rubies === 0 && income.pets === 0) return;
    acc.rubies += income.rubies;
    acc.stats.servantRubies += income.rubies;
    acc.stats.rubiesEarned += income.rubies;
    if (acc.rubies > acc.stats.maxRubies) acc.stats.maxRubies = acc.rubies;
    var petPool = (window.PETS || []).slice(0, 15);
    for (var i = 0; i < income.pets; i++) {
      var p = petPool[Math.floor(Math.random() * petPool.length)];
      if (speciesCount(acc, p.id) < 30) {
        acc.homePets.push({ id:p.id, e:p.e, n:p.n, cat:p.cat||'', heal:p.heal||0, hi:p.hi||0, atk:p.atk||0, ar:p.ar||0, sc:p.sc||0, d:p.d||'' });
      }
    }
    acc.lastServantCollect = Date.now();
    checkAwards(acc);
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
    acc.stats.rubiesSpent += w.cost;
    acc.weapons[id] = (acc.weapons[id] || 0) + 1;
    if (!acc.activeWeapon) acc.activeWeapon = id;
    checkAwards(acc);
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
