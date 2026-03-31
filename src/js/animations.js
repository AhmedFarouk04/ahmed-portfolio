export function initAnimations() {
  // 1. Scroll Progress & Back To Top (Optimized with requestAnimationFrame)
  const bar = document.getElementById("scroll-bar");
  const btt = document.getElementById("btt");
  let isScrolling = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          // حساب النسبة المئوية
          const scrollTotal =
            document.documentElement.scrollHeight - window.innerHeight;
          const pct = (window.scrollY / scrollTotal) * 100;

          if (bar) bar.style.width = `${pct}%`;
          if (btt) btt.classList.toggle("show", window.scrollY > 400);

          isScrolling = false;
        });
        isScrolling = true;
      }
    },
    { passive: true },
  );

  // 2. Hero Entrance (Triggered instantly without waiting for images to avoid delay)
  const heroLeft = document.querySelector(".hero-left");
  const heroRight = document.querySelector(".hero-right");
  if (heroLeft) heroLeft.classList.add("go");
  if (heroRight) heroRight.classList.add("go");

  // 3. Scroll Reveal (Intersection Observer - Excellent practice)
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          observer.unobserve(e.target); // التوقف عن المراقبة بعد الظهور لتوفير الموارد
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));

  // 4. Stat Counters (Optimized with requestAnimationFrame & IntersectionObserver)
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  // مراقبة قسم العدادات فقط (استبدل .stats-container بالكلاس أو الآي دي الخاص بقسمك)
  const statsContainer = document.querySelector(".stats-container");
  if (statsContainer) statsObserver.observe(statsContainer);

  function runCounters(container) {
    container.querySelectorAll(".stat-num").forEach((el) => {
      const targetStr = el.dataset.count || "0";
      const target = parseFloat(targetStr);
      const suf = el.dataset.suffix || "";
      const isDecimal = targetStr.includes(".");

      let startTimestamp = null;
      const duration = 1500; // مدة الأنيميشن بالمللي ثانية (1.5 ثانية)

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function (OutExpo) لجعل العداد يبطئ في النهاية بشكل أنيق
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = easeProgress * target;

        if (isDecimal) {
          el.textContent = current.toFixed(2) + suf;
        } else {
          el.textContent = Math.floor(current) + suf;
        }

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // ضمان وصول الرقم للقيمة الدقيقة في النهاية
          el.textContent = isDecimal ? target.toFixed(2) + suf : target + suf;
        }
      };

      window.requestAnimationFrame(step);
    });
  }
}
