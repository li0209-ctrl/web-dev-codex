(function () {
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

  const targets = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      return target ? { id, target, link } : null;
    })
    .filter(Boolean);

  if (targets.length === 0) return;

  let manualScrollTargetId = null;
  let manualScrollTimer = null;
  let ticking = false;

  function clearManualScrollLock() {
    manualScrollTargetId = null;
    if (manualScrollTimer) {
      window.clearTimeout(manualScrollTimer);
      manualScrollTimer = null;
    }
  }

  function setActiveById(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function findActiveIdByScroll() {
    if (window.scrollY <= 4) return targets[0].id;

    const anchorLine = window.innerHeight * 0.28;
    let active = targets[0].id;

    for (const item of targets) {
      const top = item.target.getBoundingClientRect().top;
      if (top - anchorLine <= 0) {
        active = item.id;
      } else {
        break;
      }
    }

    return active;
  }

  function syncActiveByScroll() {
    if (manualScrollTargetId) {
      const manualTarget = targets.find((item) => item.id === manualScrollTargetId)?.target;
    if (manualTarget) {
      const top = manualTarget.getBoundingClientRect().top;
      const anchorLine = window.innerHeight * 0.28;
      // 只要目标 section 顶部进入 anchorLine 以上，就认为到达
      if (top <= anchorLine + 8) {
        setActiveById(manualScrollTargetId);
        clearManualScrollLock();
      }
    }

      return;
    }

    setActiveById(findActiveIdByScroll());
  }

  function scheduleSync() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      syncActiveByScroll();
    });
  }

  function lockActiveUntilArrive(id) {
    clearManualScrollLock();
    manualScrollTargetId = id;

    const target = targets.find((item) => item.id === id)?.target;
    const distance = target ? Math.abs(target.getBoundingClientRect().top) : 600;
    const timeout = Math.min(2200, Math.max(700, distance * 1.25));

    manualScrollTimer = window.setTimeout(() => {
      clearManualScrollLock();
      syncActiveByScroll();
    }, timeout);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const id = link.getAttribute('href').slice(1);
      const hit = targets.find((item) => item.id === id);
      if (!hit) return;

      setActiveById(id);
      lockActiveUntilArrive(id);

      hit.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });

  window.addEventListener('scroll', scheduleSync, { passive: true });
  window.addEventListener('resize', scheduleSync);

  const hashId = window.location.hash?.slice(1);
  if (hashId && targets.some((item) => item.id === hashId)) {
    setActiveById(hashId);
  } else {
    syncActiveByScroll();
  }

  // 首屏加载后再同步一次，确保顶部 INTRODUCTION 可被正确点亮。
  window.requestAnimationFrame(syncActiveByScroll);
})();
