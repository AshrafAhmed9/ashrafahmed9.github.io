const leftItems = [
  { icon: '🐍', label: 'Python' },
  { icon: '⚡', label: 'FastAPI' },
  { icon: '🔴', label: 'Redis' },
  { icon: '🐳', label: 'Docker' },
  { icon: '🟦', label: 'PostgreSQL' },
  { icon: '📚', label: 'Git' },
  { icon: '☁️', label: 'AWS EC2' }
];

const rightItems = [
  { icon: '☕', label: 'Java' },
  { icon: '🔄', label: 'REST APIs' },
  { icon: '🏗️', label: 'Distributed Systems' },
  { icon: '📋', label: 'Task Queues' },
  { icon: '💾', label: 'Caching' },
  { icon: '🚦', label: 'Rate Limiting' },
  { icon: '🧠', label: 'DSA' },
  { icon: '🏛️', label: 'System Design' }
];

const leftMarquee = document.getElementById('left-marquee');
const rightMarquee = document.getElementById('right-marquee');
const cursorHighlight = document.getElementById('cursor-highlight');

function createSlide(item) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.innerHTML = `<span class="icon">${item.icon}</span><span class="label">${item.label}</span>`;
  return slide;
}

function buildLoopingTrack(container, items) {
  const trackA = document.createElement('div');
  trackA.className = 'slide-track';
  const trackB = document.createElement('div');
  trackB.className = 'slide-track';

  items.forEach(item => {
    trackA.appendChild(createSlide(item));
    trackB.appendChild(createSlide(item));
  });

  container.appendChild(trackA);
  container.appendChild(trackB);
}

buildLoopingTrack(leftMarquee, leftItems);
buildLoopingTrack(rightMarquee, rightItems);

let cursorActiveTimeout;
document.addEventListener('mousemove', (event) => {
  const { clientX, clientY } = event;
  cursorHighlight.style.left = `${clientX}px`;
  cursorHighlight.style.top = `${clientY}px`;
  cursorHighlight.style.opacity = '0.36';
  cursorHighlight.style.transform = 'translate(-50%, -50%) scale(1.1)';

  clearTimeout(cursorActiveTimeout);
  cursorActiveTimeout = setTimeout(() => {
    cursorHighlight.style.opacity = '0';
    cursorHighlight.style.transform = 'translate(-50%, -50%) scale(0.8)';
  }, 320);
});

const canvas = document.getElementById('gravity-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

let particles = [];
const particleCount = 70;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 2 + 1;
    this.vx = Math.random() * 0.8 - 0.4;
    this.vy = Math.random() * 0.8 - 0.4;
    this.alpha = Math.random() * 0.4 + 0.15;
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const push = (120 - dist) / 120;
      this.vx -= dx * 0.0012 * push;
      this.vy -= dy * 0.0012 * push;
    }

    this.vy += 0.008;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;

    if (this.y > canvas.height + 20) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
      this.vy = Math.random() * 0.5 + 0.15;
    }
    if (this.x < -20 || this.x > canvas.width + 20) {
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(170, 230, 255, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update(mouseX, mouseY);
    particle.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});
