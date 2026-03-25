export function initCursor() {
  const dot = document.getElementById("cDot");
  const ring = document.getElementById("cRing");

  if (!dot || !ring) return;

  dot.style.cssText += ";position:fixed;left:0;top:0;pointer-events:none;";
  ring.style.cssText += ";position:fixed;left:0;top:0;pointer-events:none;";

  let mx = 0,
    my = 0;
  let rx = 0,
    ry = 0;

  document.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    },
    { passive: true },
  );

  function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  }

  loop();

  // Hover effects
  document.querySelectorAll("a, button, .filter-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("ch"), {
      passive: true,
    });
    el.addEventListener(
      "mouseleave",
      () => document.body.classList.remove("ch"),
      { passive: true },
    );
  });
}
