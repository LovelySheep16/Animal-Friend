var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var T = 40, GH = 0, GT = 40, G = null;

function rsz() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  GH = canvas.height - GT;
  if (G) G.build();
}
window.addEventListener('resize', rsz);

var PETS = [
  // HEALERS
  {id:'bunny',   e:'🐰', n:'Bunny',      d:'Heals 6hp/3s',               cost:20,   cat:'🌿 Healers',    heal:6,  hi:3000, atk:0,  ar:0,    sc:0},
  {id:'parrot',  e:'🦜', n:'Parrot',     d:'Heals 8hp/2.5s',             cost:40,   cat:'🌿 Healers',    heal:8,  hi:2500, atk:0,  ar:0,    sc:0},
  {id:'dove',    e:'🕊️', n:'Dove',       d:'Heals 10hp/3s',              cost:60,   cat:'🌿 Healers',    heal:10, hi:3000, atk:0,  ar:0,    sc:0},
  {id:'frog',    e:'🐸', n:'Frog',       d:'Heals 12hp/2s',              cost:85,   cat:'🌿 Healers',    heal:12, hi:2000, atk:0,  ar:0,    sc:0},
  {id:'deer',    e:'🦌', n:'Deer',       d:'Heals 14hp/3s',              cost:110,  cat:'🌿 Healers',    heal:14, hi:3000, atk:0,  ar:0,    sc:0},
  {id:'panda',   e:'🐼', n:'Panda',      d:'Heals 16hp/2.5s',            cost:140,  cat:'🌿 Healers',    heal:16, hi:2500, atk:0,  ar:0,    sc:0},
  {id:'koala',   e:'🐨', n:'Koala',      d:'Heals 18hp/3s',              cost:180,  cat:'🌿 Healers',    heal:18, hi:3000, atk:0,  ar:0,    sc:0},
  {id:'polarbear',e:'🐻‍❄️',n:'Polar Bear',d:'Heals 22hp/3s',             cost:230,  cat:'🌿 Healers',    heal:22, hi:3000, atk:0,  ar:0,    sc:0},
  {id:'unicorn', e:'🦄', n:'Unicorn',    d:'Heals 28hp/2s',              cost:310,  cat:'🌿 Healers',    heal:28, hi:2000, atk:0,  ar:0,    sc:0},
  {id:'phoenix', e:'🦅', n:'Phoenix',    d:'Heals 35hp/2s',              cost:440,  cat:'🌿 Healers',    heal:35, hi:2000, atk:0,  ar:0,    sc:0},
  // ATTACKERS
  {id:'mouse',   e:'🐭', n:'Mouse',      d:'5dmg very fast',             cost:25,   cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:5,  ar:800,  sc:0},
  {id:'cat',     e:'🐱', n:'Cat',        d:'9dmg fast',                  cost:45,   cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:9,  ar:1000, sc:0},
  {id:'duck',    e:'🦆', n:'Duck',       d:'12dmg',                      cost:70,   cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:12, ar:1200, sc:0},
  {id:'fox',     e:'🦊', n:'Fox',        d:'16dmg',                      cost:95,   cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:16, ar:1300, sc:0},
  {id:'monkey',  e:'🐒', n:'Monkey',     d:'20dmg fast',                 cost:130,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:20, ar:900,  sc:0},
  {id:'penguin', e:'🐧', n:'Penguin',    d:'24dmg',                      cost:165,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:24, ar:1200, sc:0},
  {id:'lion',    e:'🦁', n:'Lion',       d:'28dmg',                      cost:205,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:28, ar:1300, sc:0},
  {id:'tiger',   e:'🐯', n:'Tiger',      d:'34dmg fast',                 cost:255,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:34, ar:950,  sc:0},
  {id:'shark',   e:'🦈', n:'Shark',      d:'40dmg',                      cost:320,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:40, ar:1200, sc:0},
  {id:'trex',    e:'🦖', n:'T-Rex',      d:'50dmg',                      cost:420,  cat:'⚔️ Attackers',  heal:0,  hi:0,    atk:50, ar:1400, sc:0},
  // TANKS
  {id:'turtle',  e:'🐢', n:'Turtle',     d:'Blocks 20% hits',            cost:30,   cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:3,  ar:2000, sc:0.20},
  {id:'dog',     e:'🐶', n:'Dog',        d:'Blocks 28% hits',            cost:55,   cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:5,  ar:1800, sc:0.28},
  {id:'rhino',   e:'🦏', n:'Rhino',      d:'Blocks 35% + 8dmg',          cost:90,   cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:8,  ar:1800, sc:0.35},
  {id:'hippo',   e:'🦛', n:'Hippo',      d:'Blocks 40% + 12dmg',         cost:135,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:12, ar:1700, sc:0.40},
  {id:'gorilla', e:'🦍', n:'Gorilla',    d:'Blocks 45% + 16dmg',         cost:180,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:16, ar:1600, sc:0.45},
  {id:'wolf',    e:'🐺', n:'Wolf',       d:'Blocks 48% + 20dmg',         cost:230,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:20, ar:1500, sc:0.48},
  {id:'elephant',e:'🐘', n:'Elephant',   d:'Blocks 52% + 25dmg',         cost:290,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:25, ar:1600, sc:0.52},
  {id:'mammoth', e:'🦣', n:'Mammoth',    d:'Blocks 58% + 32dmg',         cost:375,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:32, ar:1600, sc:0.58},
  {id:'kraken',  e:'🐙', n:'Kraken',     d:'Blocks 65% + 40dmg',         cost:480,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:40, ar:1500, sc:0.65},
  {id:'stonegiant',e:'🗿',n:'Stone Giant',d:'Blocks 72% + 48dmg',        cost:600,  cat:'🛡️ Tanks',      heal:0,  hi:0,    atk:48, ar:1700, sc:0.72},
  // HYBRIDS
  {id:'chick',   e:'🐥', n:'Chick',      d:'Heals 4hp/4s + 5dmg',        cost:35,   cat:'✨ Hybrids',     heal:4,  hi:4000, atk:5,  ar:2000, sc:0},
  {id:'owl',     e:'🦉', n:'Owl',        d:'Heals 7hp/3s + 10dmg',        cost:80,   cat:'✨ Hybrids',     heal:7,  hi:3000, atk:10, ar:2000, sc:0},
  {id:'otter',   e:'🦦', n:'Otter',      d:'Heals 9hp/3s + 14dmg',        cost:118,  cat:'✨ Hybrids',     heal:9,  hi:3000, atk:14, ar:1900, sc:0},
  {id:'flamingo',e:'🦩', n:'Flamingo',   d:'Heals 12hp/3s + 18dmg',       cost:160,  cat:'✨ Hybrids',     heal:12, hi:3000, atk:18, ar:1800, sc:0},
  {id:'peacock', e:'🦚', n:'Peacock',    d:'Heals 14hp/2.5s + 22dmg',     cost:210,  cat:'✨ Hybrids',     heal:14, hi:2500, atk:22, ar:1700, sc:0},
  {id:'swan',    e:'🦢', n:'Swan',       d:'Heals 18hp/2.5s + 26dmg',     cost:270,  cat:'✨ Hybrids',     heal:18, hi:2500, atk:26, ar:1700, sc:0},
  {id:'dragon',  e:'🦎', n:'Salamander',  d:'Heals 20hp/2.5s + 34dmg',     cost:355,  cat:'✨ Hybrids',     heal:20, hi:2500, atk:34, ar:1600, sc:0},
  {id:'kirin',   e:'🦒', n:'Kirin',      d:'Heals 24hp/2s + 42dmg',       cost:460,  cat:'✨ Hybrids',     heal:24, hi:2000, atk:42, ar:1500, sc:0},
  {id:'gryphon', e:'🦅', n:'Gryphon',    d:'Heals 30hp/2s + 50dmg',       cost:580,  cat:'✨ Hybrids',     heal:30, hi:2000, atk:50, ar:1400, sc:0},
  {id:'starbird',e:'🌟', n:'Star Bird',  d:'Heals 40hp/1.5s + 65dmg',     cost:780,  cat:'✨ Hybrids',     heal:40, hi:1500, atk:65, ar:1200, sc:0},
  // LEGENDARIES
  {id:'crab',    e:'🦀', n:'Crab',       d:'Blocks 25% + heals 8hp/3s',   cost:100,  cat:'🔥 Legendaries', heal:8,  hi:3000, atk:8,  ar:1800, sc:0.25},
  {id:'scorpion',e:'🦂', n:'Scorpion',   d:'44dmg + blocks 20%',          cost:210,  cat:'🔥 Legendaries', heal:0,  hi:0,    atk:44, ar:1200, sc:0.20},
  {id:'narwhal', e:'🦭', n:'Narwhal',    d:'Heals 22hp/2s + 28dmg',       cost:330,  cat:'🔥 Legendaries', heal:22, hi:2000, atk:28, ar:1600, sc:0},
  {id:'vampbat', e:'🦇', n:'Vampire Bat',d:'55dmg + heals 6hp/hit',       cost:390,  cat:'🔥 Legendaries', heal:6,  hi:1100, atk:55, ar:1000, sc:0},
  {id:'serpent', e:'🐍', n:'Serpent',    d:'60dmg fast + blocks 30%',     cost:445,  cat:'🔥 Legendaries', heal:0,  hi:0,    atk:60, ar:950,  sc:0.30},
  {id:'direlion',e:'🦁', n:'Dire Lion',  d:'Heals 28hp/2s + 50dmg + 35%', cost:540,  cat:'🔥 Legendaries', heal:28, hi:2000, atk:50, ar:1300, sc:0.35},
  {id:'whale',   e:'🐋', n:'Whale',      d:'Heals 45hp/2s + blocks 52%',  cost:670,  cat:'🔥 Legendaries', heal:45, hi:2000, atk:22, ar:2000, sc:0.52},
  {id:'cerberus',e:'🐕', n:'Cerberus',   d:'80dmg ultra fast',            cost:820,  cat:'🔥 Legendaries', heal:0,  hi:0,    atk:80, ar:800,  sc:0},
  {id:'leviathan',e:'🌊',n:'Leviathan',  d:'Heals 50hp/1.5s + 70dmg',    cost:980,  cat:'🔥 Legendaries', heal:50, hi:1500, atk:70, ar:1100, sc:0},
  {id:'god',     e:'👑', n:'Ancient God',d:'MAX: 70hp/s + 120dmg + 80%',  cost:1500, cat:'🔥 Legendaries', heal:70, hi:1000, atk:120,ar:700,  sc:0.80},
];

var UPGRADES = [
  {id:'speed',   n:'Swift Boots',    e:'👟', d:'+15% move speed',          cost:60,  max:5},
  {id:'petluck', n:'Lucky Charm',    e:'🍀', d:'+8% bonus pet chance',      cost:90,  max:9},
  {id:'attack',  n:'Power Gauntlet', e:'🥊', d:'+8 attack damage',          cost:120, max:99},
  {id:'potion',  n:'Life Essence',   e:'🧪', d:'+10 HP healed every 20s',   cost:180, max:99},
];

// One real animal per country — given as a chest reward, not sold in shop
var CHEST_ANIMALS = [
  {id:'c_oryx',      e:'🐪', n:'Arabian Oryx',      role:'tank'},   // 0  Oman
  {id:'c_bengal',    e:'🐅', n:'Bengal Tiger',       role:'atk'},    // 1  India
  {id:'c_bull',      e:'🐂', n:'Spanish Bull',       role:'tank'},   // 2  Spain
  {id:'c_hare',      e:'🐇', n:'Flemish Hare',       role:'heal'},   // 3  Belgium
  {id:'c_jaguar',    e:'🐆', n:'Belize Jaguar',      role:'atk'},    // 4  Belize
  {id:'c_horse',     e:'🐎', n:'Friesian Horse',     role:'hybrid'}, // 5  Netherlands
  {id:'c_koi',       e:'🐟', n:'Koi Carp',           role:'heal'},   // 6  Japan
  {id:'c_capybara',  e:'🦫', n:'Capybara',           role:'heal'},   // 7  Brazil
  {id:'c_croc',      e:'🐊', n:'Nile Croc',          role:'tank'},   // 8  Egypt
  {id:'c_moose',     e:'🫎', n:'Canadian Moose',     role:'hybrid'}, // 9  Canada
  {id:'c_roo',       e:'🦘', n:'Red Kangaroo',       role:'atk'},    // 10 Australia
  {id:'c_puffin',    e:'🐦', n:'Atlantic Puffin',    role:'heal'},   // 11 Iceland
  {id:'c_axolotl',   e:'🦎', n:'Axolotl',            role:'heal'},   // 12 Mexico
  {id:'c_lemming',   e:'🐀', n:'Arctic Lemming',     role:'atk'},    // 13 Norway
  {id:'c_snowleo',   e:'🐆', n:'Snow Leopard',       role:'atk'},    // 14 Russia
  {id:'c_redpanda',  e:'🦝', n:'Red Panda',          role:'hybrid'}, // 15 China
  {id:'c_bison',     e:'🦬', n:'American Bison',     role:'tank'},   // 16 USA
  {id:'c_hedgehog',  e:'🦔', n:'Hedgehog',           role:'heal'},   // 17 UK
  {id:'c_rooster',   e:'🐓', n:'Gallic Rooster',     role:'atk'},    // 18 France
  {id:'c_boar',      e:'🐗', n:'Wild Boar',          role:'tank'},   // 19 Germany
  {id:'c_dolphin',   e:'🐬', n:'Med. Dolphin',       role:'heal'},   // 20 Italy
  {id:'c_ibex',      e:'🐐', n:'Cretan Ibex',        role:'tank'},   // 21 Greece
  {id:'c_stork',     e:'🦃', n:'White Stork',        role:'heal'},   // 22 Turkey
  {id:'c_camel',     e:'🐪', n:'Sand Camel',         role:'tank'},   // 23 Saudi Arabia
  {id:'c_fennec',    e:'🦔', n:'Fennec Fox',         role:'atk'},    // 24 Morocco
  {id:'c_zebra',     e:'🦓', n:'Plains Zebra',       role:'atk'},    // 25 Kenya
  {id:'c_cheetah',   e:'🐆', n:'Cheetah',            role:'atk'},    // 26 South Africa
  {id:'c_vicuna',    e:'🦙', n:'Vicuña',             role:'heal'},   // 27 Argentina
  {id:'c_condor',    e:'🦤', n:'Andean Condor',      role:'atk'},    // 28 Chile
  {id:'c_tapir',     e:'🐃', n:'Amazon Tapir',       role:'tank'},   // 29 Peru
  {id:'c_anteater',  e:'🦥', n:'Giant Anteater',     role:'hybrid'}, // 30 Colombia
  {id:'c_piranha',   e:'🐠', n:'Piranha',            role:'atk'},    // 31 Venezuela
  {id:'c_thaielo',   e:'🐘', n:'Thai Elephant',      role:'tank'},   // 32 Thailand
  {id:'c_waterbuf',  e:'🐃', n:'Water Buffalo',      role:'tank'},   // 33 Vietnam
  {id:'c_komodo',    e:'🦎', n:'Komodo Dragon',      role:'atk'},    // 34 Indonesia
  {id:'c_phieagle',  e:'🦅', n:'Phil. Eagle',        role:'atk'},    // 35 Philippines
  {id:'c_lynx',      e:'🐆', n:'Iberian Lynx',       role:'atk'},    // 36 Portugal
  {id:'c_elk',       e:'🫎', n:'Swedish Elk',        role:'hybrid'}, // 37 Sweden
  {id:'c_reindeer',  e:'🦌', n:'Reindeer',           role:'heal'},   // 38 Finland
  {id:'c_wisent',    e:'🦬', n:'European Wisent',    role:'tank'},   // 39 Poland
  {id:'c_seagle',    e:'🦅', n:'Steppe Eagle',       role:'atk'},    // 40 Ukraine
  {id:'c_perleopard',e:'🐅', n:'Persian Leopard',    role:'atk'},    // 41 Iran
  {id:'c_araborse',  e:'🐎', n:'Arabian Horse',      role:'hybrid'}, // 42 Iraq
  {id:'c_mpshee',    e:'🐑', n:'Marco Polo Sheep',   role:'tank'},   // 43 Pakistan
  {id:'c_royal',     e:'🐅', n:'Royal Bengal',       role:'atk'},    // 44 Bangladesh
  {id:'c_lankaelo',  e:'🐘', n:'Lanka Elephant',     role:'tank'},   // 45 Sri Lanka
  {id:'c_kiwi',      e:'🦤', n:'Kiwi Bird',          role:'heal'},   // 46 New Zealand
  {id:'c_sotter',    e:'🦦', n:'Smooth Otter',       role:'hybrid'}, // 47 Singapore
  {id:'c_alpibex',   e:'🐐', n:'Alpine Ibex',        role:'tank'},   // 48 Switzerland
  {id:'c_cubancroc', e:'🐊', n:'Cuban Croc',         role:'tank'},   // 49 Cuba
];

function makeChestPet(lv) {
  var a = CHEST_ANIMALS[lv], t = lv / 49;
  var p = {id:a.id, e:a.e, n:a.n, cat:'🎁 Wild', cost:0, heal:0, hi:0, atk:0, ar:0, sc:0, d:''};
  if (a.role === 'atk') {
    p.atk = Math.round(8 + t*70); p.ar = Math.max(600, Math.round(1400 - t*700));
    p.d = p.atk + ' dmg / ' + (p.ar/1000).toFixed(1) + 's';
  } else if (a.role === 'heal') {
    p.heal = Math.round(5 + t*60); p.hi = Math.max(800, Math.round(3500 - t*2200));
    p.d = 'Heals ' + p.heal + 'hp / ' + (p.hi/1000).toFixed(1) + 's';
    if (t >= 0.5) { p.d += ' · self +20hp/100s'; }
  } else if (a.role === 'tank') {
    p.sc = parseFloat(Math.min(0.80, 0.12 + t*0.65).toFixed(2));
    p.atk = Math.round(3 + t*28); p.ar = 1800;
    p.d = 'Blocks ' + Math.round(p.sc*100) + '% + ' + p.atk + ' dmg';
  } else {
    p.atk = Math.round(5 + t*45); p.ar = Math.max(700, Math.round(1300 - t*600));
    p.heal = Math.round(4 + t*40); p.hi = Math.max(900, Math.round(3000 - t*2000));
    p.d = p.atk + ' dmg + heals ' + p.heal + 'hp';
  }
  return p;
}

// 50 countries — environment colours match each nation's landscape
var ZONES = [
  {n:'Oman',          flag:'🇴🇲', b:'#362208', w:'#c89040', f:'#482e10'}, // Arabian desert, golden sand walls
  {n:'India',         flag:'🇮🇳', b:'#142008', w:'#4a8818', f:'#1c2e0e'}, // tropical jungle, rich green walls
  {n:'Spain',         flag:'🇪🇸', b:'#3a1c06', w:'#d87020', f:'#4e2a0e'}, // Mediterranean sun, terracotta walls
  {n:'Belgium',       flag:'🇧🇪', b:'#121e0a', w:'#3a6c1c', f:'#1a2c10'}, // Ardennes forest, dark green walls
  {n:'Belize',        flag:'🇧🇿', b:'#0c2008', w:'#287818', f:'#102c0e'}, // rainforest, deep jungle walls
  {n:'Netherlands',   flag:'🇳🇱', b:'#0e1c0a', w:'#e03858', f:'#162610'}, // tulip fields, vivid red-pink walls
  {n:'Japan',         flag:'🇯🇵', b:'#280e18', w:'#e878a8', f:'#381420'}, // cherry blossom, pink walls
  {n:'Brazil',        flag:'🇧🇷', b:'#0e2408', w:'#309020', f:'#143010'}, // Amazon, vivid green walls
  {n:'Egypt',         flag:'🇪🇬', b:'#3a2a08', w:'#d8b040', f:'#4e3a10'}, // Nile/pyramids, golden walls
  {n:'Canada',        flag:'🇨🇦', b:'#200a08', w:'#c82818', f:'#301412'}, // maple forests, red walls
  {n:'Australia',     flag:'🇦🇺', b:'#3c2008', w:'#e06818', f:'#522c0e'}, // outback, burnt-orange walls
  {n:'Iceland',       flag:'🇮🇸', b:'#0c1830', w:'#4898d8', f:'#102442'}, // glaciers, icy-blue walls
  {n:'Mexico',        flag:'🇲🇽', b:'#381608', w:'#d04818', f:'#4a2010'}, // Aztec warmth, vivid orange walls
  {n:'Norway',        flag:'🇳🇴', b:'#0c1828', w:'#3070b8', f:'#102038'}, // fjords, deep-blue walls
  {n:'Russia',        flag:'🇷🇺', b:'#181e28', w:'#5080a8', f:'#222c38'}, // tundra, slate-blue walls
  {n:'China',         flag:'🇨🇳', b:'#280808', w:'#c81818', f:'#381010'}, // imperial China, vivid red walls
  {n:'USA',           flag:'🇺🇸', b:'#080818', w:'#2848c0', f:'#0e1030'}, // stars & stripes, navy blue walls
  {n:'United Kingdom',flag:'🇬🇧', b:'#0e1c10', w:'#387028', f:'#162a18'}, // English countryside, deep green
  {n:'France',        flag:'🇫🇷', b:'#1a1030', w:'#7840c0', f:'#221840'}, // lavender fields, purple walls
  {n:'Germany',       flag:'🇩🇪', b:'#0c1610', w:'#306830', f:'#142010'}, // Black Forest, dark green walls
  {n:'Italy',         flag:'🇮🇹', b:'#2c1c08', w:'#b86820', f:'#3a2810'}, // Tuscan hills, warm-gold walls
  {n:'Greece',        flag:'🇬🇷', b:'#0c1c38', w:'#2878d8', f:'#102448'}, // Aegean Sea, vivid blue walls
  {n:'Turkey',        flag:'🇹🇷', b:'#300808', w:'#d02020', f:'#401010'}, // Ottoman red, vivid crimson walls
  {n:'Saudi Arabia',  flag:'🇸🇦', b:'#3c2c0a', w:'#c8a828', f:'#503c12'}, // Empty Quarter, golden-sand walls
  {n:'Morocco',       flag:'🇲🇦', b:'#340e08', w:'#c84818', f:'#441808'}, // medina, spiced-orange walls
  {n:'Kenya',         flag:'🇰🇪', b:'#382008', w:'#d06018', f:'#4a2e10'}, // savanna, golden-grass walls
  {n:'South Africa',  flag:'🇿🇦', b:'#1a2c08', w:'#5a9020', f:'#243a10'}, // Cape flora, vivid green walls
  {n:'Argentina',     flag:'🇦🇷', b:'#0c2838', w:'#3898d0', f:'#103048'}, // pampas sky, light-blue walls
  {n:'Chile',         flag:'🇨🇱', b:'#0c1830', w:'#3870c0', f:'#102040'}, // Andes, deep-blue walls
  {n:'Peru',          flag:'🇵🇪', b:'#1c0808', w:'#c83010', f:'#2c1010'}, // Inca ruins, terracotta-red walls
  {n:'Colombia',      flag:'🇨🇴', b:'#2c1808', w:'#a05018', f:'#3c2410'}, // coffee highlands, warm-brown walls
  {n:'Venezuela',     flag:'🇻🇪', b:'#0c2030', w:'#2890b8', f:'#102838'}, // Caribbean coast, teal walls
  {n:'Thailand',      flag:'🇹🇭', b:'#301808', w:'#e09820', f:'#402410'}, // temple gold, warm-golden walls
  {n:'Vietnam',       flag:'🇻🇳', b:'#0c2008', w:'#308020', f:'#102c0c'}, // rice paddies, vivid green walls
  {n:'Indonesia',     flag:'🇮🇩', b:'#300a08', w:'#c03018', f:'#401210'}, // volcanic islands, deep-red walls
  {n:'Philippines',   flag:'🇵🇭', b:'#081830', w:'#2870c0', f:'#0e2040'}, // tropical seas, ocean-blue walls
  {n:'Portugal',      flag:'🇵🇹', b:'#080c28', w:'#1c4890', f:'#0e1438'}, // Atlantic coast, deep-blue walls
  {n:'Sweden',        flag:'🇸🇪', b:'#0c1c10', w:'#2e6828', f:'#142818'}, // pine forests, dark-green walls
  {n:'Finland',       flag:'🇫🇮', b:'#0c1828', w:'#2870b0', f:'#101e34'}, // frozen lakes, icy-blue walls
  {n:'Poland',        flag:'🇵🇱', b:'#200808', w:'#b02020', f:'#301010'}, // white-eagle plains, red walls
  {n:'Ukraine',       flag:'🇺🇦', b:'#1c1a08', w:'#c8c020', f:'#282612'}, // sunflower fields, golden walls
  {n:'Iran',          flag:'🇮🇷', b:'#0c2c10', w:'#28a040', f:'#103818'}, // Persian green, emerald walls
  {n:'Iraq',          flag:'🇮🇶', b:'#302808', w:'#b09030', f:'#403818'}, // Mesopotamia, golden-sand walls
  {n:'Pakistan',      flag:'🇵🇰', b:'#0c2410', w:'#309040', f:'#103018'}, // Karakoram, dark-green walls
  {n:'Bangladesh',    flag:'🇧🇩', b:'#0c2808', w:'#2c9020', f:'#103610'}, // river delta, lush-green walls
  {n:'Sri Lanka',     flag:'🇱🇰', b:'#0e2a0a', w:'#309828', f:'#143612'}, // tea hills, vivid-green walls
  {n:'New Zealand',   flag:'🇳🇿', b:'#122008', w:'#3c7820', f:'#1a2c10'}, // rolling green hills
  {n:'Singapore',     flag:'🇸🇬', b:'#180808', w:'#c82818', f:'#281010'}, // garden city, red walls
  {n:'Switzerland',   flag:'🇨🇭', b:'#0c1828', w:'#d83038', f:'#142034'}, // Alpine red-cross, vivid red walls
  {n:'Cuba',          flag:'🇨🇺', b:'#081830', w:'#2068b0', f:'#0e2240'}, // Caribbean blue
];

var MONS = [
  // Tier 1 — early
  {t:'Slime',        hp:45,   atk:8,   spd:58,  gem:5,   e:'🟢'},
  {t:'Mushroom',     hp:65,   atk:14,  spd:52,  gem:7,   e:'🍄'},
  {t:'Scorpion',     hp:55,   atk:18,  spd:125, gem:9,   e:'🦂'},
  {t:'Bee',          hp:48,   atk:18,  spd:118, gem:6,   e:'🐝'},
  // Tier 2
  {t:'Bat',          hp:80,   atk:22,  spd:105, gem:11,  e:'🦇'},
  {t:'Spider',       hp:115,  atk:26,  spd:92,  gem:15,  e:'🕷️'},
  {t:'Snake',        hp:105,  atk:30,  spd:98,  gem:14,  e:'🐍'},
  {t:'Goblin',       hp:140,  atk:34,  spd:105, gem:20,  e:'👺'},
  // Tier 3
  {t:'Zombie',       hp:200,  atk:36,  spd:60,  gem:22,  e:'🧟'},
  {t:'Golem',        hp:240,  atk:40,  spd:45,  gem:28,  e:'🪨'},
  {t:'Fire Imp',     hp:155,  atk:50,  spd:132, gem:26,  e:'🔥'},
  {t:'Troll',        hp:275,  atk:44,  spd:58,  gem:34,  e:'👿'},
  {t:'Berserker',    hp:210,  atk:60,  spd:122, gem:40,  e:'🤺'},
  // Tier 4
  {t:'Ghost',        hp:150,  atk:56,  spd:125, gem:30,  e:'👻'},
  {t:'Ice Wraith',   hp:260,  atk:55,  spd:115, gem:38,  e:'❄️'},
  {t:'Lava Beast',   hp:330,  atk:64,  spd:72,  gem:44,  e:'🌋'},
  {t:'Werewolf',     hp:380,  atk:68,  spd:118, gem:55,  e:'🐺'},
  {t:'Necromancer',  hp:300,  atk:74,  spd:82,  gem:62,  e:'🧙'},
  // Tier 5
  {t:'Demon',        hp:440,  atk:78,  spd:95,  gem:68,  e:'👹'},
  {t:'Wyvern',       hp:480,  atk:74,  spd:105, gem:75,  e:'🐲'},
  {t:'Lich',         hp:400,  atk:86,  spd:88,  gem:80,  e:'💀'},
  {t:'Titan',        hp:700,  atk:88,  spd:55,  gem:110, e:'🗿'},
  {t:'Night Stalker',hp:440,  atk:105, spd:132, gem:135, e:'🌙'},
  // Tier 6
  {t:'Void Spawner', hp:540,  atk:86,  spd:108, gem:95,  e:'🌑'},
  {t:'Elemental',    hp:600,  atk:96,  spd:85,  gem:105, e:'⚡'},
  {t:'Shadow Lord',  hp:820,  atk:100, spd:95,  gem:130, e:'🌫️'},
  {t:'Stone Drake',  hp:800,  atk:98,  spd:72,  gem:120, e:'🪨'},
  {t:'Elder Demon',  hp:1000, atk:118, spd:98,  gem:180, e:'👿'},
  // Tier 7 — endgame
  {t:'Abyssal Drake',hp:1000, atk:112, spd:100, gem:150, e:'🐲'},
  {t:'Doom Knight',  hp:1200, atk:125, spd:85,  gem:170, e:'⚔️'},
  {t:'Death Knight', hp:1400, atk:132, spd:92,  gem:200, e:'💀'},
  {t:'Chaos Fiend',  hp:1300, atk:142, spd:108, gem:190, e:'😈'},
  {t:'Chaos Lord',   hp:1600, atk:158, spd:95,  gem:240, e:'☠️'},
];

var WEAPONS = [
  // ── Close range (range 55-68) — highest damage ───────────────────────────
  {id:'stick',       e:'🪵', n:'Stick',           dmg:8,   range:55,  cost:5,   cat:'Close'},
  {id:'dagger',      e:'🗡️', n:'Dagger',          dmg:18,  range:58,  cost:14,  cat:'Close'},
  {id:'shortsword',  e:'⚔️', n:'Short Sword',     dmg:30,  range:60,  cost:25,  cat:'Close'},
  {id:'handaxe',     e:'🪓', n:'Hand Axe',        dmg:44,  range:58,  cost:40,  cat:'Close'},
  {id:'warhammer',   e:'🔨', n:'War Hammer',      dmg:60,  range:55,  cost:58,  cat:'Close'},
  {id:'longsword',   e:'🗡️', n:'Longsword',       dmg:78,  range:62,  cost:80,  cat:'Close'},
  {id:'battleaxe',   e:'🪓', n:'Battle Axe',      dmg:100, range:60,  cost:106, cat:'Close'},
  {id:'maul',        e:'🔨', n:'Maul',            dmg:126, range:55,  cost:136, cat:'Close'},
  {id:'greatsword',  e:'⚔️', n:'Greatsword',      dmg:158, range:65,  cost:172, cat:'Close'},
  {id:'excalibur',   e:'✨', n:'Excalibur',       dmg:200, range:68,  cost:218, cat:'Close'},
  // ── Medium range (range 85-110) ─────────────────────────────────────────
  {id:'spear',       e:'🔱', n:'Spear',           dmg:20,  range:90,  cost:32,  cat:'Medium'},
  {id:'trident',     e:'🔱', n:'Trident',         dmg:35,  range:95,  cost:52,  cat:'Medium'},
  {id:'glaive',      e:'🗡️', n:'Glaive',          dmg:52,  range:98,  cost:75,  cat:'Medium'},
  {id:'halberd',     e:'⚔️', n:'Halberd',         dmg:72,  range:100, cost:102, cat:'Medium'},
  {id:'pike',        e:'🔱', n:'Pike',            dmg:94,  range:105, cost:134, cat:'Medium'},
  {id:'warscythe',   e:'🌙', n:'War Scythe',      dmg:118, range:100, cost:170, cat:'Medium'},
  {id:'naginata',    e:'⚔️', n:'Naginata',        dmg:146, range:105, cost:210, cat:'Medium'},
  {id:'lance',       e:'🔱', n:'Lance',           dmg:178, range:110, cost:258, cat:'Medium'},
  {id:'dragonspear', e:'🐉', n:'Dragon Spear',    dmg:215, range:108, cost:315, cat:'Medium'},
  {id:'cosmiclance', e:'🌌', n:'Cosmic Lance',    dmg:260, range:110, cost:380, cat:'Medium'},
  // ── Far range (range 130-158) ────────────────────────────────────────────
  {id:'sling',       e:'🪃', n:'Sling',           dmg:10,  range:130, cost:18,  cat:'Far'},
  {id:'throwknife',  e:'🗡️', n:'Throwing Knife',  dmg:20,  range:135, cost:34,  cat:'Far'},
  {id:'boomerang',   e:'🪃', n:'Boomerang',       dmg:32,  range:138, cost:54,  cat:'Far'},
  {id:'javelin',     e:'🏹', n:'Javelin',         dmg:46,  range:142, cost:78,  cat:'Far'},
  {id:'chakram',     e:'⭕', n:'Chakram',         dmg:62,  range:145, cost:106, cat:'Far'},
  {id:'throwaxe',    e:'🪓', n:'Throwing Axe',    dmg:80,  range:148, cost:138, cat:'Far'},
  {id:'warfan',      e:'🌸', n:'War Fan',         dmg:100, range:150, cost:175, cat:'Far'},
  {id:'bolas',       e:'⭕', n:'Bolas',           dmg:124, range:152, cost:216, cat:'Far'},
  {id:'flyingdisc',  e:'🥏', n:'Flying Disc',     dmg:152, range:155, cost:265, cat:'Far'},
  {id:'shurikens',   e:'⭐', n:'Shuriken Storm',  dmg:185, range:158, cost:320, cat:'Far'},
  // ── Very far range (range 175-220) ──────────────────────────────────────
  {id:'shortbow',    e:'🏹', n:'Short Bow',       dmg:12,  range:175, cost:24,  cat:'Very Far'},
  {id:'crossbow',    e:'🏹', n:'Crossbow',        dmg:24,  range:185, cost:44,  cat:'Very Far'},
  {id:'longbow',     e:'🏹', n:'Long Bow',        dmg:38,  range:195, cost:68,  cat:'Very Far'},
  {id:'compoundbow', e:'🏹', n:'Compound Bow',    dmg:55,  range:198, cost:96,  cat:'Very Far'},
  {id:'heavycross',  e:'🏹', n:'Heavy Crossbow',  dmg:74,  range:192, cost:128, cat:'Very Far'},
  {id:'recurvebow',  e:'🏹', n:'Recurve Bow',     dmg:96,  range:204, cost:164, cat:'Very Far'},
  {id:'warbow',      e:'🏹', n:'War Bow',         dmg:122, range:208, cost:207, cat:'Very Far'},
  {id:'dragonbow',   e:'🐉', n:'Dragon Bow',      dmg:152, range:212, cost:256, cat:'Very Far'},
  {id:'angelbow',    e:'😇', n:'Angel Bow',       dmg:188, range:215, cost:314, cat:'Very Far'},
  {id:'heavensarrow',e:'✨', n:"Heaven's Arrow",  dmg:230, range:220, cost:380, cat:'Very Far'},
  // ── Magic range (range 200-260) ─────────────────────────────────────────
  {id:'wand',        e:'🪄', n:'Magic Wand',      dmg:14,  range:200, cost:28,  cat:'Magic'},
  {id:'firestaff',   e:'🔥', n:'Fire Staff',      dmg:28,  range:215, cost:50,  cat:'Magic'},
  {id:'icestaff',    e:'❄️', n:'Ice Staff',       dmg:44,  range:220, cost:74,  cat:'Magic'},
  {id:'thunderstaff',e:'⚡', n:'Thunder Staff',   dmg:62,  range:228, cost:102, cat:'Magic'},
  {id:'darkorb',     e:'🔮', n:'Dark Orb',        dmg:82,  range:232, cost:134, cat:'Magic'},
  {id:'arcanetome',  e:'📖', n:'Arcane Tome',     dmg:105, range:238, cost:170, cat:'Magic'},
  {id:'chaoswand',   e:'🌀', n:'Chaos Wand',      dmg:132, range:244, cost:212, cat:'Magic'},
  {id:'soulstaff',   e:'👻', n:'Soul Staff',      dmg:162, range:250, cost:260, cat:'Magic'},
  {id:'voidscepter', e:'🌑', n:'Void Scepter',    dmg:198, range:255, cost:316, cat:'Magic'},
  {id:'cosmicstaff', e:'🌌', n:'Cosmic Staff',    dmg:240, range:260, cost:382, cat:'Magic'},
];
window.WEAPONS = WEAPONS;

// FOOD_ITEMS defined in meta.js and exported as window.FOOD_ITEMS

function lvlDef(lv) {
  var zoneLv = lv % 50;
  var zone  = ZONES[zoneLv];
  var loop  = Math.floor(lv / 50);
  var pct   = (zoneLv + 1) / 50;
  var pe    = Math.min(MONS.length, Math.max(3, Math.ceil(pct * MONS.length)));
  var ps    = Math.max(0, pe - Math.min(10, pe));
  var pool  = MONS.slice(ps, pe);
  var count = 40 + Math.floor(lv * 7);
  var loopLabel = loop > 0 ? ' (Loop ' + (loop + 1) + ')' : '';
  return {name: zone.flag + ' Level ' + (lv + 1) + ': ' + zone.n + loopLabel, zone: zone, pool: pool, count: count, li: zoneLv % 5, loop: loop};
}

function petRole(pt) {
  if (pt.cat.indexOf('Healer')   >= 0) return 'healer';
  if (pt.cat.indexOf('Attacker') >= 0) return 'attacker';
  if (pt.cat.indexOf('Tank')     >= 0) return 'tank';
  return 'mixed';
}

var keys = {};

window.addEventListener('keydown', function(e) {
  var tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  keys[e.code] = true;
  if ((e.code === 'KeyS' || e.code === 'KeyE') && !e.repeat && G && !G.dead && !G.win) {
    if (G.open) closeShop(); else { keys['KeyS'] = false; openShop(); }
  }
  if (e.code === 'KeyF' && !e.repeat && G && !G.dead && !G.win) {
    var fov = document.getElementById('foodov');
    if (fov && fov.style.display === 'flex') closeBackpack(); else openBackpack();
  }
  e.preventDefault();
});
window.addEventListener('keyup', function(e) {
  var tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  keys[e.code] = false;
});

// Touch controls — drag to move, tap to attack
var _touch = null;
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  var t = e.touches[0];
  _touch = { sx: t.clientX, sy: t.clientY, moved: false };
}, { passive: false });
canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  if (!_touch) return;
  var t  = e.touches[0];
  var dx = t.clientX - _touch.sx, dy = t.clientY - _touch.sy;
  var dead = 18;
  _touch.moved = Math.hypot(dx, dy) > dead;
  keys['ArrowRight'] = dx >  dead;
  keys['ArrowLeft']  = dx < -dead;
  keys['ArrowDown']  = dy >  dead;
  keys['ArrowUp']    = dy < -dead;
}, { passive: false });
canvas.addEventListener('touchend', function(e) {
  e.preventDefault();
  keys['ArrowRight'] = keys['ArrowLeft'] = keys['ArrowDown'] = keys['ArrowUp'] = false;
  _touch = null;
}, { passive: false });

function petMaxHp(pt) {
  if (pt.cost > 0) return Math.max(50, Math.round(40 + pt.cost * 0.30));
  return Math.max(60, Math.round(60 + (pt.atk || 0) * 1.5 + (pt.heal || 0) * 1.5));
}

function Game() {
  this.lv = 0; this.gems = 0; this.score = 0;
  this.pets = []; this.ptim = {}; this.patk = {};
  this.open = false; this.dead = false; this.win = false; this.trans = false;
  this.parts = []; this.floats = []; this.fx = [];
  this.t0 = Date.now(); this.help = true;
  this.ld = null; this.map = null; this.mons = [];
  this.p = null; this.aa = 0; this.C = 0; this.R = 0;
  this.upg = {speed:0, petluck:0, attack:0, potion:0};
  this.potionTick = 0;
  this.towers = []; this.towerAtk = {}; this.pairTimers = {};
  this.chest = null; this.chestPet = null; this.alreadyOwned = false;
  this.boxes = []; this.gemChests = []; this.petTrail = [];
  this.volcano = null; this.lavaBlasts = []; this.volcanoCooldown = 0;
  this.lavaStreams = []; this.lavaStreamLen = 50;
  this.monstersKilled = 0; this.wallsBroken = 0; this.volcanoGems = 0;
  // Portals & moving walls
  this.portals = []; this.portalCool = {}; this.wallMoveTimer = 10000;
  // Alt maze (realm portal)
  this.inAltMaze = false; this.savedMazeState = null; this.altMazeState = null;
  this.realmReturnX = T*3; this.realmReturnY = GT+T*3;
  // Characters & blast
  this.charDef = null; this.blastCharge = 0; this.blastReady = false; this.digRubies = 0;
  // Team system
  this.team = []; this.teamIdx = 0;
  this.teamHp = []; this.teamBlastCharge = []; this.teamBlastReady = [];
  this.teamDeadThisRun = []; this.teamRunKills = []; this.teamHealTim = []; this.teamSelfHealTim = [];
  this.charKillsData = {};
  // Boss run
  this.isBossRun = false; this.bossLasers = []; this.bossKills = 0; this.bossPetDmg = 10;
  this.voidPhase = false; this.voidKills = 0;
  // Food
  this.foodAtk = 0;
  // Debuffs (applied by blasts)
  this.slowUntil = 0; this.weakenUntil = 0;
  this.build(); this.showBanner();
}

Game.prototype.build = function() {
  this.ld = lvlDef(this.lv);
  this.C = Math.floor(canvas.width / T); this.R = Math.floor(GH / T);
  this.map = this.genMap(this.ld.li, this.C, this.R);
  this.wallHp = {};
  this.genPortals(); this.portalCool = {}; this.wallMoveTimer = 10000;
  this.p = {x: T*3, y: GT+T*3, hp: 100, mhp: 100, atk: false, at: 0, dir: 1, inv: 0};
  this.mons = this.spawnMons(); this.aa = 0;

  // Chest setup — cycle through 50 animals per loop
  var chestLv = this.lv % 50;
  var ca = CHEST_ANIMALS[chestLv];
  this.chestPet = makeChestPet(chestLv);
  this.alreadyOwned = this.pets.some(function(pt) { return pt.id === ca.id; });
  this.chest = null;
  if (!this.alreadyOwned) {
    var cpos = this.rf();
    this.chest = {x: cpos.x, y: cpos.y, open: false, hp: 200, mhp: 200};
    var pool = this.ld.pool, md = pool[pool.length - 1];
    var hpSc = 1 + this.lv * 0.12, atkSc = 1 + this.lv * 0.10, spdSc = 1 + this.lv * 0.014;
    this.mons.push({
      t:'Guardian', hp:Math.round(md.hp*hpSc*3), mhp:Math.round(md.hp*hpSc*3),
      atk:Math.round(md.atk*atkSc*1.8), spd:Math.round(md.spd*spdSc),
      gem:Math.round(md.gem*3), e:md.e,
      x:cpos.x, y:cpos.y, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isGuardian:true
    });
  }

  // Spawn 5 revival guards
  var guardHpBase  = Math.round((400 + this.lv * 45) * (1 + Math.floor(this.lv/50) * 0.65));
  var guardAtkBase = Math.round(28 + this.lv * 6);
  for (var gi = 0; gi < 5; gi++) {
    var gpos = this.rf();
    this.mons.push({
      t:'Guard', e:'🛡️', hp:guardHpBase, mhp:guardHpBase,
      atk:guardAtkBase, spd:100, gem:15,
      x:gpos.x, y:gpos.y, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isGuard:true
    });
  }

  // Spawn volcano
  var vpos = this.rf();
  this.volcano = { x: vpos.x, y: vpos.y };
  this.lavaBlasts = []; this.lavaStreams = []; this.lavaStreamLen = 50; this.volcanoCooldown = 4000;

  // Spawn boxes (avoid player start area)
  this.boxes = [];
  var boxCount = 8 + Math.floor(Math.random() * 6);
  for (var bsi = 0; bsi < boxCount; bsi++) {
    for (var bti = 0; bti < 200; bti++) {
      var bc = 1 + Math.floor(Math.random() * (this.C - 2));
      var br = 1 + Math.floor(Math.random() * (this.R - 2));
      if (this.map[br][bc]) continue;
      var bx2 = bc * T + T/2, by2 = GT + br * T + T/2;
      if (Math.hypot(bx2 - this.p.x, by2 - this.p.y) < T * 4) continue;
      var clash = false;
      for (var bci = 0; bci < this.boxes.length; bci++) { if (this.boxes[bci].c === bc && this.boxes[bci].r === br) { clash = true; break; } }
      if (!clash) { this.boxes.push({ c: bc, r: br, x: bx2, y: by2, hp: 1 }); break; }
    }
  }

  // Spawn gem chests (3-7 per level, not required to finish)
  this.gemChests = [];
  var gcCount = 3 + Math.floor(Math.random() * 5);
  for (var gi2 = 0; gi2 < gcCount; gi2++) {
    var gcp = this.rf();
    this.gemChests.push({ x: gcp.x, y: gcp.y, gems: 1 + Math.floor(Math.random() * 6), open: false });
  }

  var n = Date.now();
  for (var i = 0; i < this.pets.length; i++) {
    var pt = this.pets[i];
    if (!pt.mhp) { pt.mhp = petMaxHp(pt); if (!pt.dead) pt.hp = pt.mhp; }
    if (!this.patk[pt.uid]) this.patk[pt.uid] = n;
    if (pt.hi > 0 && !this.ptim[pt.uid]) this.ptim[pt.uid] = n;
    var ppos = this.rf();
    pt.x = ppos.x; pt.y = ppos.y;
    pt.wdx = 0; pt.wdy = 0; pt.wtim = 0; pt.healMode = false;
  }
  for (var ti = 0; ti < this.towers.length; ti++) {
    var tw = this.towers[ti], tpos = this.rf();
    if (tw.dead) { tw.dead = false; tw.hp = tw.mhp || petMaxHp(tw); }
    if (!tw.mhp) { tw.mhp = petMaxHp(tw); tw.hp = tw.mhp; }
    tw.x = tpos.x; tw.y = tpos.y;
    if (!this.towerAtk[tw.uid]) this.towerAtk[tw.uid] = n;
  }
  // Pre-generate the alt maze for the realm portal
  this.inAltMaze = false; this.savedMazeState = null;
  this.altMazeState = this.buildAltMazeState();
};

Game.prototype.genMap = function(li, C, R) {
  // All walls to start
  var m = [], r, c;
  for (r = 0; r < R; r++) { m[r] = []; for (c = 0; c < C; c++) m[r][c] = 1; }

  // Iterative DFS maze — cells at odd tile positions
  var visited = [];
  for (r = 0; r < R; r++) { visited[r] = []; for (c = 0; c < C; c++) visited[r][c] = false; }
  var stack = [[1, 1]];
  visited[1][1] = true; m[1][1] = 0;

  while (stack.length > 0) {
    var cur = stack[stack.length - 1];
    var cr = cur[0], cc = cur[1];
    var dirs = [[0,2],[0,-2],[2,0],[-2,0]];
    // Shuffle
    for (var si = dirs.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = dirs[si]; dirs[si] = dirs[sj]; dirs[sj] = tmp;
    }
    var found = false;
    for (var di = 0; di < dirs.length; di++) {
      var nr = cr + dirs[di][0], nc = cc + dirs[di][1];
      if (nr > 0 && nr < R - 1 && nc > 0 && nc < C - 1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        m[nr][nc] = 0;
        m[cr + dirs[di][0]/2][cc + dirs[di][1]/2] = 0; // carve passage
        stack.push([nr, nc]);
        found = true; break;
      }
    }
    if (!found) stack.pop();
  }

  // Add ~20% random loops so it's not a pure perfect maze
  for (r = 1; r < R - 1; r++) {
    for (c = 1; c < C - 1; c++) {
      if (m[r][c] === 1 && Math.random() < 0.12) m[r][c] = 0;
    }
  }

  // Clear an open room around the player start (top-left)
  for (r = 1; r <= Math.min(4, R-2); r++) {
    for (c = 1; c <= Math.min(4, C-2); c++) {
      m[r][c] = 0;
    }
  }

  return m;
};

Game.prototype.getMazeState = function() {
  return {
    map: this.map, wallHp: this.wallHp,
    mons: this.mons, chest: this.chest, chestPet: this.chestPet, alreadyOwned: this.alreadyOwned,
    gemChests: this.gemChests, boxes: this.boxes,
    volcano: this.volcano, lavaStreams: this.lavaStreams, lavaBlasts: this.lavaBlasts,
    lavaStreamLen: this.lavaStreamLen, volcanoCooldown: this.volcanoCooldown,
    portals: this.portals, portalCool: this.portalCool,
    towers: this.towers, pairTimers: this.pairTimers, wallMoveTimer: this.wallMoveTimer
  };
};

Game.prototype.setMazeState = function(s) {
  this.map = s.map; this.wallHp = s.wallHp;
  this.mons = s.mons; this.chest = s.chest; this.chestPet = s.chestPet; this.alreadyOwned = s.alreadyOwned;
  this.gemChests = s.gemChests; this.boxes = s.boxes;
  this.volcano = s.volcano; this.lavaStreams = s.lavaStreams; this.lavaBlasts = s.lavaBlasts;
  this.lavaStreamLen = s.lavaStreamLen; this.volcanoCooldown = s.volcanoCooldown;
  this.portals = s.portals; this.portalCool = s.portalCool;
  this.towers = s.towers; this.pairTimers = s.pairTimers; this.wallMoveTimer = s.wallMoveTimer;
};

Game.prototype.buildAltMazeState = function() {
  // Temporarily swap map so rf() places things correctly in the alt maze
  var origMap = this.map, origP = this.p;
  var altMap  = this.genMap(this.ld.li, this.C, this.R);
  this.map = altMap;
  this.p   = { x: T*3, y: GT+T*3 };

  var altMons = this.spawnMons();

  // Gem chests
  var altGemChests = [];
  var gcCount = 1 + Math.floor(Math.random() * 3);
  for (var g = 0; g < gcCount; g++) {
    var gp = this.rf();
    altGemChests.push({ x:gp.x, y:gp.y, gems: 5 + Math.floor(Math.random()*15), open:false });
  }
  // Boxes (presents)
  var altBoxes = [];
  for (var b = 0; b < 10 + Math.floor(Math.random()*6); b++) {
    var bp = this.rf(); altBoxes.push({ x:bp.x, y:bp.y });
  }
  // Return realm portal (red)
  var rp = this.rf();
  var returnPortal = { x:rp.x, y:rp.y, color:'#ff2200', pair:-1, linkTo:-1, isReturn:true };

  // Restore original state
  this.map = origMap; this.p = origP;

  return {
    map: altMap, wallHp: {},
    mons: altMons, chest: null, chestPet: null, alreadyOwned: true,
    gemChests: altGemChests, boxes: altBoxes,
    volcano: null, lavaStreams: [], lavaBlasts: [], lavaStreamLen: 50, volcanoCooldown: 99999,
    portals: [returnPortal], portalCool: {},
    towers: [], pairTimers: {}, wallMoveTimer: 10000
  };
};

Game.prototype.enterAltMaze = function() {
  if (this.inAltMaze) return;
  this.savedMazeState = this.getMazeState();
  this.realmReturnX = this.p.x; this.realmReturnY = this.p.y;
  if (!this.altMazeState) this.altMazeState = this.buildAltMazeState();
  this.setMazeState(this.altMazeState);
  this.inAltMaze = true;
  // Place player at the return portal
  var rp = this.portals[0];
  this.p.x = rp ? rp.x + T*2 : T*4; this.p.y = rp ? rp.y : GT+T*4;
  this.portalCool[0] = Date.now() + 2000;
  this.fl(this.p.x, this.p.y - 30, '🌍 Another realm!', '#ff2200');
  this.showBanner();
};

Game.prototype.exitAltMaze = function() {
  if (!this.inAltMaze) return;
  this.altMazeState = this.getMazeState(); // save progress in alt maze
  this.setMazeState(this.savedMazeState);
  this.inAltMaze = false;
  this.p.x = this.realmReturnX; this.p.y = this.realmReturnY;
  // Cool down the realm portals so player doesn't instantly re-enter
  for (var i = 0; i < this.portals.length; i++) {
    if (this.portals[i].isRealm) this.portalCool[i] = Date.now() + 2000;
  }
  this.fl(this.p.x, this.p.y - 30, '🌀 Back to your realm!', '#8844ff');
  this.showBanner();
};

Game.prototype.genPortals = function() {
  this.portals = [];
  if (this.isBossRun) return;
  var COLORS = ['#8844ff', '#ff3399', '#00ffcc', '#ffaa00'];
  // More realm (world) portals at higher levels: 1 at lv0, +1 every 15 levels, max 5
  var numRealmPairs  = Math.min(5, 1 + Math.floor(this.lv / 15));
  // Total pairs: realm pairs + 1-3 random regular pairs
  var numPairs = numRealmPairs + 1 + Math.floor(Math.random() * 3);
  var placed = [];
  for (var pi = 0; pi < numPairs; pi++) {
    for (var side = 0; side < 2; side++) {
      for (var attempt = 0; attempt < 300; attempt++) {
        var c = 1 + Math.floor(Math.random() * (this.C - 2));
        var r = 1 + Math.floor(Math.random() * (this.R - 2));
        if (this.map[r][c]) continue;
        var px = c * T + T/2, py = GT + r * T + T/2;
        if (Math.hypot(px - T*3, py - (GT+T*3)) < T*5) continue;
        var tooClose = false;
        for (var j = 0; j < placed.length; j++) {
          if (Math.abs(placed[j].c - c) + Math.abs(placed[j].r - r) < 4) { tooClose = true; break; }
        }
        if (tooClose) continue;
        placed.push({ r:r, c:c, x:px, y:py, pair:pi, color:COLORS[(pi - numRealmPairs) % COLORS.length], linkTo:-1 });
        break;
      }
    }
  }
  // Link each portal to its pair partner
  for (var i = 0; i < placed.length; i++) {
    if (placed[i].linkTo !== -1) continue;
    for (var k = 0; k < placed.length; k++) {
      if (k !== i && placed[k].pair === placed[i].pair && placed[k].linkTo === -1) {
        placed[i].linkTo = k; placed[k].linkTo = i; break;
      }
    }
  }
  this.portals = placed.filter(function(p) { return p.linkTo !== -1; });
  // The first numRealmPairs pairs are all realm portals
  for (var ri = 0; ri < this.portals.length; ri++) {
    if (this.portals[ri].pair < numRealmPairs) { this.portals[ri].isRealm = true; this.portals[ri].color = '#ff2200'; }
  }
};

// Returns {pa, pb} if there is a portal route from (fx1,fy1) to (tx,ty) within range
Game.prototype.portalShot = function(fx1, fy1, tx, ty) {
  var RANGE = 200;
  for (var i = 0; i < this.portals.length; i++) {
    var pa = this.portals[i];
    if (pa.linkTo < 0) continue;
    var pb = this.portals[pa.linkTo];
    if (Math.hypot(fx1 - pa.x, fy1 - pa.y) < RANGE && Math.hypot(pb.x - tx, pb.y - ty) < RANGE) {
      return { pa: pa, pb: pb };
    }
  }
  return null;
};

Game.prototype.moveWalls = function() {
  if (this.lv < 24 || this.isBossRun) return;
  var DIRS = [[0,1],[0,-1],[1,0],[-1,0]];
  var candidates = [];
  for (var r = 1; r < this.R-1; r++) {
    for (var c = 1; c < this.C-1; c++) {
      if (this.map[r][c] === 1) candidates.push([r, c]);
    }
  }
  // Shuffle
  for (var si = candidates.length-1; si > 0; si--) {
    var sj = Math.floor(Math.random() * (si+1));
    var tmp = candidates[si]; candidates[si] = candidates[sj]; candidates[sj] = tmp;
  }
  var maxMove = Math.min(12, Math.ceil(candidates.length * 0.12));
  var moved = 0, p = this.p;
  for (var ci = 0; ci < candidates.length && moved < maxMove; ci++) {
    var wr = candidates[ci][0], wc = candidates[ci][1];
    if (!this.map[wr][wc]) continue;
    var dir = DIRS[Math.floor(Math.random() * 4)];
    var nr = wr + dir[0], nc = wc + dir[1];
    if (nr < 1 || nr >= this.R-1 || nc < 1 || nc >= this.C-1) continue;
    if (this.map[nr][nc]) continue;
    var nx = nc * T + T/2, ny = GT + nr * T + T/2;
    if (Math.hypot(nx - p.x, ny - p.y) < T*2) continue;
    // Don't crush a portal
    var crushesPortal = false;
    for (var pti = 0; pti < this.portals.length; pti++) {
      if (this.portals[pti].r === nr && this.portals[pti].c === nc) { crushesPortal = true; break; }
    }
    if (crushesPortal) continue;
    this.map[wr][wc] = 0;
    this.map[nr][nc] = 1;
    var oldKey = wr + '_' + wc, newKey = nr + '_' + nc;
    if (this.wallHp[oldKey] !== undefined) { this.wallHp[newKey] = this.wallHp[oldKey]; delete this.wallHp[oldKey]; }
    moved++;
  }
  if (moved > 0) this.fl(p.x, p.y - 40, '⚡ Walls shift!', '#aaaaff');
};

Game.prototype.spawnMons = function() {
  var loop  = this.ld ? (this.ld.loop || 0) : Math.floor(this.lv / 50);
  var lm    = 1 + loop * 0.65;      // each loop adds 65% more difficulty
  var hpSc  = (1 + this.lv * 0.25)  * lm;
  var atkSc = (1 + this.lv * 0.22)  * lm;
  var spdSc = (1 + this.lv * 0.030) * lm;
  var pool = this.ld.pool, count = this.ld.count, arr = [];
  for (var i = 0; i < count; i++) {
    var md = pool[Math.floor(Math.random() * pool.length)], pos = this.rf();
    arr.push({
      t: md.t,
      hp:  Math.round(md.hp  * hpSc),
      mhp: Math.round(md.hp  * hpSc),
      atk: Math.round(md.atk * atkSc),
      spd: Math.round(md.spd * spdSc),
      gem: md.gem, e: md.e,
      x: pos.x, y: pos.y,
      at: 0, pat: 0, mt: 0, dx: 0, dy: 0, dead: false
    });
  }
  // One random regular monster is secretly the mega monster
  if (arr.length > 0) {
    arr[Math.floor(Math.random() * arr.length)].isMega = true;
  }
  return arr;
};

Game.prototype.rf = function() {
  var px = this.p ? this.p.x : T*3, py = this.p ? this.p.y : GT+T*3;
  for (var i = 0; i < 300; i++) {
    var c = 1 + Math.floor(Math.random() * (this.C - 2)), r = 1 + Math.floor(Math.random() * (this.R - 2));
    if (!this.map[r][c]) { var x = c*T+T/2, y = GT+r*T+T/2; if (Math.hypot(x-px, y-py) > T*5) return {x:x, y:y}; }
  }
  return {x:T*8, y:GT+T*5};
};

Game.prototype.buildBossLevel = function() {
  this.C = Math.floor(canvas.width / T); this.R = Math.floor(GH / T);
  // Open arena — only border walls
  this.map = [];
  for (var r = 0; r < this.R; r++) {
    this.map[r] = [];
    for (var c = 0; c < this.C; c++) {
      this.map[r][c] = (r === 0 || r === this.R - 1 || c === 0 || c === this.C - 1) ? 1 : 0;
    }
  }
  this.wallHp = {};
  this.p = {x: T*3, y: GT+T*3, hp: 100, mhp: 100, atk: false, at: 0, dir: 1, inv: 0};
  var scale = Math.pow(2, this.bossKills || 0);
  var bossHp  = Math.round(10000 * scale);
  var bossAtk = Math.round(50    * scale);
  this.bossPetDmg = Math.round(10 * scale);
  var gen = this.bossKills > 0 ? ' (Gen ' + (this.bossKills + 1) + ' · ' + scale + 'x)' : '';
  this.ld = { name: '🌠 COSMIC LAIR — Boss Fight' + gen, zone: {b:'#02000a', w:'#1a0040', f:'#08000f', flag:'🌠', n:'Cosmic Lair'}, pool: [], count: 0, li: 0, loop: 0 };
  var bx = Math.round(canvas.width * 0.7), by = Math.round(GT + GH * 0.5);
  this.mons = [{ t:'Cosmic Terror', e:'🌠', hp:bossHp, mhp:bossHp, atk:bossAtk, spd:45, gem:0,
    x:bx, y:by, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isBoss:true, laserTimer:2000 }];
  this.bossLasers = []; this.chest = null; this.chestPet = null; this.alreadyOwned = true;
  this.volcano = null; this.lavaBlasts = []; this.lavaStreams = []; this.gemChests = []; this.boxes = [];
  this.portals = []; this.portalCool = {};
  this.blastCharge = 0; this.blastReady = false;
  var n = Date.now();
  for (var i = 0; i < this.pets.length; i++) {
    var pt = this.pets[i];
    if (!pt.mhp) { pt.mhp = petMaxHp(pt); pt.hp = pt.mhp; }
    if (!this.patk[pt.uid]) this.patk[pt.uid] = n;
    if (pt.hi > 0 && !this.ptim[pt.uid]) this.ptim[pt.uid] = n;
    var ang = (i / Math.max(1, this.pets.length)) * Math.PI * 2;
    pt.x = this.p.x + Math.cos(ang) * 60; pt.y = this.p.y + Math.sin(ang) * 45;
    pt.wdx = 0; pt.wdy = 0; pt.wtim = 0; pt.healMode = false; pt.dead = false;
  }
  this.showBanner();
};

Game.prototype.buildVoidPhase = function() {
  var scale = Math.pow(2, this.voidKills || 0);
  this.voidPhase = true;
  this.trans     = false;
  this.bossLasers = [];
  var cx = Math.round(canvas.width * 0.5), cy = Math.round(GT + GH * 0.5);
  var gen = this.voidKills > 0 ? ' (×' + scale + ')' : '';
  this.mons = [
    { t:'Void Stalker',    e:'🌑', hp:Math.round(3000*scale), mhp:Math.round(3000*scale), atk:Math.round(90*scale),  spd:50, gem:0, x:cx-140, y:cy, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isBoss:true, laserTimer:2500 },
    { t:'Shadow Titan',    e:'🌒', hp:Math.round(4500*scale), mhp:Math.round(4500*scale), atk:Math.round(130*scale), spd:35, gem:0, x:cx,     y:cy-90, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isBoss:true, laserTimer:3000 },
    { t:'Cosmic Devourer', e:'🌓', hp:Math.round(6000*scale), mhp:Math.round(6000*scale), atk:Math.round(160*scale), spd:28, gem:0, x:cx+140, y:cy, at:0, pat:0, mt:0, dx:0, dy:0, dead:false, isBoss:true, laserTimer:3500 },
  ];
  this.ld.name = '☠️ THE VOID' + gen + ' — Survive or lose everything!';
  this.fl(this.p.x, this.p.y - 60, '☠️ THE VOID OPENS!', '#cc00ff');
  this.fl(this.p.x, this.p.y - 40, 'Defeat all 3 — or lose!', '#ff6666');
  this.showBanner();
};

Game.prototype.updateBossLasers = function(now) {
  var self = this, p = this.p, LASER_DMG = 50, LASER_PET_DMG = this.bossPetDmg || 10;
  this.bossLasers = this.bossLasers.filter(function(b) {
    if (b.done) return false;
    if (now < b.warnUntil) return true;
    b.done = true;
    if (Math.hypot(p.x - b.tx, p.y - b.ty) < 38) {
      if (p.inv <= 0) {
        p.hp = Math.max(0, p.hp - LASER_DMG); p.inv = 400;
        self.burst(b.tx, b.ty, '#00ffff', 10); self.fl(b.tx, b.ty, '-' + LASER_DMG + '⚡', '#00ffff');
        if (p.hp <= 0 && !self.dead) { self.tryTeamTakeover(); }
      }
    } else { self.burst(b.tx, b.ty, '#0088aa', 5); }
    self.pets.forEach(function(pt) {
      if (pt.dead || pt.x === undefined) return;
      if (Math.hypot(pt.x - b.tx, pt.y - b.ty) < 34) {
        pt.hp = Math.max(0, pt.hp - LASER_PET_DMG);
        self.fl(pt.x, pt.y, '-' + LASER_PET_DMG + '⚡', '#00ffff');
        if (pt.hp <= 0) self.killPet(pt);
      }
    });
    return false;
  });
};

Game.prototype.tile = function(x, y) {
  var c = Math.floor(x/T), r = Math.floor((y-GT)/T);
  if (r<0||r>=this.R||c<0||c>=this.C) return 1;
  if (this.map[r][c]) return 1;
  for (var bi = 0; bi < this.boxes.length; bi++) { if (this.boxes[bi].c === c && this.boxes[bi].r === r) return 1; }
  return 0;
};
Game.prototype.boxAt = function(x, y) {
  var c = Math.floor(x/T), r = Math.floor((y-GT)/T);
  for (var bi = 0; bi < this.boxes.length; bi++) { if (this.boxes[bi].c === c && this.boxes[bi].r === r) return this.boxes[bi]; }
  return null;
};
Game.prototype.tryPushBox = function(box, ddx, ddy) {
  var nc = box.c + (ddx > 0 ? 1 : ddx < 0 ? -1 : 0);
  var nr = box.r + (ddy > 0 ? 1 : ddy < 0 ? -1 : 0);
  if (nc < 1 || nc >= this.C-1 || nr < 1 || nr >= this.R-1) return;
  if (this.map[nr][nc]) return;
  for (var bi = 0; bi < this.boxes.length; bi++) { if (this.boxes[bi].c === nc && this.boxes[bi].r === nr) return; }
  box.c = nc; box.r = nr; box.x = nc*T+T/2; box.y = GT+nr*T+T/2;
};
Game.prototype.mvPlayer = function(p, dx, dy, sp, dt) {
  var h = 14;
  var nx = p.x + dx*sp*dt;
  if (!this.tile(nx, p.y-h) && !this.tile(nx, p.y+h)) {
    p.x = nx;
  } else if (dx !== 0) {
    var bx = this.boxAt(nx, p.y-h) || this.boxAt(nx, p.y+h);
    if (bx) { this.tryPushBox(bx, dx, 0); if (!this.tile(nx, p.y-h) && !this.tile(nx, p.y+h)) p.x = nx; }
  }
  var ny = p.y + dy*sp*dt;
  if (!this.tile(p.x, ny-h) && !this.tile(p.x, ny+h)) {
    p.y = ny;
  } else if (dy !== 0) {
    var by = this.boxAt(p.x, ny-h) || this.boxAt(p.x, ny+h);
    if (by) { this.tryPushBox(by, 0, dy); if (!this.tile(p.x, ny-h) && !this.tile(p.x, ny+h)) p.y = ny; }
  }
  p.x = Math.max(h, Math.min(canvas.width-h, p.x));
  p.y = Math.max(GT+h, Math.min(GT+GH-h, p.y));
};
Game.prototype.mv   = function(e, dx, dy, sp, dt) {
  var nx = e.x + dx*sp*dt, ny = e.y + dy*sp*dt, h = 14;
  if (!this.tile(nx, e.y-h) && !this.tile(nx, e.y+h)) e.x = nx;
  if (!this.tile(e.x, ny-h) && !this.tile(e.x, ny+h)) e.y = ny;
  e.x = Math.max(h, Math.min(canvas.width-h, e.x));
  e.y = Math.max(GT+h, Math.min(GT+GH-h, e.y));
};

Game.prototype.updatePets = function(dt, now) {
  var self = this, p = this.p;
  var alive = this.mons.filter(function(m) { return !m.dead; });

  // Record player trail every 4px so pets can follow the exact same path
  var TRAIL_STEP = 4, STEPS_PER_PET = 7;
  var lastTr = this.petTrail[0];
  if (!lastTr || Math.hypot(p.x - lastTr.x, p.y - lastTr.y) >= TRAIL_STEP) {
    this.petTrail.unshift({x: p.x, y: p.y});
    var maxLen = (this.pets.length + 1) * STEPS_PER_PET + 40;
    if (this.petTrail.length > maxLen) this.petTrail.length = maxLen;
  }


  this.pets.forEach(function(pt) {
    if (pt.dead) return;
    if (pt.x === undefined) {
      var a0 = Math.random()*Math.PI*2;
      pt.x = p.x + Math.cos(a0)*50; pt.y = p.y + Math.sin(a0)*40;
      pt.wdx = 0; pt.wdy = 0; pt.wtim = 0; pt.healMode = false;
    }
    var uid = pt.uid, moved = false;
    var APPROACH = 110, WANDER = 50;

    // Heal approach trigger (only start walking if player actually needs it)
    if (pt.heal > 0 && pt.hi > 0 && !pt.healMode) {
      if (!self.ptim[uid]) self.ptim[uid] = now;
      if (now - self.ptim[uid] >= pt.hi) {
        if (p.hp < p.mhp) { pt.healMode = true; }
        else { self.ptim[uid] = now; }
      }
    }

    // Walk to player and heal on arrival
    if (pt.healMode) {
      var dpx = p.x - pt.x, dpy = p.y - pt.y, dp = Math.hypot(dpx, dpy);
      if (dp > 35) { self.mv(pt, dpx/dp, dpy/dp, APPROACH, dt); moved = true; }
      else {
        p.hp = Math.min(p.mhp, p.hp + pt.heal);
        self.fl(pt.x, pt.y - 15, '+' + pt.heal + '❤', '#30ff70');
        pt.healMode = false; self.ptim[uid] = now;
      }
    }

    // Tank: move between player and nearest threatening monster
    if (!moved && pt.sc > 0) {
      var threats = alive.filter(function(m) { return Math.hypot(m.x-p.x, m.y-p.y) < 120; });
      if (threats.length) {
        var thr = threats.reduce(function(a,b) { return Math.hypot(a.x-p.x,a.y-p.y)<Math.hypot(b.x-p.x,b.y-p.y)?a:b; });
        var tx = (p.x+thr.x)*0.5, ty = (p.y+thr.y)*0.5;
        var dd = Math.hypot(tx-pt.x, ty-pt.y);
        if (dd > 15) { self.mv(pt, (tx-pt.x)/dd, (ty-pt.y)/dd, APPROACH, dt); }
        moved = true;
      }
    }


    // Attack trigger — volcano gives 1 gem when hit by a pet (unlimited HP)
    if (pt.atk > 0 && pt.ar > 0) {
      var vol2 = self.volcano;
      var chstA = (self.chest && !self.chest.open) ? self.chest : null;
      var chstAD = chstA ? Math.hypot(chstA.x-pt.x, chstA.y-pt.y) : Infinity;
      var vol2D = vol2 ? Math.hypot(vol2.x-pt.x, vol2.y-pt.y) : Infinity;
      var hasTarget = alive.length || (chstA && chstAD < 260) || (vol2 && vol2D < 260);
      if (hasTarget) {
        if (!self.patk[uid]) self.patk[uid] = now;
        if (now - self.patk[uid] >= pt.ar) {
          self.patk[uid] = now;
          var fc = pt.id==='dragon'?'#ff7700':pt.id==='god'?'#ffff00':pt.id==='cerberus'?'#ff4400':'#70b0ff';
          var habBonus = (window.META_habitatBonusIds && window.META_habitatBonusIds[pt.id]) ? 20 : 0;
          var ptAtk = pt.atk + habBonus;
          var volPs = vol2 && vol2D >= 260 ? self.portalShot(pt.x, pt.y, vol2.x, vol2.y) : null;
          if (vol2 && vol2D < 260) {
            self.gems += 1; self.score += 10; self.volcanoGems++;
            self.fx.push({x1:pt.x, y1:pt.y, x2:vol2.x, y2:vol2.y, l:200, c:'#ff6600'});
            self.fl(vol2.x, vol2.y-10, '+1💎', '#ffd700');
          } else if (vol2 && volPs) {
            self.gems += 1; self.score += 10; self.volcanoGems++;
            self.fx.push({x1:pt.x, y1:pt.y, x2:volPs.pa.x, y2:volPs.pa.y, l:200, c:volPs.pa.color});
            self.fx.push({x1:volPs.pb.x, y1:volPs.pb.y, x2:vol2.x, y2:vol2.y, l:200, c:'#ff6600'});
            self.fl(vol2.x, vol2.y-10, '+1💎', '#ffd700');
          } else if (alive.length) {
            var tg = alive.reduce(function(a,b) { return Math.hypot(a.x-pt.x,a.y-pt.y)<Math.hypot(b.x-pt.x,b.y-pt.y)?a:b; });
            var tgD = Math.hypot(tg.x-pt.x, tg.y-pt.y);
            if (chstA && chstAD < tgD && chstAD < 260) {
              self.fx.push({x1:pt.x, y1:pt.y, x2:chstA.x, y2:chstA.y, l:200, c:'#ff8800'});
              self.dmgChest(ptAtk);
            } else if (tgD < 260) {
              tg.hp -= ptAtk; self.fx.push({x1:pt.x, y1:pt.y, x2:tg.x, y2:tg.y, l:200, c:fc});
              self.fl(tg.x, tg.y, '-'+ptAtk, '#ffd700'); if (tg.hp <= 0) self.kill(tg);
            } else {
              // Try portal shot at nearest portal-reachable monster
              var psTg = null, psHit = null, psBestD = Infinity;
              alive.forEach(function(m) {
                var ps = self.portalShot(pt.x, pt.y, m.x, m.y);
                if (ps) { var d = Math.hypot(m.x-pt.x, m.y-pt.y); if (d < psBestD) { psBestD = d; psTg = m; psHit = ps; } }
              });
              if (psTg && psHit) {
                psTg.hp -= ptAtk;
                self.fx.push({x1:pt.x, y1:pt.y, x2:psHit.pa.x, y2:psHit.pa.y, l:200, c:psHit.pa.color});
                self.fx.push({x1:psHit.pb.x, y1:psHit.pb.y, x2:psTg.x, y2:psTg.y, l:200, c:psHit.pa.color});
                self.fl(psTg.x, psTg.y, '-'+ptAtk, '#ffd700'); if (psTg.hp <= 0) self.kill(psTg);
              }
            }
          } else if (chstA && chstAD < 260) {
            self.fx.push({x1:pt.x, y1:pt.y, x2:chstA.x, y2:chstA.y, l:200, c:'#ff8800'});
            self.dmgChest(pt.atk);
          }
        }
      }
    }

    // Trail follow: each pet targets its own point on the player's path history
    if (!moved) {
      var pidx = self.pets.indexOf(pt);
      var trailIdx = Math.min((pidx + 1) * STEPS_PER_PET, self.petTrail.length - 1);
      if (trailIdx >= 0) {
        var tgt = self.petTrail[trailIdx];
        var ftx = tgt.x - pt.x, fty = tgt.y - pt.y, ftd = Math.hypot(ftx, fty);
        if (ftd > 2) { self.mv(pt, ftx / ftd, fty / ftd, 260, dt); }
      }
    }
  });
};

Game.prototype.updateTowers = function(dt, now) {
  var self = this;
  var alive = this.mons.filter(function(m) { return !m.dead; });
  var chst = (this.chest && !this.chest.open) ? this.chest : null;
  this.towers.forEach(function(tw) {
    if (tw.dead || tw.atk <= 0 || tw.ar <= 0) return;
    var chstD = chst ? Math.hypot(chst.x - tw.x, chst.y - tw.y) : Infinity;
    if (!alive.length && !(chst && chstD < 260)) return;
    if (!self.towerAtk[tw.uid]) self.towerAtk[tw.uid] = now;
    if (now - self.towerAtk[tw.uid] < tw.ar) return;
    self.towerAtk[tw.uid] = now;
    var best = null, bestD = Infinity;
    alive.forEach(function(m) {
      var d = Math.hypot(m.x - tw.x, m.y - tw.y);
      if (d < 260 && d < bestD) { best = m; bestD = d; }
    });
    if (chst && chstD < 260 && chstD < bestD) {
      self.fx.push({x1:tw.x, y1:tw.y, x2:chst.x, y2:chst.y, l:200, c:'#ff8800'});
      self.dmgChest(tw.atk);
    } else if (best) {
      best.hp -= tw.atk;
      self.fx.push({x1:tw.x, y1:tw.y, x2:best.x, y2:best.y, l:200, c:'#ffaa00'});
      self.fl(best.x, best.y, '-'+tw.atk, '#ffaa00');
      if (best.hp <= 0) self.kill(best);
    }
  });
};



function ptSegDist(px, py, x1, y1, x2, y2) {
  var dx = x2-x1, dy = y2-y1, len2 = dx*dx+dy*dy;
  if (!len2) return Math.hypot(px-x1, py-y1);
  var t = Math.max(0, Math.min(1, ((px-x1)*dx+(py-y1)*dy)/len2));
  return Math.hypot(px-(x1+t*dx), py-(y1+t*dy));
}

Game.prototype.updateVolcano = function(dt, now) {
  if (!this.volcano || this.dead || this.trans) return;
  var self = this, p = this.p, vol = this.volcano;
  var STREAM_W = 13, GROW_MS = 900;

  // Fire a new stream
  this.volcanoCooldown -= dt * 1000;
  if (this.volcanoCooldown <= 0) {
    this.volcanoCooldown = 4500 + Math.random() * 2000;
    this.lavaStreamLen += 100;
    var len   = this.lavaStreamLen;
    var angle = Math.atan2(p.y - vol.y, p.x - vol.x) + (Math.random() - 0.5) * 1.0;
    this.lavaStreams.push({ angle: angle, len: len, born: now });

    // Destroy walls along the stream path immediately
    var steps = Math.ceil(len / (T * 0.4));
    for (var si = 1; si <= steps; si++) {
      var fd = si / steps * len;
      var fx = vol.x + Math.cos(angle) * fd;
      var fy = vol.y + Math.sin(angle) * fd;
      var wr = Math.round((fy - GT) / T), wc = Math.round(fx / T);
      if (wr >= 1 && wr < self.R-1 && wc >= 1 && wc < self.C-1 && self.map[wr][wc]) {
        self.map[wr][wc] = 0; delete self.wallHp[wr+'_'+wc];
        self.burst(fx, fy, '#cc4400', 5);
        self.wallsBroken++;
      }
    }
    // Destroy boxes along stream
    self.boxes = self.boxes.filter(function(bx) {
      if (ptSegDist(bx.x, bx.y, vol.x, vol.y, vol.x+Math.cos(angle)*len, vol.y+Math.sin(angle)*len) < STREAM_W+4) {
        self.burst(bx.x, bx.y, '#cc6600', 6); return false;
      }
      return true;
    });
    self.fl(vol.x, vol.y - 20, '🌋 LAVA STREAM!', '#ff4400');
  }

  // Continuous damage from all active streams
  this.lavaStreams.forEach(function(s) {
    var growFrac = Math.min(1, (now - s.born) / GROW_MS);
    var curLen   = s.len * growFrac;
    if (curLen < 8) return;
    var ex = vol.x + Math.cos(s.angle) * curLen;
    var ey = vol.y + Math.sin(s.angle) * curLen;

    if (p.inv <= 0 && ptSegDist(p.x, p.y, vol.x, vol.y, ex, ey) < STREAM_W) {
      var dmg = Math.round(p.mhp * 0.10);
      p.hp = Math.max(0, p.hp - dmg); p.inv = 420;
      self.burst(p.x, p.y, '#ff4400', 5); self.fl(p.x, p.y, '-'+dmg+'🔥', '#ff4400');
      if (p.hp <= 0 && !self.dead) self.tryTeamTakeover();
    }

    self.pets.forEach(function(pt) {
      if (pt.dead || pt.x === undefined) return;
      if (ptSegDist(pt.x, pt.y, vol.x, vol.y, ex, ey) < STREAM_W) {
        var pdmg = Math.round((pt.mhp || 50) * 0.07);
        if (pdmg > 0) {
          pt.hp = Math.max(0, pt.hp - pdmg);
          if (pt.hp <= 0) self.killPet(pt);
        }
      }
    });

    self.mons.forEach(function(m) {
      if (m.dead || m.reviving) return;
      if (ptSegDist(m.x, m.y, vol.x, vol.y, ex, ey) < STREAM_W) {
        var mdmg = Math.round((m.mhp || m.hp) * 0.05);
        if (mdmg > 0) {
          m.hp = Math.max(0, m.hp - mdmg);
          self.fl(m.x, m.y, '-'+mdmg+'🔥', '#ff6600');
          if (m.hp <= 0) self.kill(m);
        }
      }
    });
  });
};

Game.prototype.checkPairBreeding = function(now) {
  var self = this, counts = {}, INTERVAL = 30000;
  this.pets.forEach(function(pt)  { counts[pt.id]  = (counts[pt.id]  || 0) + 1; });
  this.towers.forEach(function(tw){ counts[tw.id]   = (counts[tw.id]  || 0) + 1; });
  Object.keys(counts).forEach(function(id) {
    if (counts[id] >= 2) {
      if (!self.pairTimers[id]) { self.pairTimers[id] = now; return; }
      if (now - self.pairTimers[id] >= INTERVAL) {
        self.pairTimers[id] = now;
        var def = PETS.find(function(p) { return p.id === id; }) ||
                  self.pets.find(function(p) { return p.id === id; }) ||
                  self.towers.find(function(t) { return t.id === id; });
        var pairs = Math.floor(counts[id] / 2);
        for (var bi = 0; bi < pairs; bi++) { if (def) self.awardBreedPet(def); }
      }
    } else {
      delete self.pairTimers[id];
    }
  });
  Object.keys(this.pairTimers).forEach(function(id) {
    if (!counts[id] || counts[id] < 2) delete self.pairTimers[id];
  });
};

Game.prototype.awardBreedPet = function(def) {
  var instance = {}, k;
  for (k in def) instance[k] = def[k];
  instance.uid = def.id + '_breed_' + Date.now() + '_' + Math.floor(Math.random()*99999);
  var n = Date.now(), p = this.p;
  this.patk[instance.uid] = n;
  if (def.hi > 0) this.ptim[instance.uid] = n;
  var ang = Math.random() * Math.PI * 2;
  instance.x = p.x + Math.cos(ang)*55; instance.y = p.y + Math.sin(ang)*45;
  instance.mhp = petMaxHp(instance); instance.hp = instance.mhp; instance.dead = false;
  instance.wdx = 0; instance.wdy = 0; instance.wtim = 0; instance.healMode = false;
  if (runSpeciesCount(def.id) >= 10) return;
  this.pets.push(instance);
  this.floats.push({x:p.x, y:p.y-50, t:'🧬 '+def.e+' '+def.n+' bred!', c:'#ff80ff', l:2200});
  sndBuyPet();
};

Game.prototype.killPet = function(pt) {
  pt.hp = 0; pt.dead = true;
  this.burst(pt.x, pt.y, '#ff4444', 8);
  this.floats.push({x:pt.x, y:pt.y-30, t:'💀 '+pt.e+' '+pt.n+' fell!', c:'#ff6644', l:2800});
  this.pets = this.pets.filter(function(p) { return p !== pt; });
};

Game.prototype.update = function(dt) {
  if (this.open || this.dead || this.win || this.trans) return;
  var p = this.p, dx = 0, dy = 0, self = this;
  if (keys.ArrowLeft || keys.KeyA) { dx = -1; p.dir = -1; }
  if (keys.ArrowRight || keys.KeyD) { dx =  1; p.dir =  1; }
  if (keys.ArrowUp    || keys.KeyW) dy = -1;
  if (keys.ArrowDown  || keys.KeyS) dy =  1;
  if (dx && dy) { dx *= .707; dy *= .707; }
  this.mvPlayer(p, dx, dy, 185 * (1 + 0.15 * this.upg.speed), dt);
  // Gem chest pickup
  var self2 = this;
  this.gemChests.forEach(function(gc) {
    if (!gc.open && Math.hypot(gc.x - p.x, gc.y - p.y) < 28) {
      gc.open = true;
      self2.gems += gc.gems; self2.score += gc.gems * 10;
      self2.fl(gc.x, gc.y - 10, '+' + gc.gems + '💎', '#ffd700');
      self2.burst(gc.x, gc.y, '#ffd700', 8);
      sndBuyPet();
    }
  });
  // Portal teleport
  var nowPortal = Date.now();
  for (var pti = 0; pti < this.portals.length; pti++) {
    var portal = this.portals[pti];
    if (nowPortal < (this.portalCool[pti] || 0)) continue;
    if (Math.hypot(p.x - portal.x, p.y - portal.y) < 22) {
      if (portal.isReturn) {
        this.portalCool[pti] = nowPortal + 2000;
        this.exitAltMaze(); break;
      }
      if (portal.isRealm) {
        this.portalCool[pti] = nowPortal + 2000;
        this.enterAltMaze(); break;
      }
      if (portal.linkTo < 0) continue;
      var dest = this.portals[portal.linkTo];
      p.x = dest.x; p.y = dest.y;
      this.portalCool[portal.linkTo] = nowPortal + 1500;
      this.burst(dest.x, dest.y, portal.color, 14);
      this.fl(dest.x, dest.y - 22, '🌀 portal!', portal.color);
      break;
    }
  }

  p.at = Math.max(0, p.at - dt*1000);
  if (keys.Space && p.at <= 0) { p.atk = true; p.at = 380; this.aa = 280; this.doAtk(); }
  if (p.at <= 0) p.atk = false;
  this.aa = Math.max(0, this.aa - dt*1000);
  if (p.inv > 0) p.inv -= dt*1000;

  var nowMon = Date.now();
  this.mons.forEach(function(m) {
    if (m.dead) return;
    var mSpd = m.spd;
    if (self.slowUntil && nowMon < self.slowUntil) mSpd = Math.round(mSpd * 0.30);
    // Boss-specific logic
    if (m.isBoss) {
      m.mt -= dt*1000;
      if (m.mt <= 0) {
        var ba = Math.atan2(p.y - m.y, p.x - m.x) + (Math.random()-0.5)*0.4;
        m.dx = Math.cos(ba); m.dy = Math.sin(ba); m.mt = 600 + Math.random()*800;
      }
      self.mv(m, m.dx, m.dy, mSpd, dt);
      if (Math.hypot(m.x - p.x, m.y - p.y) < 44) {
        m.at -= dt*1000;
        if (m.at <= 0) {
          m.at = 1800;
          var mAtk = self.weakenUntil && nowMon < self.weakenUntil ? Math.round(m.atk * 0.5) : m.atk;
          if (p.inv <= 0) { p.hp = Math.max(0, p.hp - mAtk); p.inv = 400; self.burst(p.x, p.y, '#ff3333', 8); self.fl(p.x, p.y, '-'+mAtk, '#ff4444'); if (p.hp <= 0 && !self.dead) { self.tryTeamTakeover(); } }
        }
      }
      m.pat -= dt*1000;
      if (m.pat <= 0) {
        var nearBP = null, nearBPD = 44;
        self.pets.forEach(function(pet) { if (!pet.dead && pet.x !== undefined) { var d = Math.hypot(m.x-pet.x, m.y-pet.y); if (d < nearBPD) { nearBP = pet; nearBPD = d; } } });
        if (nearBP) { m.pat = 1400; var mAtkP = self.bossPetDmg || 10; nearBP.hp = Math.max(0, nearBP.hp - mAtkP); self.fl(nearBP.x, nearBP.y-8, '-'+mAtkP, '#ff6644'); if (nearBP.hp <= 0) self.killPet(nearBP); }
      }
      // Fire lasers
      m.laserTimer = (m.laserTimer || 3000) - dt*1000;
      if (m.laserTimer <= 0) {
        m.laserTimer = 1800 + Math.random()*2000;
        var targets = [p];
        self.pets.forEach(function(pt) { if (!pt.dead && pt.x !== undefined) targets.push(pt); });
        var tgt = targets[Math.floor(Math.random()*targets.length)];
        self.bossLasers.push({ bx:m.x, by:m.y, tx:tgt.x+(Math.random()-0.5)*30, ty:tgt.y+(Math.random()-0.5)*30, warnUntil:nowMon+900, done:false });
      }
      return;
    }
    // Normal monster logic
    m.mt -= dt*1000;
    if (m.mt <= 0) {
      var a = Math.atan2(p.y - m.y, p.x - m.x) + (Math.random() - .5) * 0.5;
      m.dx = Math.cos(a); m.dy = Math.sin(a); m.mt = 180 + Math.random() * 280;
    }
    self.mv(m, m.dx, m.dy, mSpd, dt);
    if (Math.hypot(m.x - p.x, m.y - p.y) < 32) {
      m.at -= dt*1000;
      if (m.at <= 0) {
        m.at = Math.max(550, 1050 - self.lv * 14);
        if (p.inv <= 0) {
          var hitBlocked = false;
          for (var si = 0; si < self.pets.length; si++) {
            var shp = self.pets[si];
            if (!shp.dead && shp.sc > 0 && shp.x !== undefined && Math.hypot(shp.x-m.x, shp.y-m.y) < 90 && Math.random() < shp.sc) { hitBlocked = true; break; }
          }
          if (hitBlocked) { self.fl(p.x, p.y, 'BLOCKED!', '#40d8ff'); return; }
          var mDmg = self.weakenUntil && nowMon < self.weakenUntil ? Math.round(m.atk * 0.5) : m.atk;
          p.hp = Math.max(0, p.hp - mDmg); p.inv = 350;
          self.burst(p.x, p.y, '#ff3333', 6); self.fl(p.x, p.y, '-' + mDmg, '#ff4444');
          if (p.hp <= 0 && !self.dead) { self.tryTeamTakeover(); }
        }
      }
    }
    // Attack nearby pets/towers
    m.pat -= dt * 1000;
    if (m.pat <= 0) {
      var nearPet = null, nearPetD = 32;
      self.pets.forEach(function(pet) {
        if (pet.dead || pet.x === undefined) return;
        var d = Math.hypot(m.x - pet.x, m.y - pet.y);
        if (d < nearPetD) { nearPet = pet; nearPetD = d; }
      });
      self.towers.forEach(function(tw) {
        if (tw.dead) return;
        var d = Math.hypot(m.x - tw.x, m.y - tw.y);
        if (d < nearPetD) { nearPet = tw; nearPetD = d; }
      });
      if (nearPet) {
        m.pat = Math.max(700, 1200 - self.lv * 12);
        var nDmg = self.weakenUntil && nowMon < self.weakenUntil ? Math.round(m.atk * 0.5) : m.atk;
        nearPet.hp = Math.max(0, nearPet.hp - nDmg);
        self.fl(nearPet.x, nearPet.y - 8, '-' + nDmg, '#ff6644');
        if (nearPet.hp <= 0) self.killPet(nearPet);
      }
    }
    // Monster portal teleportation
    if (!m.dead && self.portals.length > 1) {
      var mNow = Date.now();
      if (!m.portalCoolUntil || mNow >= m.portalCoolUntil) {
        for (var mpi = 0; mpi < self.portals.length; mpi++) {
          var mp = self.portals[mpi];
          if (mp.linkTo < 0 || mp.isReturn) continue;
          if (Math.hypot(m.x - mp.x, m.y - mp.y) < 22) {
            var mdest = self.portals[mp.linkTo];
            m.x = mdest.x; m.y = mdest.y;
            m.portalCoolUntil = mNow + 2000;
            self.burst(mdest.x, mdest.y, mp.color, 8);
            break;
          }
        }
      }
    }
  });

  if (this.upg.potion > 0) {
    this.potionTick += dt;
    if (this.potionTick >= 20) { this.potionTick -= 20; p.hp = Math.min(p.mhp, p.hp + 10 * this.upg.potion); }
  }

  // Team healer characters (blast:'heal'): heal pets, active player, and all teammates (revive dead ones)
  var nowH = Date.now();
  for (var _ti = 0; _ti < this.team.length; _ti++) {
    var _tChar = this.team[_ti];
    if (!_tChar || _tChar.blast !== 'heal') continue;
    if (this.teamDeadThisRun[_ti]) continue;
    var _tPow = _tChar.blastPow || 1;
    var _tHi  = Math.max(2500, Math.round(7000 - _tPow * 600));
    var _hAmt = Math.round(_tPow * 8);
    if (!this.teamHealTim[_ti]) this.teamHealTim[_ti] = nowH;
    if (nowH - this.teamHealTim[_ti] < _tHi) continue;
    this.teamHealTim[_ti] = nowH;
    // Heal active player
    p.hp = Math.min(p.mhp, p.hp + _hAmt);
    this.fl(p.x, p.y - 22, '+' + _hAmt + '❤️ ' + _tChar.e, '#30ff70');
    // Heal all pets
    var _self = this;
    this.pts.forEach(function(pt) {
      if (pt.dead || !pt.mhp) return;
      pt.hp = Math.min(pt.mhp, pt.hp + _hAmt);
      _self.fl(pt.x, pt.y - 15, '+' + _hAmt + '❤', '#30ff70');
    });
    // Heal or revive all other team members
    for (var _tj = 0; _tj < this.team.length; _tj++) {
      if (_tj === this.teamIdx) continue;
      if (this.teamDeadThisRun[_tj]) {
        this.teamDeadThisRun[_tj] = false;
        this.teamHp[_tj] = Math.max(1, Math.floor(p.mhp * 0.3));
        this.fl(p.x, p.y - 40, '✨ ' + this.team[_tj].e + ' Revived!', '#ffff44');
      } else {
        this.teamHp[_tj] = Math.min(p.mhp, this.teamHp[_tj] + _hAmt);
      }
    }
  }

  // Strong healer characters (blastPow >= 4.5): self-heal +20hp every 100s
  for (var _si = 0; _si < this.team.length; _si++) {
    var _sC = this.team[_si];
    if (!_sC || _sC.blast !== 'heal' || (_sC.blastPow || 0) < 4.5) continue;
    if (this.teamDeadThisRun[_si]) continue;
    if (!this.teamSelfHealTim[_si]) this.teamSelfHealTim[_si] = nowH;
    if (nowH - this.teamSelfHealTim[_si] < 100000) continue;
    this.teamSelfHealTim[_si] = nowH;
    if (_si === this.teamIdx) {
      p.hp = Math.min(p.mhp, p.hp + 20);
      this.fl(p.x, p.y - 18, '+20❤ ' + _sC.e, '#88ffaa');
    } else {
      this.teamHp[_si] = Math.min(p.mhp, this.teamHp[_si] + 20);
    }
  }

  var now = Date.now();
  this.updatePets(dt, now);
  this.updateTowers(dt, now);
  if (this.isBossRun) { this.updateBossLasers(now); } else { this.updateVolcano(dt, now); }
  this.checkPairBreeding(now);

  this.parts  = this.parts.filter(function(pt) { pt.x += pt.vx*.016; pt.y += pt.vy*.016; pt.l -= dt*1000; return pt.l > 0; });
  this.floats = this.floats.filter(function(f)  { f.y -= dt*42; f.l -= dt*1000; return f.l > 0; });
  this.fx     = this.fx.filter(function(f)      { f.l -= dt*1000; return f.l > 0; });
  // Process guardian revivals
  var now2 = Date.now();
  this.mons.forEach(function(m) {
    if (!m.reviving) return;
    if (now2 < m.reviveAt) return;
    m.reviving = false;
    var guard = m.reviveGuardRef;
    if (guard && !guard.dead) {
      m.x = guard.x + (Math.random()-0.5)*30;
      m.y = guard.y + (Math.random()-0.5)*30;
      m.hp = m.mhp; m.dead = false; m.at = 0; m.pat = 0;
    }
    m.reviveGuardRef = null;
  });
  this.mons = this.mons.filter(function(m) { return !m.dead || m.reviving; });

  // Moving walls (level 25+)
  if (this.lv >= 24 && !this.isBossRun) {
    this.wallMoveTimer -= dt * 1000;
    if (this.wallMoveTimer <= 0) { this.wallMoveTimer = 10000; this.moveWalls(); }
  }

  var chestDone = !this.chest || this.chest.open || this.alreadyOwned;
  var monsAlive = this.mons.filter(function(m) { return !m.dead && !m.reviving; }).length;
  if (this.isBossRun) {
    if (monsAlive === 0 && !this.trans) {
      this.trans = true;
      if (this.voidPhase) { if (window.META_onVoidWin) window.META_onVoidWin(); }
      else { if (window.META_onBossWin) window.META_onBossWin(); }
    }
  } else if (monsAlive === 0 && chestDone && !this.trans) {
    this.trans = true;
    if (Math.random() < Math.min(0.80, 0.20 + 0.08 * this.upg.petluck)) this.awardFreePet(this.lv);
    this.lv++; this.showBanner(); sndLevelUp();
    var s2 = this; setTimeout(function() { s2.build(); s2.trans = false; }, 1800);
  }
  this.hud();
};

Game.prototype.dmgChest = function(dmg) {
  if (!this.chest || this.chest.open) return;
  this.chest.hp = Math.max(0, this.chest.hp - dmg);
  this.fl(this.chest.x, this.chest.y - 22, '-' + dmg, '#ff8800');
  if (this.chest.hp <= 0) this.openChest();
};

Game.prototype.doBlast = function() {
  if (!this.blastReady) return;
  this.blastReady = false; this.blastCharge = 0;
  var p = this.p, self = this, cd = this.charDef, now = Date.now();
  sndLevelUp();
  this.burst(p.x, p.y, '#ffff00', 30);
  this.fl(p.x, p.y - 30, '💥 BLAST!', '#ffff00');
  if (!cd) return;
  if (cd.blast === 'damage') {
    var bdmg = Math.round((this.weaponDmg || 20) * (this.weaponLevel || 1) * cd.blastPow * 5 + (cd.atkBonus || 0) * 3);
    this.mons.forEach(function(m) {
      if (m.dead) return;
      m.hp -= bdmg;
      self.fl(m.x, m.y, '-' + bdmg + '💥', '#ffff00');
      self.burst(m.x, m.y, '#ffff00', 6);
      if (m.hp <= 0) self.kill(m);
    });
  } else if (cd.blast === 'slow') {
    this.slowUntil = now + Math.round(5000 * cd.blastPow);
    this.fl(p.x, p.y - 40, '❄️ All slowed!', '#88ddff');
    this.mons.forEach(function(m) { if (!m.dead) self.burst(m.x, m.y, '#88ddff', 5); });
  } else if (cd.blast === 'weaken') {
    this.weakenUntil = now + Math.round(8000 * cd.blastPow);
    this.fl(p.x, p.y - 40, '⬇️ All weakened!', '#cc88ff');
    this.mons.forEach(function(m) { if (!m.dead) self.burst(m.x, m.y, '#cc88ff', 5); });
  } else if (cd.blast === 'heal') {
    var healAmt = Math.round(p.mhp * Math.min(1, cd.blastPow * 0.5));
    p.hp = Math.min(p.mhp, p.hp + healAmt);
    this.fl(p.x, p.y - 20, '+' + healAmt + '❤️ Heal!', '#44ff88');
    this.burst(p.x, p.y, '#44ff88', 20);
    this.pets.forEach(function(pt) {
      if (pt.dead || !pt.mhp) return;
      pt.hp = pt.mhp;
      self.fl(pt.x, pt.y - 8, '❤️', '#44ff88');
    });
  } else if (cd.blast === 'dig') {
    var gems = Math.round(cd.blastPow * 12);
    this.gems += gems; this.score += gems * 10;
    this.digRubies += Math.round(cd.blastPow);
    this.fl(p.x, p.y - 30, '+' + gems + '💎 Dig!', '#ffd700');
    this.burst(p.x, p.y, '#ffd700', 20);
  }
};

Game.prototype.initTeam = function(config) {
  var teamIds = config && config.team && config.team.length ? config.team : [config && config.character || 'brownbear'];
  var allChars = (window.CHARACTERS || []).concat(window.CHEST_CHARS || []);
  this.team = teamIds.map(function(id) {
    for (var ci = 0; ci < allChars.length; ci++) if (allChars[ci].id === id) return allChars[ci];
    return null;
  }).filter(Boolean);
  if (!this.team.length && allChars[0]) this.team = [allChars[0]];
  this.teamIdx = 0;
  var startHp = this.p.mhp;
  this.teamHp           = this.team.map(function() { return startHp; });
  this.teamBlastCharge  = this.team.map(function() { return 0; });
  this.teamBlastReady   = this.team.map(function() { return false; });
  this.teamDeadThisRun  = this.team.map(function() { return false; });
  this.teamRunKills     = this.team.map(function() { return 0; });
  this.teamHealTim      = this.team.map(function() { return 0; });
  this.teamSelfHealTim  = this.team.map(function() { return 0; });
  this.charKillsData    = (config && config.charKills) || {};
  this.charDef          = this.team[0] || null;
  this.p.hp             = this.teamHp[0];
};

Game.prototype.switchChar = function(idx) {
  if (idx < 0 || idx >= this.team.length || idx === this.teamIdx || this.teamDeadThisRun[idx]) return;
  this.teamHp[this.teamIdx]          = this.p.hp;
  this.teamBlastCharge[this.teamIdx] = this.blastCharge;
  this.teamBlastReady[this.teamIdx]  = this.blastReady;
  this.teamIdx    = idx;
  this.charDef    = this.team[idx] || null;
  this.p.hp       = this.teamHp[idx];
  this.blastCharge= this.teamBlastCharge[idx];
  this.blastReady = this.teamBlastReady[idx];
  if (this.charDef) this.fl(this.p.x, this.p.y - 30, '🔄 ' + this.charDef.e + ' ' + this.charDef.n, '#a0d0ff');
};

Game.prototype.tryTeamTakeover = function() {
  var prev = this.team[this.teamIdx];
  this.teamDeadThisRun[this.teamIdx] = true;
  this.teamHp[this.teamIdx] = 0;
  var alive = [];
  for (var i = 0; i < this.team.length; i++) { if (!this.teamDeadThisRun[i]) alive.push(i); }
  if (alive.length === 0) { this.dead = true; this.showDead(); return; }
  var next = alive[Math.floor(Math.random() * alive.length)];
  this.teamIdx    = next;
  this.charDef    = this.team[next] || null;
  this.p.hp       = this.teamHp[next];
  this.blastCharge= this.teamBlastCharge[next];
  this.blastReady = this.teamBlastReady[next];
  var prevName = prev ? prev.e + ' ' + prev.n : 'Character';
  var nextName = this.charDef ? this.charDef.e + ' ' + this.charDef.n : 'Teammate';
  this.fl(this.p.x, this.p.y - 28, '💀 ' + prevName + ' fell!', '#ff4444');
  this.fl(this.p.x, this.p.y - 50, nextName + ' takes over!', '#ffaa00');
};

Game.prototype.doAtk = function() {
  if (this.blastReady) { this.doBlast(); return; }
  var p     = this.p;
  var wdmg  = (this.weaponDmg  || 20) * (this.weaponLevel || 1);
  var range = this.weaponRange || 68;
  var dmg   = wdmg + this.lv + 8 * this.upg.attack + (this.charDef ? this.charDef.atkBonus : 0) + (this.foodAtk || 0);
  var self  = this;
  var atkColor = this.weaponColor || '#fff';
  var hitCount = 0;
  this.mons.forEach(function(m) {
    if (m.dead || Math.hypot(m.x-p.x, m.y-p.y) > range) return;
    m.hp -= dmg; hitCount++;
    self.fx.push({x1:p.x, y1:p.y, x2:m.x, y2:m.y, l:180, c:atkColor});
    self.fl(m.x, m.y, '-' + dmg, atkColor);
    if (m.hp <= 0) self.kill(m);
  });
  if (this.chest && !this.chest.open && Math.hypot(this.chest.x-p.x, this.chest.y-p.y) < range) {
    this.dmgChest(dmg); hitCount++;
    this.fx.push({x1:p.x, y1:p.y, x2:this.chest.x, y2:this.chest.y, l:180, c:'#ff8800'});
  }
  if (hitCount > 0 && this.charDef) {
    var _cid = this.charDef.id;
    var _totalKills = (this.charKillsData[_cid] || 0) + (this.teamRunKills[this.teamIdx] || 0);
    if (_totalKills >= 100) {
      this.blastCharge += hitCount;
      if (this.blastCharge >= 100) {
        this.blastReady = true; this.blastCharge = 100;
        this.fl(p.x, p.y - 30, '💥 BLAST READY! (press SPACE)', '#ffff00');
      }
    }
  }
  // Destroy boxes in range
  this.boxes = this.boxes.filter(function(b) {
    if (Math.hypot(b.x - p.x, b.y - p.y) < range) {
      self.burst(b.x, b.y, '#cc8800', 8);
      self.fx.push({x1:p.x, y1:p.y, x2:b.x, y2:b.y, l:180, c:atkColor});
      return false;
    }
    return true;
  });
  // Damage wall tiles in range (not border walls); walls have 1000 HP
  var wallRange = range * 0.75;
  for (var wr = 1; wr < this.R - 1; wr++) {
    for (var wc = 1; wc < this.C - 1; wc++) {
      if (!this.map[wr][wc]) continue;
      var wx = wc * T + T/2, wy = GT + wr * T + T/2;
      if (Math.hypot(wx - p.x, wy - p.y) < wallRange) {
        var wk = wr + '_' + wc;
        if (this.wallHp[wk] === undefined) this.wallHp[wk] = 1000;
        this.wallHp[wk] -= dmg;
        if (this.wallHp[wk] <= 0) {
          this.map[wr][wc] = 0; this.wallsBroken++;
          delete this.wallHp[wk];
          this.burst(wx, wy, '#886644', 5);
          p.hp = Math.max(1, p.hp - 20);
          this.fl(p.x, p.y - 20, '-20 HP (wall)', '#ff6666');
        } else {
          this.fl(wx, wy - 10, '' + this.wallHp[wk], '#cc9966');
        }
      }
    }
  }
  this.burst(p.x + p.dir*26, p.y, atkColor, 3);
};

Game.prototype.kill  = function(m) {
  if (m.dead) return;
  // Mega monster is unkillable while any other monster is still alive
  if (m.isMega) {
    var othersAlive = this.mons.some(function(o) { return o !== m && !o.dead && !o.reviving; });
    if (othersAlive) {
      m.hp = Math.ceil(m.mhp * 0.08); // bounce back
      this.fl(m.x, m.y - 18, '🔒 Kill all first!', '#ff4444');
      return;
    }
  }
  m.dead = true; this.monstersKilled++;
  if (this.team.length > 0) this.teamRunKills[this.teamIdx] = (this.teamRunKills[this.teamIdx] || 0) + 1;
  this.gems += m.gem; this.score += m.gem*10;
  this.burst(m.x, m.y, '#ffd700', 10); this.fl(m.x, m.y, '+' + m.gem + '💎', '#ffd700'); sndKill();
  var _p = this.p;
  this.pets.forEach(function(pt) { pt.x = _p.x; pt.y = _p.y; });
  this.petTrail = [];
  if (m.isGuardian && this.chest && !this.chest.open) {
    this.floats.push({x:this.chest.x, y:this.chest.y-35, t:'⚔️ Attack the chest!', c:'#ff8800', l:3500});
  } else if (!m.isGuardian && !m.isGuard) {
    var liveGuards = [];
    for (var gi = 0; gi < this.mons.length; gi++) {
      if (this.mons[gi].isGuard && !this.mons[gi].dead && !this.mons[gi].reviving) liveGuards.push(this.mons[gi]);
    }
    if (liveGuards.length) {
      var pickedGuard = liveGuards[Math.floor(Math.random() * liveGuards.length)];
      m.reviving = true; m.reviveAt = Date.now() + 3500; m.reviveGuardRef = pickedGuard;
    }
  }
};
Game.prototype.burst = function(x, y, c, n) { for (var i = 0; i < n; i++) { var a = Math.random()*Math.PI*2, s = 40+Math.random()*80; this.parts.push({x:x, y:y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, c:c, l:350+Math.random()*280, sz:2+Math.random()*2.5}); } };
Game.prototype.fl    = function(x, y, t, c) { this.floats.push({x:x, y:y, t:t, c:c, l:750}); };

Game.prototype.awardFreePet = function(lv) {
  var sorted = PETS.slice().sort(function(a,b){ return a.cost - b.cost; });
  var idx = Math.round(((lv % 50) / 49) * (sorted.length - 1));
  var lo = Math.max(0, idx - 1), hi = Math.min(sorted.length - 1, idx + 1);
  var chosen = sorted[lo + Math.floor(Math.random() * (hi - lo + 1))];
  var instance = {}, k;
  for (k in chosen) instance[k] = chosen[k];
  instance.uid = chosen.id + '_free_' + Date.now() + '_' + Math.floor(Math.random()*99999);
  var n = Date.now(), p = this.p;
  this.patk[instance.uid] = n;
  if (chosen.hi > 0) this.ptim[instance.uid] = n;
  var ang = Math.random() * Math.PI * 2;
  instance.x = p.x + Math.cos(ang) * 50; instance.y = p.y + Math.sin(ang) * 40;
  instance.mhp = petMaxHp(instance); instance.hp = instance.mhp; instance.dead = false;
  instance.wdx = 0; instance.wdy = 0; instance.wtim = 0; instance.healMode = false;
  if (runSpeciesCount(chosen.id) >= 10) { this.floats.push({x:p.x, y:p.y-45, t:'⛔ ' + chosen.e + ' full! (10/10)', c:'#ff6666', l:2200}); return; }
  this.pets.push(instance);
  this.floats.push({x:p.x, y:p.y - 45, t:'🎁 ' + chosen.e + ' ' + chosen.n + ' joins!', c:'#ffd700', l:2200});
};

Game.prototype.openChest = function() {
  this.chest.open = true;
  var pet = this.chestPet, p = this.p, self = this;
  var instance = {}, k;
  for (k in pet) instance[k] = pet[k];
  instance.uid = pet.id + '_' + Date.now();
  var n = Date.now();
  this.patk[instance.uid] = n;
  if (pet.hi > 0) this.ptim[instance.uid] = n;
  var ang = Math.random() * Math.PI * 2;
  instance.x = p.x + Math.cos(ang)*50; instance.y = p.y + Math.sin(ang)*40;
  instance.mhp = petMaxHp(instance); instance.hp = instance.mhp; instance.dead = false;
  instance.wdx = 0; instance.wdy = 0; instance.wtim = 0; instance.healMode = false;
  this.pets.push(instance);
  this.burst(this.chest.x, this.chest.y, '#ffd700', 25);
  this.burst(p.x, p.y, '#ffffff', 8);
  this.floats.push({x:this.chest.x, y:this.chest.y-45, t:'✨ '+pet.e+' '+pet.n+'!', c:'#ffd700', l:2800});
  sndLevelUp();
};

Game.prototype.showBanner = function() {
  var el = document.getElementById('banner');
  el.textContent = this.inAltMaze ? '🌍 Alt Realm — Level ' + (this.lv + 1) : (this.ld ? this.ld.name : 'Level ' + (this.lv + 1));
  el.style.opacity = '1';
  setTimeout(function() { el.style.opacity = '0'; }, 1600);
};
Game.prototype.showDead = function() {
  if (this.isBossRun) {
    var ot = document.querySelector('#gov .otitle'); if (ot) ot.textContent = '💀 THE BOSS WON!';
    document.getElementById('glvl').textContent  = '🌠 Boss';
  } else {
    var ot2 = document.querySelector('#gov .otitle'); if (ot2) ot2.textContent = '💀 YOU DIED';
    document.getElementById('glvl').textContent  = (this.lv + 1);
  }
  document.getElementById('ggems').textContent = this.gems;
  document.getElementById('gov').style.display = 'flex';
};

Game.prototype.hud = function() {
  var p = this.p;
  var hpPct   = p.hp / p.mhp;
  var hpColor = hpPct > 0.5 ? '#44dd44' : hpPct > 0.25 ? '#e8aa20' : '#ff3333';
  document.getElementById('hpfill').style.width      = (hpPct * 100) + '%';
  document.getElementById('hpfill').style.background = hpColor;
  document.getElementById('ltxt').textContent = this.isBossRun ? '🌠 Boss' : (this.lv + 1);
  document.getElementById('ztxt').textContent = this.ld ? this.ld.zone.flag + ' ' + this.ld.zone.n : '-';
  document.getElementById('gtxt').textContent = this.gems + '💎';
  document.getElementById('stxt').textContent = this.score;
  document.getElementById('etxt').textContent = this.mons.filter(function(m) { return !m.dead || m.reviving; }).length;
  var blastEl = document.getElementById('blasttxt');
  if (blastEl) {
    if (this.blastReady) { blastEl.textContent = '💥 READY!'; blastEl.style.color = '#ffff00'; }
    else if (this.charDef) { blastEl.textContent = (this.blastCharge || 0) + '/100'; blastEl.style.color = '#80c0ff'; }
    else { blastEl.textContent = '—'; blastEl.style.color = '#504060'; }
  }

  var teambarEl = document.getElementById('teambar');
  if (teambarEl && this.team.length > 0) {
    var self = this;
    teambarEl.innerHTML = this.team.map(function(c, i) {
      if (!c) return '';
      var isActive = i === self.teamIdx;
      var isDead   = self.teamDeadThisRun[i];
      var hp       = isActive ? self.p.hp : self.teamHp[i];
      var hpPct2   = Math.max(0, hp / self.p.mhp);
      var cid      = c.id;
      var totalK   = (self.charKillsData[cid] || 0) + (self.teamRunKills[i] || 0);
      var blastOk  = totalK >= 100;
      var bCh      = isActive ? self.blastCharge : self.teamBlastCharge[i];
      var bRdy     = isActive ? self.blastReady  : self.teamBlastReady[i];
      var cls      = 'team-portrait' + (isActive ? ' team-active' : '') + (isDead ? ' team-dead' : '');
      var click    = (!isDead && !isActive) ? ' onclick="G&&G.switchChar(' + i + ')"' : '';
      var blastTxt = blastOk ? (bRdy ? '💥' : bCh + '/100') : (totalK + '/100💀');
      var blastCls = 'tp-blast' + (blastOk ? '' : ' tp-locked');
      return '<div class="' + cls + '"' + click + ' title="' + c.n + (isDead ? ' — DEAD' : '') + '">' +
        '<div class="tp-emoji">' + c.e + '</div>' +
        '<div class="tp-name">' + c.n + '</div>' +
        '<div class="tp-hp"><div class="tp-hpfill" style="width:' + Math.round(hpPct2*100) + '%"></div></div>' +
        '<div class="' + blastCls + '">' + blastTxt + '</div>' +
        '</div>';
    }).join('');
  }

  var petCounts = {}, petOrder = [];
  this.pets.forEach(function(pt) {
    if (!petCounts[pt.id]) { petCounts[pt.id] = {pt: pt, pets: 0, twr: 0, dead: 0}; petOrder.push(pt.id); }
    if (pt.dead) petCounts[pt.id].dead++; else petCounts[pt.id].pets++;
  });
  this.towers.forEach(function(tw) {
    if (!petCounts[tw.id]) { petCounts[tw.id] = {pt: tw, pets: 0, twr: 0, dead: 0}; petOrder.push(tw.id); }
    if (tw.dead) petCounts[tw.id].dead++; else petCounts[tw.id].twr++;
  });
  document.getElementById('petbar').innerHTML = petOrder.map(function(id) {
    var entry = petCounts[id], alive = entry.pets + entry.twr, total = alive + entry.dead;
    var badge = total > 1 ? '<span class="pcnt">' + total + '</span>' : '';
    var twrBadge = entry.twr > 0 ? '<span class="ptwr">🗼</span>' : '';
    var deadBadge = entry.dead > 0 && alive === 0 ? '<span class="pdead">💀</span>' : '';
    var dim = alive === 0 && entry.dead > 0 ? ' style="opacity:0.38"' : '';
    return '<div class="pi"' + dim + ' title="' + entry.pt.n + (total > 1 ? ' x'+total : '') + (entry.dead > 0 ? ' ('+entry.dead+' dead)' : '') + '">' + entry.pt.e + badge + twrBadge + deadBadge + '</div>';
  }).join('');

  var mapStart = Math.max(0, G.lv - 8);
  document.getElementById('lvlmap').textContent = '[' + Array.from({length: 17}, function(_, i) {
    var l = mapStart + i;
    return l < G.lv ? '■' : l === G.lv ? '◆' : '□';
  }).join('') + ']';
};

Game.prototype.draw = function() {
  if (!this.map) return;
  var z = this.ld.zone, r, c, x, y;
  ctx.fillStyle = z.b; ctx.fillRect(0, GT, canvas.width, GH);
  for (r = 0; r < this.R; r++) for (c = 0; c < this.C; c++) {
    x = c*T; y = GT + r*T;
    if (this.map[r][c]) {
      ctx.fillStyle = z.w; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = 'rgba(255,255,255,.20)'; ctx.fillRect(x, y, T, 2);
      ctx.fillStyle = 'rgba(0,0,0,.28)';       ctx.fillRect(x, y+T-2, T, 2);
    } else {
      ctx.fillStyle = z.f; ctx.fillRect(x, y, T, T);
      if ((r+c) % 2 === 0) { ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(x, y, T, T); }
    }
  }

  // Country flag watermark in the centre of the play area
  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.font = '96px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(z.flag, canvas.width / 2, GT + GH / 2);
  ctx.globalAlpha = 0.55;
  ctx.font = 'bold 15px Courier New';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(z.n, canvas.width / 2, GT + GH / 2 + 62);
  ctx.restore();

  this.fx.forEach(function(f) {
    ctx.globalAlpha = f.l / 200; ctx.strokeStyle = f.c; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(f.x1, f.y1); ctx.lineTo(f.x2, f.y2); ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Draw chest (below monsters so it's always visible)
  if (this.chest && !this.chest.open) {
    ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('📦', this.chest.x, this.chest.y);
    // HP bar
    var cbw = 44, cbx = this.chest.x - cbw/2, cby = this.chest.y - 30;
    ctx.fillStyle = '#500'; ctx.fillRect(cbx, cby, cbw, 5);
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(cbx, cby, cbw * (this.chest.hp / this.chest.mhp), 5);
    var guardAlive = this.mons.some(function(m) { return m.isGuardian; });
    if (!guardAlive) {
      var pulse = 0.5 + 0.5 * Math.sin(Date.now() / 220);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(this.chest.x, this.chest.y, 22, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Draw boxes — Pac-Man maze block style
  this.boxes.forEach(function(b) {
    var bx = b.x - T/2, by = b.y - T/2, bw = T, bh = T;
    // Dark navy fill
    ctx.fillStyle = '#00004a';
    ctx.fillRect(bx, by, bw, bh);
    // Bright blue border (thick, Pac-Man wall look)
    ctx.strokeStyle = '#3355ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(bx + 2, by + 2, bw - 4, bh - 4);
    // Inner lighter blue highlight (top-left corner glow)
    ctx.strokeStyle = '#6699ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + bh - 6);
    ctx.lineTo(bx + 6, by + 6);
    ctx.lineTo(bx + bw - 6, by + 6);
    ctx.stroke();
  });

  // Draw portals
  var nowDraw = Date.now();
  this.portals.forEach(function(portal, idx) {
    var pulse = 0.5 + 0.5 * Math.sin(nowDraw / 260 + idx * 1.8);
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.25 * pulse;
    ctx.fillStyle = portal.color;
    ctx.beginPath(); ctx.arc(portal.x, portal.y, 14 + pulse * 5, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.8 + 0.2 * pulse;
    ctx.strokeStyle = portal.color; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(portal.x, portal.y, 18 + pulse * 4, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(portal.isRealm || portal.isReturn ? '🌍' : '🌀', portal.x, portal.y);
    ctx.restore();
  });

  // Wall-shift warning (level 25+)
  if (this.lv >= 24 && !this.isBossRun && this.wallMoveTimer < 2500) {
    var wfrac = 1 - this.wallMoveTimer / 2500;
    ctx.save();
    ctx.globalAlpha = 0.25 + 0.65 * wfrac;
    ctx.fillStyle = '#ccccff';
    ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('⚡ WALLS SHIFTING!', canvas.width / 2, GT + 38);
    ctx.restore();
  }

  // Draw volcano
  if (this.volcano) {
    var vol = this.volcano;
    ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🌋', vol.x, vol.y);
    var pulse2 = 0.3 + 0.3 * Math.sin(Date.now() / 300);
    ctx.globalAlpha = pulse2;
    ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(vol.x, vol.y, 24, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // Draw lava streams (persistent)
  if (this.lavaStreams.length && this.volcano) {
    var nowDraw2 = Date.now(), vol2d = this.volcano;
    ctx.save(); ctx.lineCap = 'round';
    this.lavaStreams.forEach(function(s) {
      var growFrac = Math.min(1, (nowDraw2 - s.born) / 900);
      var drawLen  = s.len * growFrac;
      if (drawLen < 2) return;
      var ex = vol2d.x + Math.cos(s.angle) * drawLen;
      var ey = vol2d.y + Math.sin(s.angle) * drawLen;
      var pulse = 0.7 + 0.3 * Math.sin(nowDraw2 / 180 + s.angle * 3);
      // Outer glow
      ctx.globalAlpha = 0.28 * pulse;
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 26;
      ctx.beginPath(); ctx.moveTo(vol2d.x, vol2d.y); ctx.lineTo(ex, ey); ctx.stroke();
      // Main stream
      ctx.globalAlpha = 0.75 * pulse;
      ctx.strokeStyle = '#ff2200'; ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(vol2d.x, vol2d.y); ctx.lineTo(ex, ey); ctx.stroke();
      // Hot centre
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(vol2d.x, vol2d.y); ctx.lineTo(ex, ey); ctx.stroke();
    });
    ctx.globalAlpha = 1; ctx.lineCap = 'butt'; ctx.restore();
  }

  // Draw gem chests
  this.gemChests.forEach(function(gc) {
    if (gc.open) return;
    ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🎁', gc.x, gc.y);
  });


  this.towers.forEach(function(tw) {
    if (tw.dead) return;
    // range ring
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(tw.x, tw.y, 260, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
    // base platform
    ctx.fillStyle = 'rgba(60,40,0,0.70)';
    ctx.beginPath(); ctx.arc(tw.x, tw.y+6, 14, 0, Math.PI*2); ctx.fill();
    // tower icon above pet
    ctx.font = '11px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🗼', tw.x, tw.y - 16);
    ctx.font = '16px serif';
    ctx.fillText(tw.e, tw.x, tw.y + 2);
    // HP bar
    if (tw.mhp && tw.hp < tw.mhp) {
      var bw = 28, bx = tw.x - bw/2, by = tw.y - 27;
      ctx.fillStyle = '#500'; ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = '#44ff66'; ctx.fillRect(bx, by, Math.max(0, bw * (tw.hp/tw.mhp)), 3);
    }
  });

  this.mons.forEach(function(m) {
    if (m.dead) return;
    var fsz = m.isBoss ? 48 : m.isGuardian ? 32 : 24;
    ctx.font = fsz + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (m.isBoss) {
      var pulse = 1 + 0.06 * Math.sin(Date.now() / 180);
      ctx.save(); ctx.translate(m.x, m.y); ctx.scale(pulse, pulse);
      ctx.fillText(m.e, 0, 0); ctx.restore();
      ctx.font = 'bold 11px Courier New'; ctx.fillStyle = '#00ffff'; ctx.fillText('COSMIC TERROR', m.x, m.y - 38);
    } else {
      ctx.fillText(m.e, m.x, m.y);
    }
    if (m.isGuardian) { ctx.font = '13px serif'; ctx.fillText('💀', m.x+14, m.y-18); }
    var bw = m.isBoss ? 100 : m.isGuardian ? 50 : 34;
    var bx = m.x - bw/2, by = m.y - (m.isBoss ? 52 : m.isGuardian ? 30 : 22);
    ctx.fillStyle = '#500'; ctx.fillRect(bx, by, bw, m.isBoss ? 10 : 6);
    ctx.fillStyle = m.isBoss ? '#00ffff' : m.isGuardian ? '#ff8800' : '#f44';
    ctx.fillRect(bx, by, Math.max(0, bw*(m.hp/m.mhp)), m.isBoss ? 10 : 6);
    if (m.isBoss) {
      ctx.font = '10px Courier New'; ctx.fillStyle = '#aaeeff'; ctx.textAlign = 'center';
      ctx.fillText(m.hp + ' / ' + m.mhp, m.x, by - 4);
    }
  });

  // Draw boss lasers
  if (this.isBossRun && this.bossLasers.length) {
    var nowD = Date.now();
    var bossM = null;
    for (var bi2 = 0; bi2 < this.mons.length; bi2++) { if (this.mons[bi2].isBoss && !this.mons[bi2].dead) { bossM = this.mons[bi2]; break; } }
    this.bossLasers.forEach(function(b) {
      if (b.done) return;
      var frac = Math.max(0, Math.min(1, 1 - (b.warnUntil - nowD) / 900));
      ctx.globalAlpha = 0.35 + frac * 0.55; ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2 + frac * 4;
      ctx.setLineDash([10, 6]);
      ctx.beginPath(); ctx.moveTo(bossM ? bossM.x : b.bx, bossM ? bossM.y : b.by); ctx.lineTo(b.tx, b.ty); ctx.stroke();
      ctx.setLineDash([]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(b.tx, b.ty, 14 + frac * 18, 0, Math.PI*2); ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  // Draw slow/weaken indicators on monsters
  if (this.slowUntil || this.weakenUntil) {
    var nowD2 = Date.now();
    this.mons.forEach(function(m) {
      if (m.dead) return;
      if (self.slowUntil && nowD2 < self.slowUntil) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = '#88ddff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(m.x, m.y, 20, 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (self.weakenUntil && nowD2 < self.weakenUntil) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(m.x, m.y, 22, 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha = 1;
      }
    });
  }

  var p = this.p;
  var charEmoji = this.charDef ? this.charDef.e : '🐻';
  if (!(p.inv > 0 && Math.floor(p.inv/80) % 2 === 0)) {
    ctx.save();
    if (p.dir === -1) { ctx.scale(-1, 1); ctx.translate(-canvas.width, 0); }
    var px2 = p.dir === -1 ? canvas.width - p.x : p.x;
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(charEmoji, px2, p.y);
    if (this.blastReady) {
      ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 180));
      ctx.font = '12px serif'; ctx.fillText('💥', px2 + 20, p.y - 20);
      ctx.globalAlpha = 1;
    }
    if (p.atk && this.aa > 0) { ctx.font = '16px serif'; ctx.fillText('⚔️', px2+24, p.y-8); }
    ctx.restore();
  }

  this.pets.forEach(function(pt) {
    if (pt.x === undefined || pt.dead) return;
    ctx.font = '14px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(pt.e, pt.x, pt.y);
    if (pt.mhp && pt.hp < pt.mhp) {
      var bw = 22, bx2 = pt.x - bw/2, by2 = pt.y - 14;
      ctx.fillStyle = '#500'; ctx.fillRect(bx2, by2, bw, 3);
      ctx.fillStyle = '#44ff66'; ctx.fillRect(bx2, by2, Math.max(0, bw * (pt.hp/pt.mhp)), 3);
    }
  });

  this.parts.forEach(function(pt) {
    ctx.globalAlpha = Math.max(0, pt.l/600);
    ctx.fillStyle = pt.c; ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
  });
  this.floats.forEach(function(f) {
    ctx.globalAlpha = Math.min(1, f.l/250);
    ctx.fillStyle = f.c; ctx.font = 'bold 12px Courier New'; ctx.textAlign = 'center';
    ctx.fillText(f.t, f.x, f.y); ctx.globalAlpha = 1;
  });

  if (this.help && Date.now() - this.t0 < 9000) {
    ctx.fillStyle = 'rgba(0,0,0,.78)'; ctx.fillRect(canvas.width/2-170, canvas.height-66, 340, 50);
    ctx.fillStyle = '#d8c0f8'; ctx.font = '14px Courier New'; ctx.textAlign = 'center';
    ctx.fillText('Arrow keys / WASD = move  ·  SPACE = attack  ·  S = shop', canvas.width/2, canvas.height-49);
    ctx.fillText('Kill 💀 guardian → ⚔️ attack 📦 chest to open it & get a wild pet!', canvas.width/2, canvas.height-30);
  } else if (Date.now() - this.t0 >= 9000) {
    this.help = false;
  }
};

// ── Audio engine (Web Audio API, no files needed) ──────────────────────────
var _AC = null, _SFX_GAIN = null;
function ac() {
  if (!_AC) {
    _AC = new (window.AudioContext || window.webkitAudioContext)();
    _SFX_GAIN = _AC.createGain();
    _SFX_GAIN.gain.value = parseFloat(localStorage.getItem('af_sfx_vol') || '1.0');
    _SFX_GAIN.connect(_AC.destination);
  }
  return _AC;
}
function sfxDest() { ac(); return _SFX_GAIN || _AC.destination; }

window.setSFXVolume = function (v) {
  if (_SFX_GAIN) _SFX_GAIN.gain.value = v;
  try { localStorage.setItem('af_sfx_vol', String(v)); } catch (e) {}
};
window.getSFXVolume = function () {
  return parseFloat(localStorage.getItem('af_sfx_vol') || '1.0');
};

function sndKill() {
  try {
    var c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(sfxDest());
    o.type = 'square';
    o.frequency.setValueAtTime(280, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.13);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.13);
    o.start(); o.stop(c.currentTime + 0.13);
  } catch(e) {}
}

function sndBuyPet() {
  try {
    var c = ac();
    [[523,0],[659,0.08],[784,0.16],[1047,0.24]].forEach(function(p) {
      var o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(sfxDest());
      o.type = 'sine'; o.frequency.value = p[0];
      var t = c.currentTime + p[1];
      g.gain.setValueAtTime(0.0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      o.start(t); o.stop(t + 0.38);
    });
  } catch(e) {}
}

function sndLevelUp() {
  try {
    var c = ac();
    [[392,0,0.2],[494,0.12,0.2],[587,0.24,0.2],[784,0.36,0.55],[988,0.5,0.7]].forEach(function(n) {
      var o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(sfxDest());
      o.type = 'triangle'; o.frequency.value = n[0];
      var t = c.currentTime + n[1];
      g.gain.setValueAtTime(0.0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.025);
      g.gain.exponentialRampToValueAtTime(0.001, t + n[2]);
      o.start(t); o.stop(t + n[2]);
    });
  } catch(e) {}
}
// ───────────────────────────────────────────────────────────────────────────

function getCatCls(cat) {
  if (cat.indexOf('Healer')    >= 0) return 'healer';
  if (cat.indexOf('Attacker')  >= 0) return 'attacker';
  if (cat.indexOf('Tank')      >= 0) return 'tank';
  if (cat.indexOf('Hybrid')    >= 0) return 'hybrid';
  return 'legendary';
}

function openShop()  {
  if (!G || G.dead || G.win) return;
  closeBackpack();
  G.open = true; renderShop();
  document.getElementById('ov').style.display = 'flex';
  document.getElementById('touch-atk').style.display = 'none';
  document.getElementById('touch-shop').style.display = 'none';
  document.getElementById('food-btn').style.display = 'none';
}
function closeShop() {
  if (!G) return;
  G.open = false;
  document.getElementById('ov').style.display = 'none';
  document.getElementById('touch-atk').style.display = '';
  document.getElementById('touch-shop').style.display = '';
  document.getElementById('food-btn').style.display = '';
}

function touchAtkDown(e) {
  if (e) e.preventDefault();
  if (!G || G.open || G.dead || G.win) return;
  keys['Space'] = true;
  document.getElementById('touch-atk').classList.add('pressing');
}
function touchAtkUp(e) {
  if (e) e.preventDefault();
  keys['Space'] = false;
  document.getElementById('touch-atk').classList.remove('pressing');
}

function renderShop() {
  document.getElementById('sglbl').textContent = G.gems + '💎 gems';

  // Upgrades section
  var upgHtml = '';
  UPGRADES.forEach(function(up) {
    var count = G.upg[up.id] || 0;
    var maxed = up.max && count >= up.max;
    var ca = maxed || G.gems < up.cost;
    var badge = count > 0 ? '<div class="owned-badge">x' + count + '</div>' : '';
    var label = maxed ? 'MAX' : '💎 ' + up.cost;
    upgHtml += '<div class="sc upgrade' + (ca ? ' ca' : '') + '" onclick="' + (ca ? '' : 'buyUpgrade(\'' + up.id + '\')') + '">';
    upgHtml += badge;
    upgHtml += '<div class="pe">' + up.e + '</div>';
    upgHtml += '<div class="pn">' + up.n + '</div>';
    upgHtml += '<div class="pd">' + up.d + '</div>';
    upgHtml += '<div class="pc">' + label + '</div>';
    upgHtml += '</div>';
  });
  document.getElementById('upgrid').innerHTML = upgHtml;

  // Pets section
  var cats = {}, catOrder = [];
  PETS.forEach(function(pt) {
    if (!cats[pt.cat]) { cats[pt.cat] = []; catOrder.push(pt.cat); }
    cats[pt.cat].push(pt);
  });
  var html = '';
  catOrder.forEach(function(cat) {
    var cls = getCatCls(cat);
    html += '<div class="scat ' + cls + '">' + cat + '</div><div class="sgrid">';
    cats[cat].forEach(function(pt) {
      var petCount = G.pets.filter(function(x) { return x.id === pt.id; }).length;
      var twrCount = G.towers.filter(function(x) { return x.id === pt.id; }).length;
      var total = petCount + twrCount;
      var full  = runSpeciesCount(pt.id) >= 10;
      var ca    = G.gems < pt.cost || full;
      var badge = total > 0 ? '<div class="owned-badge">' + (full ? '10/10' : 'x'+total) + '</div>' : '';
      html += '<div class="sc ' + cls + (ca ? ' ca' : '') + '">';
      html += badge;
      html += '<div class="pe">' + pt.e + '</div>';
      html += '<div class="pn">' + pt.n + '</div>';
      html += '<div class="pd">' + pt.d + '</div>';
      html += '<div class="sbtns">';
      html += '<span class="sbuy' + (ca ? ' ca' : '') + '" onclick="' + (ca ? '' : 'buyPet(\'' + pt.id + '\')') + '">💎 ' + pt.cost + '</span>';
      html += '<span class="stwr' + (ca ? ' ca' : '') + '" onclick="' + (ca ? '' : 'placeTower(\'' + pt.id + '\')') + '">🗼 ' + pt.cost + '</span>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
  });
  document.getElementById('sgrid').innerHTML = html;

}

function openBackpack() {
  if (!G || G.dead || G.win) return;
  if (G.open) closeShop();
  document.getElementById('foodov').style.display = 'flex';
  document.getElementById('food-btn').style.display = 'none';
  renderBackpack();
}
function closeBackpack() {
  document.getElementById('foodov').style.display = 'none';
  document.getElementById('food-btn').style.display = '';
}
function renderBackpack() {
  var bp = window.META_getBackpack ? window.META_getBackpack() : {};
  var foods = window.FOOD_ITEMS || [];
  var ids = Object.keys(bp).filter(function(k) { return bp[k] > 0; });
  if (ids.length === 0) {
    document.getElementById('bpgrid').innerHTML = '<div style="color:#888;text-align:center;padding:16px;font-size:12px">Backpack empty!<br>Buy food at the Hub 🏠</div>';
    return;
  }
  var html = '';
  ids.forEach(function(fid) {
    var qty = bp[fid];
    var f = null;
    for (var i = 0; i < foods.length; i++) { if (foods[i].id === fid) { f = foods[i]; break; } }
    if (!f) return;
    html += '<div class="sc food-item" onclick="eatFood(\'' + fid + '\')">';
    html += '<div class="owned-badge" style="position:relative;left:0;top:0;margin-bottom:2px">×' + qty + '</div>';
    html += '<div class="pe">' + f.e + '</div>';
    html += '<div class="pn">' + f.n + '</div>';
    html += '<div class="pd">' + f.desc + '</div>';
    html += '<div class="pc" style="color:#44ff88">Eat</div>';
    html += '</div>';
  });
  document.getElementById('bpgrid').innerHTML = html;
}
function eatFood(id) {
  if (!G || G.dead || G.win) return;
  var f = window.META_consumeFood ? window.META_consumeFood(id) : null;
  if (!f) return;
  var p = G.p;
  if (f.heal > 0) {
    var healed = Math.min(p.mhp - p.hp, f.heal >= 9999 ? p.mhp : f.heal);
    p.hp = f.heal >= 9999 ? p.mhp : Math.min(p.mhp, p.hp + f.heal);
    if (healed > 0) { G.fl(p.x, p.y - 20, '+' + healed + '❤️', '#44ff88'); G.burst(p.x, p.y, '#44ff88', 12); }
  }
  if (f.atk > 0) {
    G.foodAtk = (G.foodAtk || 0) + f.atk;
    G.fl(p.x, p.y - 38, '+' + f.atk + '⚔️ food!', '#ffdd44');
  }
  sndBuyPet();
  renderBackpack();
}

function buyUpgrade(id) {
  var up = UPGRADES.find(function(u) { return u.id === id; });
  if (!up || G.gems < up.cost) return;
  if (up.max && (G.upg[id] || 0) >= up.max) return;
  G.gems -= up.cost;
  G.upg[id] = (G.upg[id] || 0) + 1;
  sndBuyPet();
  renderShop();
}

function runSpeciesCount(id) {
  return G.pets.filter(function(p) { return p.id === id && !p.dead; }).length;
}

function buyPet(id) {
  var pt = PETS.find(function(p) { return p.id === id; });
  if (!pt || G.gems < pt.cost) return;
  if (runSpeciesCount(id) >= 10) { G.fl(G.p.x, G.p.y - 30, '⛔ ' + pt.n + ' full! (10/10)', '#ff6666'); return; }
  G.gems -= pt.cost;
  var instance = {};
  for (var k in pt) instance[k] = pt[k];
  instance.uid = id + '_' + Date.now() + '_' + Math.floor(Math.random() * 99999);
  G.pets.push(instance);
  var n = Date.now();
  G.patk[instance.uid] = n;
  if (pt.hi > 0) G.ptim[instance.uid] = n;
  var ang = Math.random() * Math.PI * 2;
  instance.x = G.p.x + Math.cos(ang) * (40 + Math.random()*30);
  instance.y = G.p.y + Math.sin(ang) * (30 + Math.random()*25);
  instance.mhp = petMaxHp(instance); instance.hp = instance.mhp; instance.dead = false;
  instance.wdx = 0; instance.wdy = 0; instance.wtim = 0; instance.healMode = false;
  sndBuyPet();
  renderShop();
}

function placeTower(id) {
  var pt = PETS.find(function(p) { return p.id === id; });
  if (!pt || G.gems < pt.cost) return;
  G.gems -= pt.cost;
  var instance = {};
  for (var k in pt) instance[k] = pt[k];
  instance.uid = id + '_tower_' + Date.now() + '_' + Math.floor(Math.random()*99999);
  var pos = G.rf();
  instance.x = pos.x; instance.y = pos.y;
  instance.mhp = petMaxHp(instance); instance.hp = instance.mhp; instance.dead = false;
  G.towerAtk[instance.uid] = Date.now();
  G.towers.push(instance);
  G.floats.push({x:G.p.x, y:G.p.y-45, t:'🗼 '+pt.e+' '+pt.n+' placed!', c:'#ffaa00', l:2000});
  sndBuyPet();
  renderShop();
}

function restart() {
  document.getElementById('gov').style.display = 'none';
  document.getElementById('wov').style.display = 'none';
  G = new Game();
}

function metaReturn(won) {
  document.getElementById('gov').style.display = 'none';
  document.getElementById('wov').style.display = 'none';
  if (!G) { if (window.showHub) window.showHub(); return; }
  if (G.isBossRun) {
    if (G.voidPhase && !won && window.META_onVoidFail) { window.META_onVoidFail(); return; }
    if (window.showHub) window.showHub(); return;
  }
  if (window.META_onRunEnd) {
    var _ck = {};
    G.team.forEach(function(c, i) { if (c) _ck[c.id] = (G.charKillsData[c.id] || 0) + (G.teamRunKills[i] || 0); });
    window.META_onRunEnd(won, G.pets ? G.pets.slice() : [], G.lv + 1, G.homePetUIDs || {}, G.score || 0, G.gems || 0, { monstersKilled: G.monstersKilled||0, wallsBroken: G.wallsBroken||0, volcanoGems: G.volcanoGems||0, digRubies: G.digRubies||0, charKills: _ck });
  } else {
    restart();
  }
}

function applyHomePets(homePets) {
  G.homePetUIDs = {};
  var now = Date.now();
  (homePets || []).forEach(function(p, i) {
    var inst = {}, k;
    for (k in p) inst[k] = p[k];
    inst.uid = p.id + '_home_' + now + '_' + i;
    inst.mhp = petMaxHp(inst); inst.hp = inst.mhp; inst.dead = false;
    inst.wdx = 0; inst.wdy = 0; inst.wtim = 0; inst.healMode = false;
    var ang = (i / Math.max(1, homePets.length)) * Math.PI * 2;
    inst.x = G.p.x + Math.cos(ang) * 55;
    inst.y = G.p.y + Math.sin(ang) * 40;
    G.patk[inst.uid] = now;
    if (p.hi > 0) G.ptim[inst.uid] = now;
    G.pets.push(inst);
    G.homePetUIDs[inst.uid] = true;
  });
}

function resetGameUI() {
  document.getElementById('ov').style.display     = 'none';
  document.getElementById('gov').style.display    = 'none';
  document.getElementById('wov').style.display    = 'none';
  document.getElementById('foodov').style.display = 'none';
  document.getElementById('touch-atk').style.display  = '';
  document.getElementById('touch-shop').style.display = '';
  document.getElementById('food-btn').style.display   = '';
  var ab = document.getElementById('audio-btn');   if (ab) { ab.style.display = ''; ab.classList.add('in-game'); }
  var ap = document.getElementById('audio-panel'); if (ap) ap.classList.remove('open');
}

window.META_startGame = function (config, homePets) {
  G = new Game();
  resetGameUI();
  if (window.playScreenMusic) window.playScreenMusic('game');
  if (config) {
    if (config.speed)        G.upg.speed   += config.speed;
    if (config.attack)       G.upg.attack  += config.attack  * 2;
    if (config.petluck)      G.upg.petluck += config.petluck * 2;
    for (var i = 0; i < (config.potion || 0); i++) { G.p.mhp += 30; G.p.hp = Math.min(G.p.hp + 30, G.p.mhp); }
    if (config.weaponDmg)   { G.weaponDmg = config.weaponDmg; G.weaponRange = config.weaponRange; G.weaponLevel = config.weaponLevel || 1; G.weaponColor = config.weaponColor || '#fff'; }
  }
  G.initTeam(config);
  applyHomePets(homePets);
};

window.META_startBossGame = function(homePets, charDef, bossKills, voidKills) {
  G = new Game();
  resetGameUI();
  if (window.playScreenMusic) window.playScreenMusic('game-boss');
  G.isBossRun = true;
  G.charDef   = charDef || null;
  G.bossKills = bossKills || 0;
  G.voidKills = voidKills || 0;
  G.buildBossLevel();
  G.initTeam({ team: charDef ? [charDef.id] : [], charKills: {} });
  applyHomePets(homePets);
};



var last = 0;
function loop(ts) {
  var dt = Math.min((ts - last) / 1000, .05);
  last = ts;
  if (G) { G.update(dt); ctx.clearRect(0, 0, canvas.width, canvas.height); G.draw(); }
  requestAnimationFrame(loop);
}
rsz(); requestAnimationFrame(function(ts) { last = ts; loop(ts); });
