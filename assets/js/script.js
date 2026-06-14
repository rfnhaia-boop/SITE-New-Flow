/* =========================================
   NEW FLOW ERP — Script
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     CANVAS BLOBS — animação fluida verde/roxo
     sobre o vídeo de fundo
  ───────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, t = 0;

    const blobs = [
      { x: 0.20, y: 0.30, r: 0.50, vx: 0.00030, vy: 0.00022, phase: 0.0, color: [126, 200, 160] },
      { x: 0.78, y: 0.65, r: 0.48, vx: -0.00022, vy: 0.00030, phase: 2.1, color: [179, 157, 219] },
      { x: 0.50, y: 0.15, r: 0.38, vx: 0.00018, vy: -0.00020, phase: 4.2, color: [168, 220, 189] },
      { x: 0.12, y: 0.78, r: 0.32, vx: 0.00014, vy: 0.00032, phase: 1.0, color: [201, 188, 232] },
      { x: 0.88, y: 0.28, r: 0.30, vx: -0.00028, vy: 0.00018, phase: 3.3, color: [126, 200, 160] },
      { x: 0.60, y: 0.85, r: 0.26, vx: 0.00020, vy: -0.00014, phase: 5.1, color: [179, 157, 219] },
    ];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = canvas.width  = rect.width  || window.innerWidth;
      H = canvas.height = rect.height || window.innerHeight;
    }

    function drawBlob(blob) {
      const bx = (blob.x + Math.sin(t * 0.7 + blob.phase) * 0.18) * W;
      const by = (blob.y + Math.cos(t * 0.5 + blob.phase) * 0.14) * H;
      const br = blob.r * Math.min(W, H) * 1.0;
      const [r, g, b] = blob.color;

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0,   `rgba(${r},${g},${b},0.55)`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},0.28)`);
      grad.addColorStop(0.8, `rgba(${r},${g},${b},0.08)`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawWave(offsetY, amplitude, frequency, speed, color, alpha) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 3) {
        const y = offsetY
          + Math.sin(x * frequency + t * speed) * amplitude
          + Math.sin(x * frequency * 1.8 + t * speed * 0.6) * amplitude * 0.35
          + Math.sin(x * frequency * 0.4 + t * speed * 1.4) * amplitude * 0.20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const [r, g, b] = color;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Blobs aurora
      blobs.forEach(drawBlob);

      // Ondas no rodapé e topo do hero
      drawWave(H * 0.80, 30, 0.006, 1.1,  [126, 200, 160], 0.18);
      drawWave(H * 0.76, 24, 0.008, -0.9, [179, 157, 219], 0.14);
      drawWave(H * 0.85, 20, 0.005, 1.6,  [168, 220, 189], 0.12);
      drawWave(H * 0.72, 16, 0.010, -1.2, [201, 188, 232], 0.10);

      drawWave(H * 0.12, 22, 0.007, 0.8,  [126, 200, 160], 0.12);
      drawWave(H * 0.07, 18, 0.009, -0.7, [179, 157, 219], 0.10);

      t += 0.008;
      requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);
    render();
  }

  /* ── Vídeo hero: troca desktop ⇄ celular + autoplay ── */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    const heroSource = document.getElementById('heroVideoSource');
    const mqMobile = window.matchMedia('(max-width: 640px)');

    const applyHeroSource = () => {
      const wanted = mqMobile.matches
        ? heroVideo.dataset.videoMobile
        : heroVideo.dataset.videoDesktop;
      if (!wanted || !heroSource) return;
      // só recarrega se realmente mudou
      if (heroSource.getAttribute('src') === wanted) return;
      heroSource.setAttribute('src', wanted);
      heroVideo.load();
      heroVideo.play().catch(() => {});
    };

    applyHeroSource();
    mqMobile.addEventListener('change', applyHeroSource);

    heroVideo.play().catch(() => {
      document.addEventListener('click', () => heroVideo.play(), { once: true });
    });
  }

  /* ── Navbar scroll ─────────────────────── */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ───────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('menuClose');

  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger?.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
  menuClose?.addEventListener('click',  () => toggleMenu(false));
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ── Reveal on scroll ──────────────────── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ── Billing toggle ────────────────────── */
  const prices = {
    starter:      { monthly: 150,  annual: 110 },
    professional: { monthly: 259,  annual: 199 },
    enterprise:   { monthly: 670,  annual: 499 },
  };
  document.querySelectorAll('input[name="billing"]').forEach(input => {
    input.addEventListener('change', () => {
      const billing = input.value;
      document.querySelectorAll('[data-plan]').forEach(el => {
        el.textContent = prices[el.dataset.plan]?.[billing] ?? el.textContent;
      });
      document.querySelectorAll('.plan-price-note').forEach(el => {
        el.textContent = billing === 'annual' ? 'cobrado anualmente' : 'cobrado mensalmente';
      });
    });
  });

  /* ── CTA Form ──────────────────────────── */
  const ctaForm    = document.getElementById('ctaForm');
  const ctaInput   = document.getElementById('ctaEmail');
  const ctaSuccess = document.getElementById('ctaSuccess');
  const ctaBtn     = document.getElementById('ctaBtn');
  const isEmail    = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  ctaForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = ctaInput?.value?.trim() || '';
    if (!isEmail(email)) {
      ctaInput.classList.add('error');
      ctaInput.focus();
      ctaInput.addEventListener('input', () => ctaInput.classList.remove('error'), { once: true });
      return;
    }
    ctaBtn.textContent = 'Enviando…';
    ctaBtn.disabled = true;
    setTimeout(() => {
      ctaForm.style.display = 'none';
      ctaSuccess.classList.add('show');
      document.getElementById('ctaSuccessEmail').textContent = email;
    }, 1200);
  });

  /* ── Smooth scroll ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* ── Helper: Split text into chars (recursively preserving HTML structures & words) ── */
  function splitTextIntoChars(element) {
    const text = element.innerHTML;
    let delay = 0;
    
    function parseNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const content = node.textContent;
        const words = content.split(' ');
        let nodeResult = '';
        
        words.forEach((word, wordIdx) => {
          if (word === '') {
            if (wordIdx > 0) nodeResult += ' ';
            return;
          }
          
          let wordChars = '';
          for (let i = 0; i < word.length; i++) {
            const char = word[i];
            wordChars += `<span class="char-wrap"><span class="char" style="--char-index: ${delay}">${char}</span></span>`;
            delay++;
          }
          
          const space = (wordIdx < words.length - 1) ? ' ' : '';
          nodeResult += `<span class="word-wrap">${wordChars}</span>${space}`;
        });
        
        return nodeResult;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const attrs = Array.from(node.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
        const startTag = `<${tagName}${attrs ? ' ' + attrs : ''}>`;
        const endTag = `</${tagName}>`;
        
        if (tagName === 'br') {
          return '<br />';
        }
        
        let childResult = '';
        node.childNodes.forEach(child => {
          childResult += parseNode(child);
        });
        return startTag + childResult + endTag;
      }
      return '';
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    let finalHTML = '';
    tempDiv.childNodes.forEach(child => {
      finalHTML += parseNode(child);
    });
    element.innerHTML = finalHTML;
  }

  /* ── Hero stagger on load ─────────────── */
  const heroEl = document.querySelector('.hero');
  const heroTitle = document.querySelector('.hero-title');
  const heroLogoName = document.querySelector('.hero-logo-name');

  if (heroTitle) {
    splitTextIntoChars(heroTitle);
  }
  if (heroLogoName) {
    splitTextIntoChars(heroLogoName);
  }

  // Trigger reveal transition
  setTimeout(() => {
    heroEl?.classList.add('loaded');
  }, 100);

});
