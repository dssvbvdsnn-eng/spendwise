(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const navLinks = Array.from(nav ? nav.querySelectorAll('a[href^="#"]') : []);
  const toast = document.querySelector('.toast');

  /* Header state */
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Mobile menu */
  const setMenu = (open) => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus({ preventScroll: true });
    }
  };

  const closeMenu = (restoreFocus = false) => {
    if (!menuToggle || !nav || !nav.classList.contains('is-open')) return;
    setMenu(false);
    if (restoreFocus) menuToggle.focus({ preventScroll: true });
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });

    navLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

    document.addEventListener('click', (event) => {
      if (!nav.classList.contains('is-open')) return;
      if (header && header.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* Scroll spy */
  const spySections = ['features', 'tour', 'demo', 'privacy', 'faq']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const updateCurrentLink = (id) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if ('IntersectionObserver' in window && spySections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) updateCurrentLink(entry.target.id);
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 }
    );
    spySections.forEach((section) => spyObserver.observe(section));
  }

  /* Reveal on scroll */
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* Counters */
  const counters = Array.from(document.querySelectorAll('.stat-value[data-count]'));
  const formatCount = new Intl.NumberFormat('en-US');

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const textNode = Array.from(element.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== ''
    );

    if (reduceMotion || !Number.isFinite(target) || target === 0 || !textNode) {
      return;
    }

    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      textNode.nodeValue = formatCount.format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    textNode.nodeValue = '0';
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  /* Tour tabs */
  const tabs = Array.from(document.querySelectorAll('.tour-tab'));
  const panels = tabs
    .map((tab) => document.getElementById(tab.getAttribute('aria-controls')))
    .filter(Boolean);

  const activateTab = (tab, focusTab = false) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute('aria-controls');
    });

    if (focusTab) tab.focus({ preventScroll: true });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      const isRtl = document.documentElement.dir === 'rtl';
      let nextIndex = null;

      if (event.key === 'ArrowLeft') {
        nextIndex = isRtl ? index + 1 : index - 1;
      } else if (event.key === 'ArrowRight') {
        nextIndex = isRtl ? index - 1 : index + 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      const clamped = (nextIndex + tabs.length) % tabs.length;
      activateTab(tabs[clamped], true);
    });
  });

  /* FAQ accordion */
  const faqItems = Array.from(document.querySelectorAll('.faq-list details'));
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* Launch toast */
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast) return;
    const text = toast.querySelector('.toast-text');
    if (text && message) text.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  };

  document.querySelectorAll('[data-soon]').forEach((button) => {
    button.addEventListener('click', () => {
      showToast('الإطلاق الرسمي قريب — مفيش رابط تحميل رسمي حاليًا.');
    });
  });
})();
