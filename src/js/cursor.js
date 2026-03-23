export function initCursor() {
  const dot = document.getElementById("cDot");
  const ring = document.getElementById("cRing");

  if (!dot || !ring) return;

  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  }

  loop();

  // Hover effects
  document.querySelectorAll("a, button, .filter-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("ch"));
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("ch"),
    );
  });
}
