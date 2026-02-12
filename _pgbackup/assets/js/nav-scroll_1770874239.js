(function () {
  const nav = document.querySelector(".sidebar-nav");
  const navLinks = document.querySelectorAll(".sidebar-nav a");
  const targets = [];

  navLinks.forEach(link => {
    const id = link.getAttribute("href")?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      targets.push({ id, target, link });
    }
  });

  if (targets.length === 0) return;

  function setActiveById(id) {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  }

  // ✅ 点击 INTRODUCTION：回到页面最上面（top=0），而不是停在 intro-title 标题处
  if (nav) {
    nav.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute("href").slice(1);

      // INTRODUCTION 特判
      if (id === "intro-title") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveById("intro-title");
        history.replaceState(null, "", "#intro-title");
        return;
      }

      // 其它项照常：让浏览器/你原本的滚动逻辑去处理
      // （如果你还有另一个 click-scroll 脚本，保持它继续工作）
    });
  }

  // ✅ 顶端兜底：回到最上面时，强制高亮 INTRODUCTION
  function forceIntroAtTop() {
    if (window.scrollY <= 2) {
      setActiveById("intro-title");
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // ✅ 先处理“顶端”情况，避免被 projects 抢占
      if (window.scrollY <= 2) {
        setActiveById("intro-title");
        return;
      }

      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setActiveById(entry.target.id);
      });
    },
    {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    }
  );

  targets.forEach(({ target }) => observer.observe(target));

  window.addEventListener("load", forceIntroAtTop);
  window.addEventListener("scroll", forceIntroAtTop, { passive: true });
})();
