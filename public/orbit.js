/* studio ez — orbiting project tiles (landing page)
   Tiles come from projects.js. They travel round a ring on their own, stop
   while the cursor is on a tile, and open the project on work.html when clicked.
   You can also grab the wheel anywhere and spin it by dragging; let go and it
   coasts, then drifts on by itself again. The path never changes.
   On phones the first tap shows the title, the second tap opens it. */
(function () {
  var list = document.getElementById("orbit");
  var stage = document.getElementById("stage");
  var pauseBtn = document.getElementById("pause");
  if (!list || !window.PROJECTS) return;

  // build one tile per image listed in "tiles"
  PROJECTS.forEach(function (p) {
    (p.tiles || []).forEach(function (src) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.className = "key";
      a.href = "work.html#" + p.id;
      a.draggable = false;
      a.setAttribute("aria-label", p.title + ", " + p.type);
      a.innerHTML =
        '<span class="cap"><img alt="" decoding="async" width="400" height="500" draggable="false">' +
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
  var TURN = 70; // seconds for one full turn when drifting on its own
  var TAU = Math.PI * 2;

  // ----- the 3D ring -----
  // The tiles sit on a circle in 3D space. The circle is tilted towards the
  // viewer (and rolled on its side on phones), then projected with a simple
  // camera, so tiles at the front are bigger and brighter and tiles at the
  // back are smaller and dimmer. Tiles always face the viewer.
  var W, H, cx, cy, ringY, R, TILT, ROLL, F, TW, TH;
  var BASE = 0.7;                  // tile size relative to the CSS width (set in measure)
  var PAD_TOP = 84;                // room kept clear above the ring; the menu is only in the left corner, so wide screens need less
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

  // Tiles may overlap a little: the ring is only shrunk until the tiles fit
  // on screen, never to keep them apart.
  function fits() {
    var padX = 12, padTop = PAD_TOP, padBot = 16;
    for (var i = 0; i < SAMPLES; i++) {
      var p = project(i / SAMPLES * TAU, 1);
      var hw = TW * BASE * p.s / 2, hh = TH * BASE * p.s / 2;
      if (Math.abs(p.x) + hw > W / 2 - padX) return false;
      if (p.y + hh > H / 2 - padBot) return false;
      if (-p.y - hh < -(H / 2 - padTop)) return false;
    }
    return true;
  }

  // ----- dragging: pointer position <-> position on the ring -----
  // Table of the on-screen direction (seen from the middle of the ring) of
  // each point of the ring. Looking a pointer direction up in it tells which
  // point of the ring the pointer is over, so a drag turns the wheel exactly
  // along its own path and the tile under the pointer follows it.
  var NT = 720, TA = [], TP = [];

  function buildTable() {
    var prev = 0;
    for (var i = 0; i < NT; i++) {
      var a = i / NT * TAU;
      var p = project(a, 1);
      var ph = Math.atan2(p.y, p.x);
      if (i) {
        while (ph < prev - Math.PI) ph += TAU;
        while (ph > prev + Math.PI) ph -= TAU;
      }
      TA[i] = a; TP[i] = ph; prev = ph;
    }
  }

  function phiToA(phi) {
    var base = TP[0];
    var q = phi - base;
    q -= Math.floor(q / TAU) * TAU;            // 0 .. TAU
    var target = base + q;
    var lo = 0, hi = NT - 1;
    while (lo < hi - 1) {
      var mid = (lo + hi) >> 1;
      if (TP[mid] <= target) lo = mid; else hi = mid;
    }
    var pNext = lo + 1 < NT ? TP[lo + 1] : base + TAU;
    var aNext = lo + 1 < NT ? TA[lo + 1] : TAU;
    var f = (target - TP[lo]) / ((pNext - TP[lo]) || 1);
    return TA[lo] + f * (aNext - TA[lo]);
  }

  function wrap(d) {
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    return d;
  }

  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    cx = W / 2; cy = H / 2;
    var portrait = H > W * 1.05;
    TW = items[0] ? items[0].offsetWidth || 150 : 150;
    TH = TW * 1.25;
    BASE = portrait ? 0.8 : 0.7;
    PAD_TOP = W >= 1000 ? 40 : 84;
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
      var pq = project(q / SAMPLES * TAU, 1);
      top = Math.min(top, pq.y - TH * BASE * pq.s / 2);
      bot = Math.max(bot, pq.y + TH * BASE * pq.s / 2);
    }
    var mid = (top + bot) / 2;                                   // > 0 when the ring hangs low
    var room = (cy + top) - PAD_TOP;                             // space above the ring before the menu
    ringY = cy - Math.max(0, Math.min(mid, room));
    buildTable();
  }

  var angle = -Math.PI / 2 + 0.35;
  var speed = 1, target = 1;
  var coast = 0;                   // extra spin (radians/second) left over from a flick
  var intro = reduce ? 1 : 0;
  var waiting = document.documentElement.classList.contains("intro"); // hold until the start page opens
  var t0 = performance.now();
  window.addEventListener("ez-reveal", function () { waiting = false; last = performance.now(); });
  var userPaused = false, hoverLi = null, focusLi = null, openTile = null, dragging = false;
  var last = performance.now();
  var raf = 0;

  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function place() {
    var k = ease(intro);
    var cr = Math.cos(ROLL), sr = Math.sin(ROLL);
    for (var i = 0; i < n; i++) {
      var li = items[i];
      var p = project(angle + (i / n) * TAU, k);
      var hot = li === openTile || li === hoverLi || li === focusLi;
      // turn the card slightly towards the middle, like a carousel; flat when hovered so it is easy to read
      li._turn = (li._turn == null ? 1 : li._turn) + ((hot ? 0 : 1) - (li._turn == null ? 1 : li._turn)) * 0.25;
      var c = Math.cos(p.a) * li._turn * 22;
      var ry = (-c * cr).toFixed(1), rx = (c * sr).toFixed(1);
      var sc = (BASE * p.s).toFixed(3);
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
    // the cursor on a tile, a paused wheel or a drag all hold the drifting still
    target = (userPaused || hoverLi || focusLi || openTile || dragging) ? 0 : 1;
    speed += (target - speed) * Math.min(1, dt * 6);
    if (!dragging) {
      angle += (speed * TAU / TURN + coast) * dt;
      coast *= Math.exp(-dt * 2.2);                // a flick slows down smoothly
      if (Math.abs(coast) < 0.02) coast = 0;
    }
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

  // ----- drag to spin -----
  var drag = null;                 // the pointer that is pressed on the wheel
  var suppressClick = false;

  function pointerPhi(e) { return Math.atan2(e.clientY - ringY, e.clientX - cx); }

  if (stage) {
    stage.addEventListener("pointerdown", function (e) {
      if (drag) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest && e.target.closest(".btn")) return;   // the "See all work" button is just a button
      drag = { id: e.pointerId, type: e.pointerType, x0: e.clientX, y0: e.clientY, phi: pointerPhi(e), moved: false, trail: [] };
      coast = 0;                                                   // grabbing the wheel stops it
    });

    stage.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved) {
        if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;   // still a click
        drag.moved = true; dragging = true;
        stage.classList.add("is-dragging");
        hoverLi = null;
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var dx = e.clientX - cx, dy = e.clientY - ringY;
      if (dx * dx + dy * dy < 900) return;         // too close to the middle for a direction to mean anything
      var phi = Math.atan2(dy, dx);
      var d = wrap(phiToA(phi) - phiToA(drag.phi));
      drag.phi = phi;
      angle += d;
      var now = performance.now();
      drag.trail.push({ t: now, d: d });
      while (drag.trail.length && now - drag.trail[0].t > 120) drag.trail.shift();
      place();
    });

    var endDrag = function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag; drag = null;
      if (!d.moved) return;
      dragging = false;
      stage.classList.remove("is-dragging");
      suppressClick = true;                        // the release must not open the tile under the pointer
      setTimeout(function () { suppressClick = false; }, 300);
      if (!reduce) {
        // keep the speed of the last moments of the drag and let it coast
        var now = performance.now(), sum = 0;
        d.trail.forEach(function (s) { if (now - s.t <= 120) sum += s.d; });
        var v = Math.max(-14, Math.min(14, sum / 0.12));
        coast = Math.abs(v) > 0.15 ? v : 0;
      }
      if (d.type === "mouse") {                     // the cursor may now be resting on a tile
        var el = document.elementFromPoint(e.clientX, e.clientY);
        var li = el && el.closest ? el.closest(".orbit li") : null;
        hoverLi = li || null;
      }
      place();
    };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("lostpointercapture", endDrag);
  }

  window.addEventListener("click", function (e) {
    if (suppressClick) { suppressClick = false; e.preventDefault(); e.stopPropagation(); }
  }, true);

  // no text selection, focus ring or native image drag from pressing a tile with the mouse
  list.addEventListener("mousedown", function (e) { e.preventDefault(); });

  // hover / focus pauses the orbit and lifts the tile above the others
  items.forEach(function (li) {
    var a = li.firstChild;
    li.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse" || dragging || Math.abs(coast) > 0.4) return;   // not while spinning past
      hoverLi = li; place();
    });
    li.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      if (hoverLi === li) hoverLi = null;
      place();
    });
    a.addEventListener("focus", function () { focusLi = li; place(); });
    a.addEventListener("blur", function () { if (focusLi === li) focusLi = null; place(); });

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
