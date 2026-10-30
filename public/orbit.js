/* studio ez — orbiting project tiles (landing page)
   Tiles come from projects.js. They travel round an ellipse, slow down
   on hover or focus, and open the project on work.html when clicked.
   On phones the first tap shows the title, the second tap opens it. */
(function () {
  var list = document.getElementById("orbit");
  var pauseBtn = document.getElementById("pause");
  if (!list || !window.PROJECTS) return;

  // build one tile per image listed in "tiles"
  PROJECTS.forEach(function (p) {
    (p.tiles || []).forEach(function (src) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "key";
      a.href = "work.html#" + p.id;
      a.setAttribute("aria-label", p.title + ", " + p.type);
      a.innerHTML =
        '<span class="cap"><img alt="" decoding="async" width="400" height="500">' +
        '<span class="tag"><b></b><i></i></span></span>';
      a.querySelector("img").src = src;
      a.querySelector("b").textContent = p.title;
      a.querySelector("i").textContent = p.type;
      li.appendChild(a);
      list.appendChild(li);
    });
  });

  var items = Array.prototype.slice.call(list.children);
  var n = items.length;
  if (!n) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none)").matches;
  var TURN = 70; // seconds for one full turn

  // ----- the 3D ring -----
  // The tiles sit on a circle in 3D space. The circle is tilted towards the
  // viewer (and rolled on its side on phones), then projected with a simple
  // camera, so tiles at the front are bigger and brighter and tiles at the
  // back are smaller and dimmer. Tiles always face the viewer.
  var W, H, cx, cy, ringY, R, TILT, ROLL, F, TW, TH;
  var BASE = 0.62;                 // tile size relative to the CSS width (set in measure)
  var SAMPLES = 36;

  function project(a, k) {
    var x = Math.cos(a) * R;
    var z = Math.sin(a) * R;                   // + is towards the viewer
    var y = z * Math.sin(TILT);                // the near side of the ring sits lower
    var zc = z * Math.cos(TILT);
    var s = F / (F - zc);                      // perspective
    var px = x * s, py = y * s;
    var cr = Math.cos(ROLL), sr = Math.sin(ROLL);
    return { x: (px * cr - py * sr) * k, y: (px * sr + py * cr) * k, s: s, depth: (zc / R + 1) / 2, a: a };
  }

  function fits() {
    var padX = 12, padTop = 84, padBot = 16;
    for (var i = 0; i < SAMPLES; i++) {
      var p = project(i / SAMPLES * Math.PI * 2, 1);
      var hw = TW * BASE * p.s / 2, hh = TH * BASE * p.s / 2;
      if (Math.abs(p.x) + hw > W / 2 - padX) return false;
      if (p.y + hh > H / 2 - padBot) return false;
      if (-p.y - hh < -(H / 2 - padTop)) return false;
    }
    return true;
  }

  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    cx = W / 2; cy = H / 2;
    var portrait = H > W * 1.05;
    TW = items[0] ? items[0].offsetWidth || 150 : 150;
    TH = TW * 1.25;
    BASE = portrait ? 0.8 : 0.62;
    TILT = portrait ? 0.34 : 0.5;
    ROLL = portrait ? 1.45 : -0.1;
    R = Math.max(W, H) * 0.5;
    for (var n2 = 0; n2 < 80 && R > 60; n2++) {
      F = R * 3;
      if (fits()) break;
      R *= 0.97;
    }
    F = R * 3;
    // lift the whole ring so its visual middle sits on the text, not below it
    var top = 1e9, bot = -1e9;
    for (var q = 0; q < SAMPLES; q++) {
      var pq = project(q / SAMPLES * Math.PI * 2, 1);
      top = Math.min(top, pq.y - TH * BASE * pq.s / 2);
      bot = Math.max(bot, pq.y + TH * BASE * pq.s / 2);
    }
    var mid = (top + bot) / 2;                                   // > 0 when the ring hangs low
    var room = (cy + top) - 84;                                  // space above the ring before the menu
    ringY = cy - Math.max(0, Math.min(mid, room));
  }

  var angle = -Math.PI / 2 + 0.35;
  var speed = 1, target = 1;
  var intro = reduce ? 1 : 0;
  var waiting = document.documentElement.classList.contains("intro"); // hold until the start page opens
  var t0 = performance.now();
  window.addEventListener("ez-reveal", function () { waiting = false; last = performance.now(); });
  var userPaused = false, hovering = 0, openTile = null;
  var last = performance.now();
  var raf = 0;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function place() {
    var k = ease(intro);
    var cr = Math.cos(ROLL), sr = Math.sin(ROLL);
    for (var i = 0; i < n; i++) {
      var li = items[i];
      var p = project(angle + (i / n) * Math.PI * 2, k);
      var hot = li === openTile || li.dataset.hot;
      // turn the card slightly towards the middle, like a carousel; flat when hovered so it is easy to read
      li._turn = (li._turn == null ? 1 : li._turn) + ((hot ? 0 : 1) - (li._turn == null ? 1 : li._turn)) * 0.25;
      var c = Math.cos(p.a) * li._turn * 22;
      var ry = (-c * cr).toFixed(1), rx = (c * sr).toFixed(1);
      var sc = (BASE * p.s * (hot ? 1 : 1)).toFixed(3);
      li.style.transform = "translate(" + (cx + p.x).toFixed(1) + "px," + (ringY + p.y).toFixed(1) + "px) translate(-50%,-50%) perspective(900px) rotateY(" + ry + "deg) rotateX(" + rx + "deg) scale(" + sc + ")";
      li.style.zIndex = Math.round(p.depth * 90) + (hot ? 300 : 0);
      li.style.opacity = (0.62 + 0.38 * p.depth).toFixed(2);
    }
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (waiting && now - t0 > 7500) waiting = false;
    if (!waiting && intro < 1) intro = Math.min(1, intro + dt / 1.3);
    target = (userPaused || hovering > 0 || openTile) ? 0 : 1;
    speed += (target - speed) * Math.min(1, dt * 6);
    angle += speed * dt * Math.PI * 2 / TURN;
    place();
    raf = requestAnimationFrame(frame);
  }

  measure();
  window.addEventListener("resize", function () { measure(); place(); });
  place();

  if (reduce) {
    if (pauseBtn) pauseBtn.hidden = true;
  } else {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () { last = performance.now(); });
  }

  // hover / focus pauses the orbit and lifts the tile above the others
  items.forEach(function (li) {
    var a = li.firstChild;
    li.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering++; li.dataset.hot = "1"; place();
    });
    li.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering = Math.max(0, hovering - 1); delete li.dataset.hot; place();
    });
    a.addEventListener("focus", function () { hovering++; li.dataset.hot = "1"; place(); });
    a.addEventListener("blur", function () { hovering = Math.max(0, hovering - 1); delete li.dataset.hot; place(); });

    // phones: first tap reveals, second tap opens
    a.addEventListener("click", function (e) {
      if (!touch) return;
      if (openTile !== li) {
        e.preventDefault();
        if (openTile) openTile.classList.remove("is-open");
        openTile = li; li.classList.add("is-open"); place();
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (openTile && !openTile.contains(e.target)) {
      openTile.classList.remove("is-open"); openTile = null; place();
    }
  });

  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.textContent = userPaused ? "Resume motion" : "Pause motion";
    });
  }
})();
