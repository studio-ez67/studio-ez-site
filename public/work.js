/* studio ez — work page
   Builds the filter buttons, the project cards and the project window
   from projects.js. Links like work.html#gta open that project. */
(function () {
  var data = window.PROJECTS || [];
  var grid = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var dlg = document.getElementById("project");
  var pText = document.getElementById("p-text");
  var pGallery = document.getElementById("p-gallery");
  if (!grid || !filters || !dlg) return;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ----- cards -----
  data.forEach(function (p, idx) {
    var li = el("li");
    li.style.setProperty("--i", idx);
    li.dataset.type = p.type;
    var btn = el("button", "card");
    btn.type = "button";
    btn.dataset.id = p.id;
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-label", p.title + ", " + p.type);

    var shot = el("span", "shot");
    var img = el("img");
    img.src = p.cover; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
    if (p.focus) img.style.objectPosition = p.focus;
    img.width = 800; img.height = 600;
    var badge = el("span", "badge", p.type);
    var over = el("span", "over");
    over.appendChild(el("span", null, p.title));
    shot.appendChild(img); shot.appendChild(badge); shot.appendChild(over);

    btn.appendChild(shot);
    li.appendChild(btn);
    grid.appendChild(li);
    btn.addEventListener("click", function () { openProject(p.id, btn); });
  });

  // ----- filters -----
  var types = [];
  data.forEach(function (p) { if (types.indexOf(p.type) < 0) types.push(p.type); });
  var count = document.createElement("p");
  count.className = "count";
  count.setAttribute("aria-live", "polite");

  function applyFilter(type) {
    var shown = 0;
    Array.prototype.forEach.call(grid.children, function (li) {
      var on = type === "All" || li.dataset.type === type;
      li.hidden = !on;
      if (on) shown++;
    });
    Array.prototype.forEach.call(filters.querySelectorAll(".chip"), function (c) {
      c.setAttribute("aria-pressed", String(c.dataset.type === type));
    });
    count.innerHTML = "";
    var num = document.createElement("span");
    num.textContent = shown < 10 ? "0" + shown : String(shown);
    count.appendChild(num);
    count.appendChild(document.createTextNode(shown === 1 ? " project" : " projects"));
  }

  ["All"].concat(types).forEach(function (t) {
    var c = el("button", "chip", t);
    c.type = "button"; c.dataset.type = t;
    c.addEventListener("click", function () { applyFilter(t); });
    filters.appendChild(c);
  });
  filters.appendChild(count);
  applyFilter("All");

  // ----- project window -----
  function openProject(id, opener) {
    var p = data.filter(function (x) { return x.id === id; })[0];
    if (!p) return;

    pText.innerHTML = "";
    var h = el("h2", null, p.title); h.id = "p-title";
    pText.appendChild(h);
    pText.appendChild(el("p", "p-type", p.year ? p.type + ", " + p.year : p.type));

    function block(label, text) {
      if (!text) return;
      pText.appendChild(el("h3", null, label));
      pText.appendChild(el("p", null, text));
    }
    block("For", p.client);
    block("The brief", p.brief);
    block("The result", p.outcome);
    if (p.did && p.did.length) {
      pText.appendChild(el("h3", null, "What we did"));
      var ul = el("ul");
      p.did.forEach(function (d) { ul.appendChild(el("li", null, d)); });
      pText.appendChild(ul);
    }
    var cta = el("a", "btn btn-dark", "Talk about a project");
    cta.href = "contact.html";
    pText.appendChild(cta);

    pGallery.innerHTML = "";
    p.images.forEach(function (pair, i) {
      var im = el("img");
      im.src = pair[0]; im.alt = pair[1]; im.decoding = "async";
      if (i > 1) im.loading = "lazy";
      pGallery.appendChild(im);
    });

    dlg.querySelector(".p-inner").scrollTop = 0;
    if (!dlg.open) dlg.showModal();
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
  }

  function closeProject() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener("close", function () {
    history.replaceState(null, "", location.pathname + location.search);
  });
  document.getElementById("p-close").addEventListener("click", closeProject);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeProject(); });

  // ----- open from a link such as work.html#gta -----
  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var card = grid.querySelector('[data-id="' + id + '"]');
    if (!card) return;
    applyFilter("All");
    openProject(id, card);
  }
  fromHash();
  window.addEventListener("hashchange", function () {
    if (!location.hash) return;
    fromHash();
  });
})();
