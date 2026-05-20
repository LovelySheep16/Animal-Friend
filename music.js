(function () {
  var MAP = {
    'screen-hub':        'Animal_Friend_08.mp3', // Moonlit Monster Run  — hub
    'screen-meta-shop':  'Animal_Friend_09.mp3', // Pasillo de Bestias   — shop
    'screen-weapons':    'Animal_Friend_04.mp3', // Labyrinth Stalker(1) — weapons
    'screen-habitats':   'Animal_Friend_06.mp3', // Maze Hunt            — nature
    'screen-servants':   'Animal_Friend_05.mp3', // Labyrinth Stalker    — workers
    'screen-dragons':    'Animal_Friend_03.mp3', // Labyrinth of Fang    — dragons
    'screen-awards':     'Animal_Friend_07.mp3', // Maze of Teeth        — awards
    'screen-characters': 'Animal_Friend_10.mp3', // Sneaky Moon Caper    — characters
    'screen-exchange':   'Animal_Friend_09.mp3', // shares w/ shop
    'screen-chests':     'Animal_Friend_10.mp3', // shares w/ characters
    'screen-food-shop':  'Animal_Friend_08.mp3', // shares w/ hub
    'screen-result':     'Animal_Friend_08.mp3', // shares w/ hub
    'game':              'Animal_Friend_02.mp3', // Labyrinth Hunt       — levels
    'game-boss':         'Animal_Friend_01.mp3', // Labyrinth Hunt(1)    — boss
  };

  var aud = new Audio();
  aud.loop = true;
  aud.volume = 0.5;
  var cur = '';
  var unlocked = false;

  function safePlay() {
    try {
      var p = aud.play();
      if (p && p['catch']) p['catch'](function () {});
    } catch (e) {}
  }

  function setTrack(file) {
    if (!file) return;
    if (file === cur && !aud.paused) return; // already playing
    cur = file;
    aud.src = file;
    safePlay();
  }

  // On first user gesture, re-attempt the track that was blocked at page load
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    document.removeEventListener('click',      unlock, true);
    document.removeEventListener('touchstart', unlock, true);
    // If audio is still paused (autoplay was blocked), restart current track
    if (cur && aud.paused) safePlay();
  }
  document.addEventListener('click',      unlock, true);
  document.addEventListener('touchstart', unlock, true);

  window.playScreenMusic = function (id) { setTrack(MAP[id] || ''); };
  window.stopMusic       = function ()   { aud.pause(); aud.currentTime = 0; cur = ''; };
})();
