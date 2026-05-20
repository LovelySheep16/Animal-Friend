(function () {
  var MAP = {
    'screen-hub':        'Animal_Friend_08.mp3',
    'screen-meta-shop':  'Animal_Friend_09.mp3',
    'screen-weapons':    'Animal_Friend_04.mp3',
    'screen-habitats':   'Animal_Friend_06.mp3',
    'screen-servants':   'Animal_Friend_05.mp3',
    'screen-dragons':    'Animal_Friend_03.mp3',
    'screen-awards':     'Animal_Friend_07.mp3',
    'screen-characters': 'Animal_Friend_10.mp3',
    'screen-exchange':   'Animal_Friend_09.mp3',
    'screen-chests':     'Animal_Friend_10.mp3',
    'screen-food-shop':  'Animal_Friend_08.mp3',
    'screen-result':     'Animal_Friend_08.mp3',
    'game':              'Animal_Friend_02.mp3',
    'game-boss':         'Animal_Friend_01.mp3',
  };

  var aud = new Audio();
  aud.loop = true;
  aud.volume = parseFloat(localStorage.getItem('af_music_vol') || '0.1');

  var cur = '', unlocked = false;

  function safePlay() {
    try {
      var p = aud.play();
      if (p && p['catch']) p['catch'](function () {});
    } catch (e) {}
  }

  function setTrack(file) {
    if (!file) return;
    if (file === cur && !aud.paused) return;
    cur = file;
    aud.src = file;
    safePlay();
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    document.removeEventListener('click',      unlock, true);
    document.removeEventListener('touchstart', unlock, true);
    if (cur && aud.paused) safePlay();
  }
  document.addEventListener('click',      unlock, true);
  document.addEventListener('touchstart', unlock, true);

  window.playScreenMusic = function (id) { setTrack(MAP[id] || ''); };
  window.stopMusic       = function ()   { aud.pause(); aud.currentTime = 0; cur = ''; };

  window.setMusicVolume = function (v) {
    aud.volume = v;
    try { localStorage.setItem('af_music_vol', String(v)); } catch (e) {}
  };

  window.getMusicVolume = function () {
    return aud.volume;
  };
})();
