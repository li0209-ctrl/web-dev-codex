(function () {
  const root = document.querySelector(".skilltree");
  if (!root) return;

  const svg = root.querySelector(".skilltree-lines");
  const g = root.querySelector(".skilltree-paths");
  const center = root.querySelector("#skilltree-center");
  const domains = Array.from(root.querySelectorAll(".skilltree-domain"));
  const skills = Array.from(root.querySelectorAll(".skilltree-skill"));

  function centerOf(el) {
    const r = root.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    return {
      x: (b.left + b.width / 2) - r.left,
      y: (b.top + b.height / 2) - r.top,
    };
  }

  function setViewBoxToPixels() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }

  // cubic bezier curve: start -> end with curved control points
  function curvePath(a, b, bend = 0.22) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    // control points: push outward perpendicular to direction for curvature
    const len = Math.max(1, Math.hypot(dx, dy));
    const nx = -dy / len;
    const ny = dx / len;

    const c1 = { x: a.x + dx * 0.35 + nx * len * bend, y: a.y + dy * 0.35 + ny * len * bend };
    const c2 = { x: a.x + dx * 0.70 + nx * len * bend, y: a.y + dy * 0.70 + ny * len * bend };

    return `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
  }

  function draw() {
    setViewBoxToPixels();
    g.innerHTML = "";

    const pCenter = centerOf(center);

    // center -> domains
    for (const d of domains) {
      const pd = centerOf(d);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", curvePath(pCenter, pd, 0.18));
      path.setAttribute("class", "skilltree-path");
      path.dataset.edge = `center->${d.dataset.id}`;
      g.appendChild(path);
    }

    // domain -> skills
    for (const s of skills) {
      const parent = s.dataset.parent;
      const d = domains.find((x) => x.dataset.id === parent);
      if (!d) continue;

      const pd = centerOf(d);
      const ps = centerOf(s);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", curvePath(pd, ps, 0.25));
      path.setAttribute("class", "skilltree-path");
      path.dataset.edge = `${parent}->${s.textContent.trim()}`;
      g.appendChild(path);
    }
  }

  function setActiveDomain(domainId, on) {
    g.querySelectorAll(".skilltree-path").forEach((p) => {
      const edge = p.dataset.edge || "";
      const hit = edge.startsWith(`center->${domainId}`) || edge.startsWith(`${domainId}->`);
      p.classList.toggle("is-active", on && hit);
    });
  }

  domains.forEach((d) => {
    d.addEventListener("mouseenter", () => setActiveDomain(d.dataset.id, true));
    d.addEventListener("mouseleave", () => setActiveDomain(d.dataset.id, false));
  });

  // redraw on resize to keep lines aligned
  window.addEventListener("resize", draw);
  window.requestAnimationFrame(draw);
})();

