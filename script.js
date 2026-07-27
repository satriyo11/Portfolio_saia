/* =========================================================
   PORTFOLIO SCRIPT — Satriyo Priyo Widjaksono
   Vanilla JavaScript, modular per fitur.
   Semua modul dijalankan setelah DOM siap.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavigation();
  initTypingAnimation();
  initRevealOnScroll();
  initProgressBars();
  initMouseParallax();
  initMouseSpotlight();
  initRippleButtons();
  initLazyThumbnails();
  initVideoModal();
  initGalleryLightbox();
  initBackToTop();
  initContactForm();
});

/* ---------------------------------------------------------
   1. LOADING SCREEN
   Menyembunyikan loading screen setelah ~2 detik lalu
   menampilkan halaman dengan fade transition.
--------------------------------------------------------- */
function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 1800);
  });
}

/* ---------------------------------------------------------
   2. SCROLL PROGRESS BAR
   Mengisi bar di bagian atas halaman sesuai posisi scroll.
--------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  }, { passive: true });
}

/* ---------------------------------------------------------
   3. STICKY NAVBAR (glassmorphism saat discroll)
--------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------------------------------------------------------
   4. RESPONSIVE MOBILE MENU (Hamburger)
--------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const links = mobileMenu.querySelectorAll('.mobile-link');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  links.forEach(link => link.addEventListener('click', closeMenu));
}

/* ---------------------------------------------------------
   5. SMOOTH SCROLL untuk semua anchor internal
--------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------------------------------------------------------
   6. ACTIVE NAVIGATION mengikuti section yang terlihat
--------------------------------------------------------- */
function initActiveNavigation() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ---------------------------------------------------------
   7. TYPING ANIMATION di Hero Section
--------------------------------------------------------- */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = ['PowerPoint Designer kalo ada mood', 'member IMPHEN', 'jobless', 'manusia biasa, makan nasi'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = currentWord.slice(0, charIndex);
      if (charIndex === currentWord.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      el.textContent = currentWord.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    const speed = deleting ? 45 : 90;
    setTimeout(tick, speed);
  }

  tick();
}

/* ---------------------------------------------------------
   8. SCROLL REVEAL (Fade Up / Fade In) via Intersection Observer
--------------------------------------------------------- */
function initRevealOnScroll() {
  const revealTargets = document.querySelectorAll('.reveal, .reveal-img');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   9. ANIMATED PROGRESS BAR (Skills) + Counter Animation
   Bergerak dari 0 menuju nilai sebenarnya ketika section muncul.
--------------------------------------------------------- */
function initProgressBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  if (!skillItems.length) return;

  const animateCounter = (el, target, duration = 1600) => {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + '%';
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + '%';
    }
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const fill = item.querySelector('.progress-fill');
        const percentEl = item.querySelector('.skill-percent');
        const value = fill.dataset.value;
        fill.style.width = value + '%';
        animateCounter(percentEl, parseInt(value, 10));
        obs.unobserve(item);
      }
    });
  }, { threshold: 0.4 });

  skillItems.forEach(item => observer.observe(item));
}

/* ---------------------------------------------------------
   10. MOUSE PARALLAX di Hero Section
--------------------------------------------------------- */
function initMouseParallax() {
  const hero = document.querySelector('.hero');
  const targets = document.querySelectorAll('[data-parallax]');
  if (!hero || !targets.length) return;

  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2);
    const y = (e.clientY - innerHeight / 2);

    targets.forEach(target => {
      const factor = parseFloat(target.dataset.parallax);
      target.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    targets.forEach(target => { target.style.transform = 'translate(0, 0)'; });
  });
}

/* ---------------------------------------------------------
   11. MOUSE SPOTLIGHT
   Lingkaran cahaya lembut yang mengikuti kursor di Hero.
--------------------------------------------------------- */
function initMouseSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'spotlight';
  hero.appendChild(spotlight);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    spotlight.style.left = (e.clientX - rect.left) + 'px';
    spotlight.style.top = (e.clientY - rect.top) + 'px';
    spotlight.classList.add('active');
  });

  hero.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
}

/* ---------------------------------------------------------
   12. RIPPLE BUTTON EFFECT
--------------------------------------------------------- */
function initRippleButtons() {
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });
}

/* ---------------------------------------------------------
   13. LAZY LOADING THUMBNAIL PPT dengan Intersection Observer
--------------------------------------------------------- */
function initLazyThumbnails() {
  const lazyImages = document.querySelectorAll('.lazy-img[data-src]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(img => observer.observe(img));
}

/* ---------------------------------------------------------
   14. VIDEO MODAL (PowerPoint Preview)
   Video tidak autoplay, hanya diputar saat tombol Play ditekan.
--------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('modalVideo');
  const spinner = document.getElementById('videoSpinner');
  const titleEl = document.getElementById('videoModalTitle');
  const descEl = document.getElementById('videoModalDesc');
  const playButtons = document.querySelectorAll('.ppt-card .play-btn');

  if (!modal) return;

  function openModal(card) {
    const src = card.dataset.video;
    const title = card.dataset.title;
    const desc = card.dataset.desc;

    spinner.classList.add('active');
    video.src = src;
    titleEl.textContent = title;
    descEl.textContent = desc;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    video.addEventListener('loadeddata', () => {
      spinner.classList.remove('active');
      video.play().catch(() => {});
    }, { once: true });
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.style.overflow = '';
  }

  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ppt-card');
      openModal(card);
    });
  });

  modal.querySelectorAll('[data-close="video"]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ---------------------------------------------------------
   15. GALLERY LIGHTBOX (Organisasi & Dokumentasi Kegiatan)
   Mendukung Next/Prev, Keyboard Arrow, dan Swipe Mobile.
--------------------------------------------------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  if (!lightbox) return;

  let currentGroup = [];
  let currentIndex = 0;

  function collectGroup(clickedEl) {
    // Kumpulkan galeri dalam container yang sama (OSIS, MCC, atau Activity)
    const container = clickedEl.closest('.gallery-grid') || clickedEl.closest('.activity-grid');
    return Array.from(container.querySelectorAll('.gallery-item'));
  }

  function show(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const el = currentGroup[currentIndex];
    lightboxImage.src = el.dataset.full;
    lightboxImage.alt = el.dataset.caption || '';
    lightboxCaption.textContent = el.dataset.caption || '';
  }

  function openLightbox(el) {
    currentGroup = collectGroup(el);
    currentIndex = currentGroup.indexOf(el);
    show(currentIndex);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  nextBtn.addEventListener('click', () => show(currentIndex + 1));

  lightbox.querySelectorAll('[data-close="lightbox"]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
  });

  // Swipe mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) show(currentIndex + 1);
      else show(currentIndex - 1);
    }
  }, { passive: true });
}

/* ---------------------------------------------------------
   16. BACK TO TOP BUTTON
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   17. CONTACT FORM (validasi sederhana, tanpa backend)
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Mohon lengkapi semua kolom sebelum mengirim pesan.';
      status.style.color = '#f87171';
      return;
    }

    // Placeholder pengiriman pesan (tidak ada backend di project ini)
    status.textContent = `Terima kasih, ${name}! Pesan Anda telah siap dikirim.`;
    status.style.color = 'var(--color-accent)';
    form.reset();
  });
}
