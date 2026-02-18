document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('preload');
  document.body.classList.add('page-ready');

  setup3DPortfolioScene();
  setupReveal();
  setupTilt();
  setupParallaxDepth();
  setupImageModal();
  setupProjectDetailsModal();
  setupNavState();
  setupNavbarScrollState();
  setupBackToTop();
  setupScrollProgress();
  fillSkillMeters();
  setupTypingEffect();
  setupStatCounters();
  setupContactForm();
  setupScrollTypewriter();
});

function setup3DPortfolioScene() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const scenes = document.querySelectorAll('header[id], section[id]');
  scenes.forEach((scene) => {
    scene.classList.add('scene-3d');
    scene.addEventListener('mousemove', (event) => {
      const rect = scene.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      scene.style.setProperty('--mx', `${x}%`);
      scene.style.setProperty('--my', `${y}%`);
    });
  });

  const cards = document.querySelectorAll('.glass-card, .project-card, .stat-card, .hero-image-card, .skill-card, .contact-list a');
  cards.forEach((card, index) => {
    card.classList.add('tilt-card', 'card-3d-float');
    card.style.setProperty('--float-delay', `${(index % 8) * 0.28}s`);
  });
}

function setupReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('show'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  elements.forEach((el) => observer.observe(el));
}

function setupTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isCoarse || reduceMotion) return;

  cards.forEach((card) => {
    let frame = null;

    card.addEventListener('mousemove', (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = -((y - midY) / midY) * 5;
        const rotateY = ((x - midX) / midX) * 6.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function setupParallaxDepth() {
  const sections = document.querySelectorAll('.section-depth');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  if (reduceMotion || isMobile) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      sections.forEach((section) => {
        const depth = Number(section.dataset.depth || 0.2);
        const rect = section.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const rotateX = Math.max(-2.5, Math.min(2.5, -offset * 2.4));
        section.style.transform = `translate3d(0, ${Math.round(y * depth * 0.06)}px, 0) rotateX(${rotateX.toFixed(2)}deg)`;
      });
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupImageModal() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('projectModalLabel');
  const modalImage = document.getElementById('projectModalImage');
  if (!modal || !modalTitle || !modalImage) return;

  modal.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    if (!trigger) return;
    const title = trigger.getAttribute('data-title') || 'Project Preview';
    const full = trigger.getAttribute('data-full') || trigger.getAttribute('src') || '';

    modalTitle.textContent = title;
    modalImage.src = full;
    modalImage.alt = `${title} preview image`;
  });
}

function setupProjectDetailsModal() {
  const modal = document.getElementById('detailsModal');
  const body = document.getElementById('detailsModalBody');
  const title = document.getElementById('detailsModalLabel');
  if (!modal || !body || !title) return;

  const content = {
    'Task Manager Fullstack': 'Built as a full stack productivity app with secure authentication, JWT-based sessions, and structured task APIs. Focus areas were clean UI flow, modular backend services, and reliable CRUD operations.',
    'Bank Management System': 'Built to manage account records and transaction workflows with Java and MySQL integration. Focus areas were data integrity, validation logic, and maintainable database interaction.'
  };

  modal.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    const project = trigger ? trigger.getAttribute('data-project') : '';
    title.textContent = project || 'Project Details';
    body.textContent = content[project] || 'Detailed information is available in the project repository.';
  });
}

function setupNavState() {
  const links = document.querySelectorAll('.navbar .nav-link');
  const sections = [...document.querySelectorAll('header[id], section[id]')];

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('mainNav');
      if (nav && nav.classList.contains('show')) {
        new bootstrap.Collapse(nav).hide();
      }
    });
  });

  const activate = () => {
    const y = window.scrollY + 130;
    let current = '';
    sections.forEach((section) => {
      if (y >= section.offsetTop) current = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', activate, { passive: true });
  activate();
}

function setupNavbarScrollState() {
  const nav = document.querySelector('.glass-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  const toggle = () => {
    button.classList.toggle('show', window.scrollY > 420);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function setupScrollProgress() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const update = () => {
    const doc = document.documentElement;
    const total = doc.scrollHeight - doc.clientHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function fillSkillMeters() {
  const meters = document.querySelectorAll('.skill-meter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('fill');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  meters.forEach((meter) => observer.observe(meter));
}

function setupTypingEffect() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const text = 'TYBSc-IT Student | Aspiring Full Stack Developer';
  let i = 0;
  const speed = 46;

  const type = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i += 1;
      setTimeout(type, speed);
    }
  };

  type();
}

function setupStatCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = 1100;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    let current = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = `${target}${suffix}`;
        return;
      }
      counter.textContent = `${current}${suffix}`;
      requestAnimationFrame(tick);
    };

    tick();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('contactStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending message...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Message not sent');
      }

      form.reset();
      if (statusEl) statusEl.textContent = 'Message sent successfully.';
      window.location.hash = 'home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (statusEl) statusEl.textContent = 'Failed to send. Please try again.';
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function setupScrollTypewriter() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const selector = [
    '.eyebrow',
    'h1.display-4',
    '.hero-text',
    '.section-title',
    '.about p',
    '.glass-card p',
    '.project-card p',
    '.contact-strong',
    '.contact-copy'
  ].join(', ');

  const targets = [...document.querySelectorAll(selector)].filter((el) => {
    if (!el.textContent) return false;
    if (el.closest('button, a, label')) return false;
    if (el.id === 'typedRole') return false;
    return el.children.length === 0;
  });

  if (!targets.length) return;

  targets.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    el.dataset.typeText = text;
    el.textContent = '';
  });

  const type = (el) => {
    const text = el.dataset.typeText || '';
    const speed = Math.max(10, Math.min(26, Math.round(950 / Math.max(text.length, 1))));
    let i = 0;

    const tick = () => {
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) setTimeout(tick, speed);
    };

    tick();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.typed === '1') return;
      el.dataset.typed = '1';
      type(el);
      observer.unobserve(el);
    });
  }, { threshold: 0.35 });

  targets.forEach((el) => observer.observe(el));
}
