// ---- nav scroll state ----
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, {passive:true});

  // ---- active link highlight ----
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav.links a');
  const setActive = () => {
    let current = 'home';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.4) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive, {passive:true});
  setActive();

  // ---- mobile menu ----
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  burger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // ---- reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:0.12});
  revealEls.forEach(el => io.observe(el));

  // ---- project card cursor glow ----
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ---- hero canvas: abstract node field ----
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }
  function initNodes(){
    nodes = [];
    const count = Math.max(18, Math.floor((W*H)/16000));
    for (let i=0;i<count;i++){
      nodes.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.15,
        vy: (Math.random()-0.5)*0.15,
        r: Math.random()*1.6+0.6
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<nodes.length;i++){
      const n = nodes[i];
      if(!prefersReduced){
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
    }
    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 130){
          ctx.strokeStyle = `rgba(168,85,247,${0.14*(1-dist/130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(34,211,238,0.55)';
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
    });
    if (!prefersReduced) requestAnimationFrame(draw);
  }
  function start(){
    resize(); initNodes(); draw();
  }
  window.addEventListener('resize', () => { resize(); initNodes(); if(prefersReduced) draw(); });
  start();
