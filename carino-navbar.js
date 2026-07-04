/* ============================================================
   carino-navbar.js — the shared Carino navbar, self-injecting.
   ------------------------------------------------------------
   Drop this file into any Carino Systems project and include it:

     <script src="carino-navbar.js" data-app="AppName" defer></script>

   It injects its own (scoped) styles + the canonical top-header
   markup, then runs the live clock, greeting and the "Status"
   diagnostics dropdown. Fully self-contained — no external deps,
   no dependency on the app's own CSS. All styles are scoped under
   #carinoNav so nothing leaks into (or clashes with) the app.
   ============================================================ */
(function () {
  'use strict';

  var TAG = (document.currentScript && document.currentScript.getAttribute('data-app')) || '';

  var CSS = ''
    + '#carinoNav{--cn-accent:#eab308;--cn-bg:#050505;--cn-border:#262626;--cn-text:#fff;--cn-muted:#8a8a8a;'
    + '--cn-mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;'
    + '--cn-sans:"IBM Plex Sans",system-ui,-apple-system,sans-serif;'
    + 'height:60px;flex-shrink:0;box-sizing:border-box;background:linear-gradient(180deg,#0f0f0f 0%,#050505 100%);'
    + 'border-bottom:1px solid var(--cn-border);display:flex;align-items:center;justify-content:space-between;'
    + 'gap:16px;padding:0 20px;position:relative;z-index:2147483000;font-family:var(--cn-sans);}'
    + '#carinoNav *,#carinoNav *::before,#carinoNav *::after{box-sizing:border-box;}'
    + '#carinoNav .cn-left{display:flex;align-items:center;gap:18px;min-width:0;flex:1 1 auto;overflow:hidden;}'
    + '#carinoNav .cn-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}'
    + '#carinoNav .brand-name{font-family:"Red Hat Display",var(--cn-sans);font-weight:900;font-size:1.5rem;line-height:1;'
    + 'background:linear-gradient(130deg,#fef08a 0%,#eab308 50%,#b45309 100%);-webkit-background-clip:text;background-clip:text;'
    + '-webkit-text-fill-color:transparent;text-decoration:none;white-space:nowrap;cursor:pointer;}'
    + '#carinoNav .app-tag{-webkit-text-fill-color:var(--cn-accent);color:var(--cn-accent);font-family:var(--cn-mono);'
    + 'font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--cn-border);'
    + 'border-radius:4px;padding:3px 6px;margin-left:10px;vertical-align:middle;}'
    + '#carinoNav .app-tag:empty{display:none;}'
    + '#carinoNav .header-clock{display:flex;align-items:baseline;gap:8px;border-left:1px solid var(--cn-border);padding-left:18px;min-width:0;overflow:hidden;}'
    + '#carinoNav .clock-time{font-family:var(--cn-mono);font-size:1.05rem;font-weight:700;color:var(--cn-text);flex-shrink:0;}'
    + '#carinoNav .clock-tz{font-family:var(--cn-mono);font-size:.58rem;font-weight:700;color:#050505;background:var(--cn-accent);padding:2px 5px;border-radius:3px;flex-shrink:0;}'
    + '#carinoNav .brand-greeting{font-family:var(--cn-mono);font-size:.68rem;color:var(--cn-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}'
    + '#carinoNav .social-row{display:flex;gap:8px;}'
    + '#carinoNav .icon-btn{width:32px;height:32px;border:1px solid var(--cn-border);border-radius:4px;display:flex;'
    + 'align-items:center;justify-content:center;color:var(--cn-muted);transition:.2s;text-decoration:none;background:transparent;cursor:pointer;}'
    + '#carinoNav .icon-btn:hover{border-color:var(--cn-accent);color:#050505;background:var(--cn-accent);transform:translateY(-2px);box-shadow:0 4px 12px rgba(234,179,8,.18);}'
    + '#carinoNav .icon-btn svg{width:15px;height:15px;}'
    + '#carinoNav .status-toggle{display:flex;align-items:center;gap:8px;background:transparent;border:1px solid var(--cn-border);'
    + 'color:var(--cn-muted);font-family:var(--cn-mono);font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;'
    + 'padding:0 12px;height:32px;border-radius:4px;cursor:pointer;transition:.2s;}'
    + '#carinoNav .status-toggle:hover{border-color:var(--cn-accent);color:var(--cn-accent);background:rgba(234,179,8,.06);}'
    + '#carinoNav .pulse-dot{width:6px;height:6px;border-radius:50%;background:var(--cn-accent);box-shadow:0 0 8px var(--cn-accent);animation:cnPulse 2s ease-in-out infinite;}'
    + '@keyframes cnPulse{0%,100%{opacity:1;}50%{opacity:.35;}}'
    + '#carinoNav .diag-dropdown{position:absolute;top:calc(100% - 4px);right:16px;width:280px;background:#111;border:1px solid var(--cn-border);'
    + 'border-radius:8px;padding:16px;box-shadow:0 18px 40px rgba(0,0,0,.6);opacity:0;visibility:hidden;transform:translateY(-8px);transition:.18s;z-index:2147483001;}'
    + '#carinoNav .diag-dropdown.open{opacity:1;visibility:visible;transform:translateY(0);}'
    + '#carinoNav .diag-section{font-family:var(--cn-mono);font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--cn-muted);margin:12px 0 6px;border-bottom:1px solid var(--cn-border);padding-bottom:4px;}'
    + '#carinoNav .diag-section:first-child{margin-top:0;}'
    + '#carinoNav .diag-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:.78rem;padding:3px 0;}'
    + '#carinoNav .diag-lbl{color:var(--cn-muted);flex-shrink:0;}'
    + '#carinoNav .diag-val{font-family:var(--cn-mono);color:var(--cn-text);text-align:right;word-break:break-all;}'
    + '#carinoNav .cn-right{gap:12px;min-width:0;}'
    + '#carinoNav .cn-actions{display:flex;align-items:center;gap:8px;flex-wrap:nowrap;min-width:0;}'
    + '#carinoNav .cn-actions + .social-row{border-left:1px solid var(--cn-border);padding-left:12px;}'
    + '@media(max-width:900px){#carinoNav .header-clock{display:none;}}'
    + '@media(max-width:640px){#carinoNav .app-tag,#carinoNav .status-toggle span{display:none;}}';

  var GH = 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22';
  var LI = 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z';

  var MARKUP = ''
    + '<header class="top-header" id="carinoNav">'
    + '<div class="cn-left">'
    + '<a class="brand-name" href="https://carino.systems/" title="Carino Systems — back to hub">Carino<span class="app-tag"></span></a>'
    + '<div class="header-clock" aria-hidden="true">'
    + '<span class="clock-time" id="cnClock">00:00:00</span>'
    + '<span class="clock-tz" id="cnTz">LOCAL</span>'
    + '<span class="brand-greeting" id="cnGreeting">Ready.</span>'
    + '</div></div>'
    + '<div class="cn-right">'
    + '<div class="social-row">'
    + '<a href="https://github.com/MiguelCarino" target="_blank" rel="noopener" class="icon-btn" title="GitHub" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="' + GH + '"></path></svg></a>'
    + '<a href="https://www.linkedin.com/in/miguelcarino94/" target="_blank" rel="noopener" class="icon-btn" title="LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="' + LI + '"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>'
    + '</div>'
    + '<button class="status-toggle" id="cnToggle" title="Status" aria-label="Status" aria-haspopup="true" aria-expanded="false" aria-controls="cnBox"><span>Status</span><div class="pulse-dot"></div></button>'
    + '</div>'
    + '<div class="diag-dropdown" id="cnBox">'
    + '<div class="diag-section">Session</div>'
    + '<div class="diag-row"><span class="diag-lbl">Local time</span><span class="diag-val" id="cnDiagClock">--:--:--</span></div>'
    + '<div class="diag-row"><span class="diag-lbl">Time zone</span><span class="diag-val" id="cnDiagTz">--</span></div>'
    + '<div class="diag-row"><span class="diag-lbl">UTC</span><span class="diag-val" id="cnDiagUtc">--:--</span></div>'
    + '<div class="diag-section">Client</div>'
    + '<div class="diag-row"><span class="diag-lbl">Status</span><span class="diag-val" id="cnDiagNet">--</span></div>'
    + '<div class="diag-row"><span class="diag-lbl">Viewport</span><span class="diag-val" id="cnDiagVp">--</span></div>'
    + '<div class="diag-row"><span class="diag-lbl">Platform</span><span class="diag-val" id="cnDiagPlat">--</span></div>'
    + '<div class="diag-row"><span class="diag-lbl">Language</span><span class="diag-val" id="cnDiagLang">--</span></div>'
    + '</div>'
    + '</header>';

  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var d = new Date();
    var t = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    set('cnClock', t); set('cnDiagClock', t);
    set('cnDiagUtc', pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + 'Z');
    var tz;
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop() || 'LOCAL'; } catch (e) { tz = 'LOCAL'; }
    set('cnTz', tz); set('cnDiagTz', tz);
    var h = d.getHours();
    set('cnGreeting', h < 5 ? 'Late shift.' : h < 12 ? 'Good morning.' : h < 18 ? 'Good afternoon.' : 'Good evening.');
  }

  function updateClientDiag() {
    set('cnDiagNet', navigator.onLine ? 'Online' : 'Offline');
    set('cnDiagVp', window.innerWidth + '×' + window.innerHeight);
    set('cnDiagPlat', navigator.platform || '--');
    set('cnDiagLang', navigator.language || '--');
  }

  function wireDiag() {
    var toggle = document.getElementById('cnToggle');
    var box = document.getElementById('cnBox');
    if (!toggle || !box) return;
    function aria() { toggle.setAttribute('aria-expanded', box.classList.contains('open') ? 'true' : 'false'); }
    toggle.addEventListener('click', function (e) { e.stopPropagation(); updateClientDiag(); box.classList.toggle('open'); aria(); });
    document.addEventListener('click', function (e) { if (box.classList.contains('open') && !box.contains(e.target) && !toggle.contains(e.target)) { box.classList.remove('open'); aria(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) { box.classList.remove('open'); aria(); } });
    window.addEventListener('resize', updateClientDiag);
    window.addEventListener('online', updateClientDiag);
    window.addEventListener('offline', updateClientDiag);
  }

  // Move an app's own header controls INTO the navbar's right cluster so there
  // is a single top bar. The real DOM nodes are moved (not cloned), so their
  // event handlers and ids are preserved. An app can opt in explicitly with
  // [data-carino-actions] (the controls) + [data-carino-strip] (the now-empty
  // wrapper to delete); otherwise we auto-detect the leftover `header.cs-header`
  // bar that this migration leaves as a direct child of <body>.
  function relocateActions(nav) {
    var actions = document.querySelector('[data-carino-actions]');
    var strip = document.querySelector('[data-carino-strip]');
    if (!actions) {
      var old = document.querySelector('body > header.cs-header');
      if (old) { actions = old.querySelector('.cs-right') || old; strip = old; }
    }
    if (actions) {
      actions.classList.add('cn-actions');
      var right = nav.querySelector('.cn-right');
      right.insertBefore(actions, right.querySelector('.social-row'));
    }
    if (strip && strip !== actions && strip.parentNode) strip.remove();
  }

  function inject() {
    if (document.getElementById('carinoNav')) return;
    var style = document.createElement('style');
    style.id = 'carino-nav-style';
    style.textContent = CSS;
    document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.innerHTML = MARKUP;
    var nav = wrap.firstElementChild;
    document.body.insertBefore(nav, document.body.firstChild);
    if (TAG) { var t = nav.querySelector('.app-tag'); if (t) t.textContent = TAG; }
    relocateActions(nav);
    wireDiag();
    tick();
    setInterval(tick, 1000);
    updateClientDiag();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
