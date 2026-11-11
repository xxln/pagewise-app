// English / 中文 switch: the browser's language decides first; a choice is remembered.
(function () {
  var root = document.documentElement;
  function stored() { try { return localStorage.getItem('pagewise-lang'); } catch (e) { return null; } }
  function remember(v) { try { localStorage.setItem('pagewise-lang', v); } catch (e) { /* private mode */ } }
  function set(lang) {
    root.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var t = document.querySelector('meta[name="title-' + lang + '"]');
    if (t) document.title = t.content;
    // Subtitles: Chinese shown on the Chinese page (the narration is English); off on the English page.
    document.querySelectorAll('video').forEach(function (v) {
      for (var i = 0; i < v.textTracks.length; i++) {
        var tr = v.textTracks[i];
        tr.mode = (lang === 'zh' && tr.language === 'zh') ? 'showing' : 'disabled';
      }
    });
  }
  // ?lang=zh or ?lang=en in a shared link wins, then a remembered choice, then the browser's language.
  var param = (location.search.match(/[?&]lang=(zh|en)\b/) || [])[1];
  var start = param || stored() || ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en');
  set(start);
  document.addEventListener('DOMContentLoaded', function () {
    set(start);
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { set(b.dataset.lang); remember(b.dataset.lang); });
    });
    // The big play button starts the introduction; it hides while the video plays.
    document.querySelectorAll('.video').forEach(function (box) {
      var v = box.querySelector('video'), b = box.querySelector('.play');
      if (!v || !b) return;
      b.addEventListener('click', function () { v.play(); });
      v.addEventListener('play', function () { box.classList.add('playing'); });
      v.addEventListener('ended', function () { box.classList.remove('playing'); });
    });
    set(start);   // tracks exist now
  });
})();
