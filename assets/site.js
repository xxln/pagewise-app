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
    // No moving video for people who prefer less motion.
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('video[autoplay]').forEach(function (v) { v.pause(); v.removeAttribute('autoplay'); v.controls = true; });
    }
  });
})();
