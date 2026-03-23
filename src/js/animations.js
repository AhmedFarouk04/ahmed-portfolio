export function initAnimations() {
  // 1. Scroll Progress & Back To Top
  const bar = document.getElementById("scroll-bar");
  const btt = document.getElementById("btt");

  window.addEventListener("scroll", () => {
    const pct =
      (window.scrollY / (document.documentElement.scrollHeight - innerHeight)) *
      100;
    if (bar) bar.style.width = pct + "%";
    if (btt) btt.classList.toggle("show", window.scrollY > 400);
  });

  // 2. Hero Entrance
  window.addEventListener("load", () => {
    const heroLeft = document.querySelector(".hero-left");
    const heroRight = document.querySelector(".hero-right");
    if (heroLeft) heroLeft.classList.add("go");
    if (heroRight) heroRight.classList.add("go");
    runCounters();
  });

  // 3. Stat Counters
  function runCounters() {
    document.querySelectorAll(".stat-num").forEach((el) => {
      const target = +el.dataset.count;
      const suf = el.dataset.suf || "";
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suf;
        if (cur >= target) clearInterval(id);
      }, 28);
    });
  }

  // 4. Scroll Reveal (Intersection Observer)
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("vis");
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));

  // 5. Active Nav Highlight
  const sections = document.querySelectorAll("section, [id]");
  const links = document.querySelectorAll(".nav-links a");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => {
            l.classList.toggle(
              "active",
              l.getAttribute("href") === "#" + e.target.id,
            );
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" },
  );

  sections.forEach((s) => navObserver.observe(s));
}
