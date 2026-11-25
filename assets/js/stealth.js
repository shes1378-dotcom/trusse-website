/* Stealth page: "Hear when we launch" form. Sends to the same Google Form as the waiting list. */
(function () {
  var form = document.getElementById('st-form');
  if (!form || !window.fetch || !window.URLSearchParams || !window.FormData) return;
  form.setAttribute('novalidate', '');
  var LIVE = /(^|\.)trusseai\.com$/.test(location.hostname);
  var email = document.getElementById('st-email');
  var name = document.getElementById('st-name');
  var hp = document.getElementById('st-hp');
  var err = document.getElementById('st-error');
  var btn = form.querySelector('button[type="submit"]');
  var wrap = document.getElementById('st-form-wrap');
  var done = document.getElementById('st-done');

  function fail(msg) {
    err.textContent = msg;
    err.hidden = false;
    email.setAttribute('aria-invalid', 'true');
    email.focus();
  }
  function show() {
    var n = name.value.trim().split(/\s+/)[0];
    document.getElementById('st-done-title').textContent = n ? 'Thank you, ' + n : 'Thank you';
    wrap.hidden = true;
    done.hidden = false;
    done.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { fail('Enter a valid email address'); return; }
    err.hidden = true;
    email.removeAttribute('aria-invalid');
    if (hp.value) { show(); return; }
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    var body = new URLSearchParams(new FormData(form));
    var send = LIVE ? fetch(form.action, { method: 'POST', mode: 'no-cors', body: body }) : Promise.resolve();
    send.then(show, function () {
      btn.disabled = false;
      btn.textContent = label;
      fail('Something went wrong. Please try again, or email contact@trusseai.com.');
    });
  });
})();
