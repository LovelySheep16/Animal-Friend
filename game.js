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
  {id:'dragon',  e:'🐉', n:'Dragon',     d:'Heals 20hp/2.5s + 34dmg',     cost:355,  cat:'✨ Hybrids',     heal:20, hi:2500, atk:34, ar:1600, sc:0},
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

function lvlDef(lv) {
  var zone = ZONES[Math.min(lv, 49)];
  var pct = (lv + 1) / 50;
  var pe = Math.min(MONS.length, Math.max(3, Math.ceil(pct * MONS.length)));
  var ps = Math.max(0, pe - Math.min(10, pe));
  var pool = MONS.slice(ps, pe);
  var count = 7 + Math.floor(lv * 1.4);
  return {name: zone.flag + ' Level ' + (lv + 1) + ': ' + zone.n, zone: zone, pool: pool, count: count, li: lv % 5};
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
  keys[e.code] = true; e.preventDefault();
});
window.addEventListener('keyup', function(e) {
  var tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  keys[e.code] = false;
});

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
  this.build(); this.showBanner();
}

Game.prototype.build = function() {
  this.ld = lvlDef(this.lv);
  this.C = Math.floor(canvas.width / T); this.R = Math.floor(GH / T);
  this.map = this.genMap(this.ld.li, this.C, this.R);
  this.p = {x: T*2+T/2, y: GT+T*2+T/2, hp: 100, mhp: 100, atk: false, at: 0, dir: 1, inv: 0};
  this.mons = this.spawnMons(); this.aa = 0;

  // Chest setup
  var ca = CHEST_ANIMALS[this.lv];
  this.chestPet = makeChestPet(this.lv);
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

  var n = Date.now();
  for (var i = 0; i < this.pets.length; i++) {
    var pt = this.pets[i];
    if (pt.dead) { pt.dead = false; pt.hp = pt.mhp || petMaxHp(pt); }
    if (!pt.mhp) { pt.mhp = petMaxHp(pt); pt.hp = pt.mhp; }
    if (!this.patk[pt.uid]) this.patk[pt.uid] = n;
    if (pt.hi > 0 && !this.ptim[pt.uid]) this.ptim[pt.uid] = n;
    var ang = (i / Math.max(1, this.pets.length)) * Math.PI * 2;
    pt.x = this.p.x + Math.cos(ang) * 55;
    pt.y = this.p.y + Math.sin(ang) * 40;
    pt.wdx = 0; pt.wdy = 0; pt.wtim = 0; pt.healMode = false;
  }
  for (var ti = 0; ti < this.towers.length; ti++) {
    var tw = this.towers[ti], tpos = this.rf();
    if (tw.dead) { tw.dead = false; tw.hp = tw.mhp || petMaxHp(tw); }
    if (!tw.mhp) { tw.mhp = petMaxHp(tw); tw.hp = tw.mhp; }
    tw.x = tpos.x; tw.y = tpos.y;
    if (!this.towerAtk[tw.uid]) this.towerAtk[tw.uid] = n;
  }
};

Game.prototype.genMap = function(li, C, R) {
  var m = [], r, c, idx;
  for (r = 0; r < R; r++) { m[r] = []; for (c = 0; c < C; c++) m[r][c] = (r===0||r===R-1||c===0||c===C-1) ? 1 : 0; }
  var ws = [], mc, mr;
  if (li === 0) {
    mc = Math.floor(C/2); mr = Math.floor(R/2);
    for (r = 2; r < R-2; r++) ws.push([r, mc]);
    [mr-1, mr, mr+1].forEach(function(rr) { var i = ws.findIndex(function(x) { return x[0]===rr && x[1]===mc; }); if (i > -1) ws.splice(i, 1); });
    for (c = 3; c < C-3; c++) ws.push([mr, c]);
    for (c = mc-2; c <= mc+2; c++) { idx = ws.findIndex(function(x) { return x[0]===mr && x[1]===c; }); if (idx > -1) ws.splice(idx, 1); }
  } else if (li === 1) {
    [Math.floor(C/3), Math.floor(2*C/3)].forEach(function(xc) { for (var xr = 1; xr < R-1; xr++) if (Math.abs(xr - Math.floor(R/2)) > 2) ws.push([xr, xc]); });
  } else if (li === 2) {
    for (r = 2; r < R-2; r++) { if (r%4!==0) ws.push([r, Math.floor(C*.33)]); if (r%4!==2) ws.push([r, Math.floor(C*.67)]); }
  } else if (li === 3) {
    [[Math.floor(R/4),Math.floor(C/4)],[Math.floor(R/4),Math.floor(3*C/4)],[Math.floor(3*R/4),Math.floor(C/4)],[Math.floor(3*R/4),Math.floor(3*C/4)]].forEach(function(bc) { for (var dr = -2; dr <= 2; dr++) for (var dc = -2; dc <= 2; dc++) if (Math.abs(dr)+Math.abs(dc) > 1) ws.push([bc[0]+dr, bc[1]+dc]); });
  } else {
    for (var i = 0; i < Math.floor(R/3); i++) ws.push([i*3+2, Math.floor(C/3)+(i%2)*Math.floor(C/3)]);
  }
  ws.forEach(function(w) { if (w[0]>0 && w[0]<R-1 && w[1]>0 && w[1]<C-1) m[w[0]][w[1]] = 1; });
  return m;
};

Game.prototype.spawnMons = function() {
  var hpSc  = 1 + this.lv * 0.12;   // HP doubles by lv~8, ~6x at lv50
  var atkSc = 1 + this.lv * 0.10;   // ATK ~5x at lv50
  var spdSc = 1 + this.lv * 0.014;  // speed +70% at lv50
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

Game.prototype.tile = function(x, y) { var c = Math.floor(x/T), r = Math.floor((y-GT)/T); if (r<0||r>=this.R||c<0||c>=this.C) return 1; return this.map[r][c]; };
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

    // Attacker: walk to nearest monster, or chest if it's closer
    if (!moved && pt.atk > 0 && !pt.healMode) {
      var chstW = (self.chest && !self.chest.open) ? self.chest : null;
      var chstWD = chstW ? Math.hypot(chstW.x-pt.x, chstW.y-pt.y) : Infinity;
      if (alive.length) {
        var near = alive.reduce(function(a,b) { return Math.hypot(a.x-pt.x,a.y-pt.y)<Math.hypot(b.x-pt.x,b.y-pt.y)?a:b; });
        var dn = Math.hypot(near.x-pt.x, near.y-pt.y);
        var wx = (chstW && chstWD < dn) ? chstW.x : near.x;
        var wy = (chstW && chstWD < dn) ? chstW.y : near.y;
        var wd = (chstW && chstWD < dn) ? chstWD : dn;
        if (wd > 32) self.mv(pt, (wx-pt.x)/wd, (wy-pt.y)/wd, APPROACH, dt);
        moved = true;
      } else if (chstW) {
        if (chstWD > 32) self.mv(pt, (chstW.x-pt.x)/chstWD, (chstW.y-pt.y)/chstWD, APPROACH, dt);
        moved = true;
      }
    }

    // Attack trigger (from pet's own position)
    if (pt.atk > 0 && pt.ar > 0) {
      var chstA = (self.chest && !self.chest.open) ? self.chest : null;
      var chstAD = chstA ? Math.hypot(chstA.x-pt.x, chstA.y-pt.y) : Infinity;
      if (alive.length || (chstA && chstAD < 260)) {
        if (!self.patk[uid]) self.patk[uid] = now;
        if (now - self.patk[uid] >= pt.ar) {
          self.patk[uid] = now;
          var fc = pt.id==='dragon'?'#ff7700':pt.id==='god'?'#ffff00':pt.id==='cerberus'?'#ff4400':'#70b0ff';
          if (alive.length) {
            var tg = alive.reduce(function(a,b) { return Math.hypot(a.x-pt.x,a.y-pt.y)<Math.hypot(b.x-pt.x,b.y-pt.y)?a:b; });
            var tgD = Math.hypot(tg.x-pt.x, tg.y-pt.y);
            if (chstA && chstAD < tgD && chstAD < 260) {
              self.fx.push({x1:pt.x, y1:pt.y, x2:chstA.x, y2:chstA.y, l:200, c:'#ff8800'});
              self.dmgChest(pt.atk);
            } else if (tgD < 260) {
              tg.hp -= pt.atk; self.fx.push({x1:pt.x, y1:pt.y, x2:tg.x, y2:tg.y, l:200, c:fc});
              self.fl(tg.x, tg.y, '-'+pt.atk, '#ffd700'); if (tg.hp <= 0) self.kill(tg);
            }
          } else if (chstA && chstAD < 260) {
            self.fx.push({x1:pt.x, y1:pt.y, x2:chstA.x, y2:chstA.y, l:200, c:'#ff8800'});
            self.dmgChest(pt.atk);
          }
        }
      }
    }

    // Wander when nothing else to do
    if (!moved) {
      pt.wtim = (pt.wtim||0) - dt*1000;
      if (pt.wtim <= 0) {
        var wa = Math.random()*Math.PI*2;
        pt.wdx = Math.cos(wa); pt.wdy = Math.sin(wa);
        pt.wtim = 600 + Math.random()*900;
      }
      var fdx = p.x-pt.x, fdy = p.y-pt.y, fd = Math.hypot(fdx,fdy);
      if (fd > 200) { self.mv(pt, fdx/fd, fdy/fd, WANDER, dt); }
      else { self.mv(pt, pt.wdx||0, pt.wdy||0, WANDER, dt); }
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
        if (def) self.awardBreedPet(def);
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
  this.pets.push(instance);
  this.floats.push({x:p.x, y:p.y-50, t:'🧬 '+def.e+' '+def.n+' bred!', c:'#ff80ff', l:2200});
  sndBuyPet();
};

Game.prototype.killPet = function(pt) {
  pt.hp = 0; pt.dead = true;
  this.burst(pt.x, pt.y, '#ff4444', 8);
  this.floats.push({x:pt.x, y:pt.y-30, t:'💀 '+pt.e+' '+pt.n+' fell!', c:'#ff6644', l:2800});
};

Game.prototype.update = function(dt) {
  if (this.open || this.dead || this.win || this.trans) return;
  var p = this.p, dx = 0, dy = 0, self = this;
  if (keys.ArrowLeft || keys.KeyA) { dx = -1; p.dir = -1; }
  if (keys.ArrowRight || keys.KeyD) { dx =  1; p.dir =  1; }
  if (keys.ArrowUp    || keys.KeyW) dy = -1;
  if (keys.ArrowDown  || keys.KeyS) dy =  1;
  if (dx && dy) { dx *= .707; dy *= .707; }
  this.mv(p, dx, dy, 185 * (1 + 0.15 * this.upg.speed), dt);
  p.at = Math.max(0, p.at - dt*1000);
  if (keys.Space && p.at <= 0) { p.atk = true; p.at = 380; this.aa = 280; this.doAtk(); }
  if (p.at <= 0) p.atk = false;
  this.aa = Math.max(0, this.aa - dt*1000);
  if (p.inv > 0) p.inv -= dt*1000;

  this.mons.forEach(function(m) {
    if (m.dead) return;
    m.mt -= dt*1000;
    if (m.mt <= 0) {
      var a = Math.atan2(p.y - m.y, p.x - m.x) + (Math.random() - .5) * 0.5;
      m.dx = Math.cos(a); m.dy = Math.sin(a); m.mt = 180 + Math.random() * 280;
    }
    self.mv(m, m.dx, m.dy, m.spd, dt);
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
          p.hp = Math.max(0, p.hp - m.atk); p.inv = 350;
          self.burst(p.x, p.y, '#ff3333', 6); self.fl(p.x, p.y, '-' + m.atk, '#ff4444');
          if (p.hp <= 0) { self.dead = true; self.showDead(); }
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
        nearPet.hp = Math.max(0, nearPet.hp - m.atk);
        self.fl(nearPet.x, nearPet.y - 8, '-' + m.atk, '#ff6644');
        if (nearPet.hp <= 0) self.killPet(nearPet);
      }
    }
  });

  if (this.upg.potion > 0) {
    this.potionTick += dt;
    if (this.potionTick >= 20) { this.potionTick -= 20; p.hp = Math.min(p.mhp, p.hp + 10 * this.upg.potion); }
  }

  var now = Date.now();
  this.updatePets(dt, now);
  this.updateTowers(dt, now);
  this.checkPairBreeding(now);

  this.parts  = this.parts.filter(function(pt) { pt.x += pt.vx*.016; pt.y += pt.vy*.016; pt.l -= dt*1000; return pt.l > 0; });
  this.floats = this.floats.filter(function(f)  { f.y -= dt*42; f.l -= dt*1000; return f.l > 0; });
  this.fx     = this.fx.filter(function(f)      { f.l -= dt*1000; return f.l > 0; });
  this.mons   = this.mons.filter(function(m)    { return !m.dead; });

  var chestDone = !this.chest || this.chest.open || this.alreadyOwned;
  if (this.mons.length === 0 && chestDone && !this.trans) {
    this.trans = true;
    if (this.arenaMode) {
      this.win = true;
      this.floats.push({x: this.p.x, y: this.p.y - 80, t: '🏆 ARENA VICTORY!', c: '#ffd700', l: 2500});
      sndLevelUp();
      setTimeout(function() { metaReturn(true); }, 2200);
    } else if (this.lv < 49) {
      if (Math.random() < Math.min(0.80, 0.20 + 0.08 * this.upg.petluck)) this.awardFreePet(this.lv);
      this.lv++; this.showBanner(); sndLevelUp();
      var s2 = this; setTimeout(function() { s2.build(); s2.trans = false; }, 1800);
    } else {
      this.win = true;
      document.getElementById('wscore').textContent = this.score;
      document.getElementById('wov').style.display = 'flex';
    }
  }
  this.hud();
};

Game.prototype.dmgChest = function(dmg) {
  if (!this.chest || this.chest.open) return;
  this.chest.hp = Math.max(0, this.chest.hp - dmg);
  this.fl(this.chest.x, this.chest.y - 22, '-' + dmg, '#ff8800');
  if (this.chest.hp <= 0) this.openChest();
};

Game.prototype.doAtk = function() {
  var p = this.p, dmg = 20 + this.lv + 8 * this.upg.attack, self = this;
  this.mons.forEach(function(m) {
    if (m.dead || Math.hypot(m.x-p.x, m.y-p.y) > 68) return;
    m.hp -= dmg;
    self.fx.push({x1:p.x, y1:p.y, x2:m.x, y2:m.y, l:180, c:'#fff'});
    self.fl(m.x, m.y, '-' + dmg, '#fff');
    if (m.hp <= 0) self.kill(m);
  });
  if (this.chest && !this.chest.open && Math.hypot(this.chest.x-p.x, this.chest.y-p.y) < 68) {
    this.dmgChest(dmg);
    this.fx.push({x1:p.x, y1:p.y, x2:this.chest.x, y2:this.chest.y, l:180, c:'#ff8800'});
  }
  this.burst(p.x + p.dir*26, p.y, '#fff', 3);
};

Game.prototype.kill  = function(m) {
  if (m.dead) return; m.dead = true;
  this.gems += m.gem; this.score += m.gem*10;
  this.burst(m.x, m.y, '#ffd700', 10); this.fl(m.x, m.y, '+' + m.gem + '💎', '#ffd700'); sndKill();
  if (m.isGuardian && this.chest && !this.chest.open) {
    this.floats.push({x:this.chest.x, y:this.chest.y-35, t:'⚔️ Attack the chest!', c:'#ff8800', l:3500});
  }
};
Game.prototype.burst = function(x, y, c, n) { for (var i = 0; i < n; i++) { var a = Math.random()*Math.PI*2, s = 40+Math.random()*80; this.parts.push({x:x, y:y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, c:c, l:350+Math.random()*280, sz:2+Math.random()*2.5}); } };
Game.prototype.fl    = function(x, y, t, c) { this.floats.push({x:x, y:y, t:t, c:c, l:750}); };

Game.prototype.awardFreePet = function(lv) {
  var sorted = PETS.slice().sort(function(a,b){ return a.cost - b.cost; });
  var idx = Math.round((lv / 49) * (sorted.length - 1));
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
  el.textContent = this.ld ? this.ld.name : 'Level ' + (this.lv + 1);
  el.style.opacity = '1';
  setTimeout(function() { el.style.opacity = '0'; }, 1600);
};
Game.prototype.showDead = function() {
  document.getElementById('glvl').textContent  = (this.lv + 1) + '/50';
  document.getElementById('ggems').textContent = this.gems;
  document.getElementById('gov').style.display = 'flex';
};

Game.prototype.hud = function() {
  var p = this.p;
  var hpPct   = p.hp / p.mhp;
  var hpColor = hpPct > 0.5 ? '#44dd44' : hpPct > 0.25 ? '#e8aa20' : '#ff3333';
  document.getElementById('hpfill').style.width      = (hpPct * 100) + '%';
  document.getElementById('hpfill').style.background = hpColor;
  document.getElementById('ltxt').textContent = (this.lv + 1) + '/50';
  document.getElementById('ztxt').textContent = this.ld ? this.ld.zone.flag + ' ' + this.ld.zone.n : '-';
  document.getElementById('gtxt').textContent = this.gems + '💎';
  document.getElementById('stxt').textContent = this.score;
  document.getElementById('etxt').textContent = this.mons.filter(function(m) { return !m.dead; }).length;

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

  document.getElementById('lvlmap').textContent = '[' + Array.from({length: 50}, function(_, i) {
    return i < G.lv ? '■' : i === G.lv ? '◆' : '□';
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
    var fsz = m.isGuardian ? 32 : 24;
    ctx.font = fsz + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(m.e, m.x, m.y);
    if (m.isGuardian) { ctx.font = '13px serif'; ctx.fillText('💀', m.x+14, m.y-18); }
    var bw = m.isGuardian ? 50 : 34;
    var bx = m.x - bw/2, by = m.y - (m.isGuardian ? 30 : 22);
    ctx.fillStyle = '#500'; ctx.fillRect(bx, by, bw, 6);
    ctx.fillStyle = m.isGuardian ? '#ff8800' : '#f44';
    ctx.fillRect(bx, by, Math.max(0, bw*(m.hp/m.mhp)), 6);
  });

  var p = this.p;
  if (!(p.inv > 0 && Math.floor(p.inv/80) % 2 === 0)) {
    ctx.save();
    if (p.dir === -1) { ctx.scale(-1, 1); ctx.translate(-canvas.width, 0); }
    var px2 = p.dir === -1 ? canvas.width - p.x : p.x;
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🐻', px2, p.y);
    if (p.atk && this.aa > 0) { ctx.font = '16px serif'; ctx.fillText('⚔️', px2+24, p.y-8); }
    ctx.restore();
  }

  this.pets.forEach(function(pt) {
    if (pt.x === undefined || pt.dead) return;
    ctx.font = '14px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(pt.e, pt.x, pt.y);
    if (pt.mhp && pt.hp < pt.mhp) {
      var bw = 22, bx = pt.x - bw/2, by = pt.y - 14;
      ctx.fillStyle = '#500'; ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = '#44ff66'; ctx.fillRect(bx, by, Math.max(0, bw * (pt.hp/pt.mhp)), 3);
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
    ctx.fillText('Arrow keys / WASD = move   SPACE = attack', canvas.width/2, canvas.height-49);
    ctx.fillText('Kill 💀 guardian → ⚔️ attack 📦 chest to open it & get a wild pet!', canvas.width/2, canvas.height-30);
  } else if (Date.now() - this.t0 >= 9000) {
    this.help = false;
  }
};

// ── Audio engine (Web Audio API, no files needed) ──────────────────────────
var _AC = null;
function ac() {
  if (!_AC) _AC = new (window.AudioContext || window.webkitAudioContext)();
  return _AC;
}

function sndKill() {
  try {
    var c = ac(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
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
      o.connect(g); g.connect(c.destination);
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
      o.connect(g); g.connect(c.destination);
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

function openShop()  { if (!G || G.dead || G.win) return; G.open = true; renderShop(); document.getElementById('ov').style.display = 'flex'; }
function closeShop() { if (!G) return; G.open = false; document.getElementById('ov').style.display = 'none'; }

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
      var ca    = G.gems < pt.cost;
      var badge = total > 0 ? '<div class="owned-badge">x' + total + '</div>' : '';
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

function buyUpgrade(id) {
  var up = UPGRADES.find(function(u) { return u.id === id; });
  if (!up || G.gems < up.cost) return;
  if (up.max && (G.upg[id] || 0) >= up.max) return;
  G.gems -= up.cost;
  G.upg[id] = (G.upg[id] || 0) + 1;
  sndBuyPet();
  renderShop();
}

function buyPet(id) {
  var pt = PETS.find(function(p) { return p.id === id; });
  if (!pt || G.gems < pt.cost) return;
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
  if (G.arenaMode) {
    var bredPets = (G.pets || []).filter(function(p) {
      return !G.arenaInitialPetUIDs || !G.arenaInitialPetUIDs[p.uid];
    });
    if (window.META_onArenaEnd) window.META_onArenaEnd(won, bredPets);
    else if (window.showHub) window.showHub();
  } else if (G.workMode) {
    if (window.META_onWorkEnd) window.META_onWorkEnd(G.workEmployer || '');
    else if (window.showHub) window.showHub();
  } else if (window.META_onRunEnd) {
    window.META_onRunEnd(won, G.pets ? G.pets.slice() : [], (G.lv || 0) + (won ? 1 : 0));
  } else {
    restart();
  }
}

window.META_startGame = function (config) {
  G = new Game();
  if (!config) return;
  if (config.speed)   G.upg.speed   += config.speed;
  if (config.attack)  G.upg.attack  += config.attack  * 2;
  if (config.petluck) G.upg.petluck += config.petluck * 2;
  for (var i = 0; i < (config.potion || 0); i++) { G.p.mhp += 30; G.p.hp = Math.min(G.p.hp + 30, G.p.mhp); }
};

window.META_startWork = function (employerName, employerOnline) {
  G = new Game();
  G.workMode     = true;
  G.workEmployer = employerName;
  if (window.META_showChatIfOnline) window.META_showChatIfOnline(employerName, employerOnline);
};

window.META_startArena = function (myPets, oppPets, oppName) {
  G = new Game();
  G.arenaMode = true;
  G.chest = null; G.chestPet = null; G.alreadyOwned = true;

  // Add home pets to the player's party
  var now = Date.now();
  (myPets || []).forEach(function (p, i) {
    var inst = {}, k;
    for (k in p) inst[k] = p[k];
    inst.uid = p.id + '_arena_' + now + '_' + i;
    inst.mhp = petMaxHp(inst); inst.hp = inst.mhp; inst.dead = false;
    inst.wdx = 0; inst.wdy = 0; inst.wtim = 0; inst.healMode = false;
    var ang = (i / Math.max(1, myPets.length)) * Math.PI * 2;
    inst.x = G.p.x + Math.cos(ang) * 55; inst.y = G.p.y + Math.sin(ang) * 40;
    G.patk[inst.uid] = now;
    if (p.hi > 0) G.ptim[inst.uid] = now;
    G.pets.push(inst);
  });

  // Convert opponent pets into arena monsters
  var arenaMons = [];
  (oppPets || []).forEach(function (p) {
    var hp  = Math.max(80,  (p.atk || 0) * 4 + (p.heal || 0) * 3 + Math.round((p.sc || 0) * 200) + 80);
    var atk = Math.max(8,   (p.atk || 0) + Math.round((p.sc || 0) * 40));
    var pos = G.rf();
    arenaMons.push({
      t: p.n, e: p.e, hp: hp, mhp: hp, atk: atk, spd: 80 + Math.floor(Math.random() * 40),
      gem: 0, x: pos.x, y: pos.y, at: 0, pat: 0, mt: 0, dx: 0, dy: 0, dead: false
    });
  });

  // Opponent player as boss
  var bossHp = 300 + (oppPets || []).length * 60;
  var bossPos = G.rf();
  arenaMons.push({
    t: oppName, e: '👤', hp: bossHp, mhp: bossHp, atk: 22, spd: 95,
    gem: 0, x: bossPos.x, y: bossPos.y, at: 0, pat: 0, mt: 0, dx: 0, dy: 0, dead: false
  });

  G.mons = arenaMons;

  // Record which pets were brought from home so bred pets can be identified later
  G.arenaInitialPetUIDs = {};
  G.pets.forEach(function(p) { G.arenaInitialPetUIDs[p.uid] = true; });

  var el = document.getElementById('banner');
  el.textContent = '⚔️ ARENA vs ' + oppName;
  el.style.opacity = '1';
  setTimeout(function () { el.style.opacity = '0'; }, 2000);
};

var last = 0;
function loop(ts) {
  var dt = Math.min((ts - last) / 1000, .05);
  last = ts;
  if (G) { G.update(dt); ctx.clearRect(0, 0, canvas.width, canvas.height); G.draw(); }
  requestAnimationFrame(loop);
}
rsz(); requestAnimationFrame(function(ts) { last = ts; loop(ts); });
