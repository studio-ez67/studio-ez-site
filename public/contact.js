/* studio ez — contact page
   1. "Copy" buttons for the email address and phone number.
   2. The enquiry form builds an email in the visitor's own mail app.
      There is no server, so nothing is sent from the page itself. */
(function () {
  var TO = "studioez67@gmail.com";

  // ----- copy buttons -----
  function copyText(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove(); done(ok);
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (b) {
    b.addEventListener("click", function () {
      copyText(b.getAttribute("data-copy"), function (ok) {
        b.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
        b.classList.add("done");
        setTimeout(function () { b.textContent = b.getAttribute("data-label"); b.classList.remove("done"); }, 1800);
      });
    });
  });

  // ----- enquiry form -----
  var form = document.getElementById("enquiry");
  var status = document.getElementById("f-status");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var from = form.elements.from.value.trim();
    var msg = form.elements.msg.value.trim();
    status.textContent = "";
    if (!name) { status.textContent = "Please add your name."; form.elements.name.focus(); return; }
    if (!msg) { status.textContent = "Please tell us a little about the project."; form.elements.msg.focus(); return; }
    var needs = Array.prototype.map.call(form.querySelectorAll('input[name="need"]:checked'), function (c) { return c.value; });
    var body = "Hello studio ez,\n\n" + msg + "\n\n" +
      (needs.length ? "Interested in: " + needs.join(", ") + "\n" : "") +
      "From: " + name + (from ? " (" + from + ")" : "") + "\n";
    var href = "mailto:" + TO + "?subject=" + encodeURIComponent("Project enquiry from " + name) + "&body=" + encodeURIComponent(body);
    status.textContent = "Opening your email app. If nothing opens, email us at " + TO + ".";
    window.location.href = href;
  });
})();
