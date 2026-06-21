/* ============================================================
   PORTFOLIO SCRIPT — Mohamed Asarudeen T
   Sections: Loader · Cursor · Navbar · Typing · Particles
             Scroll Reveal · Smooth Scroll · Contact Form
             Scroll-to-Top · Active Nav · Footer Year
   ============================================================ */

'use strict';

/* ===== LOADER ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page finishes loading (min 1.6s for animation)
  const minDuration = 1600;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDuration - elapsed);

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, remaining);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
})();


/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  rafId = requestAnimationFrame(animateFollower);

  // Hover effects on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .about-card, .skill-group, .contact-item, .cyber-tool'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '';
    follower.style.opacity = '';
  });
})();


/* ===== NAVBAR — scroll behavior & hamburger ===== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  // Scrolled class for glass effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('.nav-link, .btn-nav').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ===== ACTIVE NAV LINK on scroll ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(section => observer.observe(section));
})();


/* ===== TYPING ANIMATION in Hero ===== */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Software Developer',
    'Java Programmer',
    'Web Developer',
    'Security Enthusiast',
    'Problem Solver',
    'Quick Learner'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 40;
  const PAUSE_AFTER    = 2000;
  const PAUSE_BEFORE   = 400;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
      // Finished typing — pause then start deleting
      delay = PAUSE_AFTER;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_BEFORE;
    }

    setTimeout(type, delay);
  }

  // Start after a short delay (let loader finish)
  setTimeout(type, 2000);
})();


/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Skip on reduced-motion or mobile to save performance
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x     = Math.random() * canvas.width;
      this.y     = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size  = Math.random() * 1.5 + 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.35 + 0.05;
      // Alternate between cyan and violet
      this.color = Math.random() > 0.5 ? '0, 212, 255' : '123, 47, 255';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();


/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Don't animate if reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  // Stagger children in the same parent
  revealEls.forEach((el, i) => {
    // Stagger delay based on siblings
    const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
    const siblingIndex = siblings.indexOf(el);
    if (siblingIndex > 0) {
      el.style.transitionDelay = `${siblingIndex * 80}ms`;
    }
    observer.observe(el);
  });
})();


/* ===== CONTACT FORM VALIDATION ===== */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText   = document.getElementById('btnText');
  const success   = document.getElementById('formSuccess');
  if (!form) return;

  // Field configs
  const fields = [
    {
      id:        'name',
      errorId:   'nameError',
      validate:  v => v.trim().length >= 2,
      message:   'Please enter your full name (at least 2 characters).'
    },
    {
      id:        'email',
      errorId:   'emailError',
      validate:  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message:   'Please enter a valid email address.'
    },
    {
      id:        'subject',
      errorId:   'subjectError',
      validate:  v => v.trim().length >= 3,
      message:   'Please enter a subject (at least 3 characters).'
    },
    {
      id:        'message',
      errorId:   'messageError',
      validate:  v => v.trim().length >= 20,
      message:   'Message must be at least 20 characters long.'
    }
  ];

  // Real-time validation on blur
  fields.forEach(({ id, errorId, validate, message }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!input || !error) return;

    input.addEventListener('blur', () => {
      if (!validate(input.value)) {
        showError(input, error, message);
      } else {
        clearError(input, error);
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error') && validate(input.value)) {
        clearError(input, error);
      }
    });
  });

  function showError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    fields.forEach(({ id, errorId, validate, message }) => {
      const input = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!input || !error) return;

      if (!validate(input.value)) {
        showError(input, error, message);
        isValid = false;
      } else {
        clearError(input, error);
      }
    });

    if (!isValid) return;

    // Simulate form submission (replace with actual API call)
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success state
    form.reset();
    btnText.textContent = 'Send Message';
    submitBtn.disabled = false;

    if (success) {
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
})();


/* ===== SCROLL TO TOP BUTTON ===== */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===== SMOOTH SCROLL for anchor links ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ===== FOOTER YEAR ===== */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ===== NAVBAR LINK HOVER micro-interaction ===== */
(function initNavHover() {
  // Re-apply cursor hover class to newly noticed elements after DOM settle
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('cursor');
      const follower = document.getElementById('cursorFollower');
      if (cursor)   cursor.classList.add('hovered');
      if (follower) follower.classList.add('hovered');
    });
    link.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('cursor');
      const follower = document.getElementById('cursorFollower');
      if (cursor)   cursor.classList.remove('hovered');
      if (follower) follower.classList.remove('hovered');
    });
  });
})();


/* ===== CODE WINDOW — subtle glow on hover ===== */
(function initCodeGlow() {
  const win = document.querySelector('.code-window');
  if (!win) return;

  win.addEventListener('mouseenter', () => {
    win.style.boxShadow = '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0, 212, 255, 0.12)';
  });

  win.addEventListener('mouseleave', () => {
    win.style.boxShadow = '';
  });
})();
