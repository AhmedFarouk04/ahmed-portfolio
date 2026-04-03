export function initAnimations() {
  const bar = document.getElementById("scroll-bar");
  const btt = document.getElementById("btt");
  let isScrolling = false;

  const updateScrollUI = () => {
    const scrollTotal = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const pct = Math.min(window.scrollY / scrollTotal, 1);

    if (bar) {
      bar.style.transform = `scaleX(${pct})`;
    }

    if (btt) {
      btt.classList.toggle("show", window.scrollY > 400);
    }
  };

  updateScrollUI();

  window.addEventListener(
    "scroll",
    () => {
      if (isScrolling) return;

      isScrolling = true;
      window.requestAnimationFrame(() => {
        updateScrollUI();
        isScrolling = false;
      });
    },
    { passive: true },
  );

  const heroLeft = document.querySelector(".hero-left");
  const heroRight = document.querySelector(".hero-right");

  if (heroLeft) heroLeft.classList.add("go");
  if (heroRight) heroRight.classList.add("go");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("vis");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".rv").forEach((element) => {
    revealObserver.observe(element);
  });
}
