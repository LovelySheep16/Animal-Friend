(function () {
  var MAP = {
    'screen-hub':        'Animal_Friend_08.mp3', // Moonlit Monster Run  — chill hub
    'screen-meta-shop':  'Animal_Friend_09.mp3', // Pasillo de Bestias   — shop
    'screen-weapons':    'Animal_Friend_04.mp3', // Labyrinth Stalker(1) — weapons
    'screen-habitats':   'Animal_Friend_06.mp3', // Maze Hunt            — nature
    'screen-servants':   'Animal_Friend_05.mp3', // Labyrinth Stalker    — workers
    'screen-dragons':    'Animal_Friend_03.mp3', // Labyrinth of Fang    — dragons
    'screen-awards':     'Animal_Friend_07.mp3', // Maze of Teeth        — achievements
    'screen-characters': 'Animal_Friend_10.mp3', // Sneaky Moon Caper    — characters
    'screen-exchange':   'Animal_Friend_09.mp3', // Pasillo de Bestias   — (shares w/ shop)
    'screen-chests':     'Animal_Friend_10.mp3', // Sneaky Moon Caper    — (shares w/ chars)
    'screen-food-shop':  'Animal_Friend_08.mp3', // Moonlit Monster Run  — (shares w/ hub)
    'screen-result':     'Animal_Friend_08.mp3', // Moonlit Monster Run  — (shares w/ hub)
    'game':              'Animal_Friend_02.mp3', // Labyrinth Hunt       — levels
    'game-boss':         'Animal_Friend_01.mp3', // Labyrinth Hunt(1)    — boss
  };

  var aud = new Audio();
  aud.loop = true;
  aud.volume = 0.5;

  window.playScreenMusic = function (screenId) {
    var file = MAP[screenId];
    if (!file) return;
    var want = file;
    // already playing this track — do nothing
    if (!aud.paused && aud.src.endsWith(want)) return;
    aud.src = want;
    aud.load();
    aud.play().catch(function () {});
  };

  window.stopMusic = function () {
    aud.pause();
    aud.currentTime = 0;
  };
})();
