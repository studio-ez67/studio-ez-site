/* studio ez — start page
   Only the logo is on screen. It pops up, then the key presses itself
   down without any help from the visitor, and the site opens from the
   key like a ripple. Shown once per visit. A click, tap or key press
   skips ahead for anyone in a hurry. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains("intro")) return;

  var intro = document.getElementById("intro");
  var ring = document.getElementById("intro-ring");
  var layer = document.getElementById("key-layer");
  var site = document.getElementById("site");
  if (!intro || !layer || !site) { html.classList.remove("intro"); return; }

  var started = false;
  site.setAttribute("inert", "");

  function onKey(e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); enter(); }
  }

  function finish() {
    document.removeEventListener("keydown", onKey);   // never keep swallowing keys after the start page
    html.classList.remove("intro", "reveal");
    html.style.removeProperty("--kx");
    html.style.removeProperty("--ky");
    html.style.removeProperty("--R");
    intro.remove();
    if (ring) ring.remove();
    try { sessionStorage.setItem("ez-intro", "1"); } catch (e) {}
  }

  function enter() {
    if (started) return;
    started = true;
    clearTimeout(autoTimer);

    // the ripple opens from the middle of the key
    var r = layer.getBoundingClientRect();
    var kx = r.left + r.width * 0.815;
    var ky = r.top + r.height * 0.5;
    var R = Math.hypot(Math.max(kx, innerWidth - kx), Math.max(ky, innerHeight - ky)) + 40;
    html.style.setProperty("--kx", kx + "px");
    html.style.setProperty("--ky", ky + "px");
    html.style.setProperty("--R", R + "px");

    layer.classList.add("pressed");               // the key goes down
    setTimeout(function () {
      layer.classList.remove("pressed");          // springs back up
      html.classList.add("reveal");               // and the site opens
      site.removeAttribute("inert");
      window.dispatchEvent(new Event("ez-reveal"));
    }, 260);
    setTimeout(finish, 260 + 1250);
  }

  intro.addEventListener("pointerdown", enter);
  document.addEventListener("keydown", onKey);
  var autoTimer = setTimeout(enter, 1700);       // logo pops (0.8s), a short beat, then it presses itself
})();
