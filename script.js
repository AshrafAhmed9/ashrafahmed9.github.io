const skillsList = [
  '🐍 Python — Versatile language for backend and ML',
  '☕ Java — Object-oriented programming and enterprise apps',
  '⚡ FastAPI — High-performance async web APIs',
  '🔄 REST APIs — Scalable web service design',
  '🟦 PostgreSQL — Robust relational database',
  '🔴 Redis — In-memory data store for caching and queues',
  '🏗️ Distributed Systems — Scalable architectures',
  '📋 Task Queues — Asynchronous job processing',
  '💾 Caching — Performance optimization',
  '🚦 Rate Limiting — System stability',
  '🐳 Docker — Containerized deployments',
  '📚 Git — Version control and collaboration',
  '☁️ AWS EC2 — Cloud infrastructure',
  '🧠 DSA — Algorithms and data structures',
  '🏛️ System Design — Scalable software architecture'
];
let skillIndex = 0;
const skillSlide = document.getElementById('skills-slide');
const prevSkill = document.getElementById('prevSkill');
const nextSkill = document.getElementById('nextSkill');

function showSkill(index) {
  skillSlide.innerHTML = `<div class="skill-item">${skillsList[index]}</div>`;
}

function nextSkillItem() {
  skillIndex = (skillIndex + 1) % skillsList.length;
  showSkill(skillIndex);
}

function prevSkillItem() {
  skillIndex = (skillIndex - 1 + skillsList.length) % skillsList.length;
  showSkill(skillIndex);
}

prevSkill.addEventListener('click', prevSkillItem);
nextSkill.addEventListener('click', nextSkillItem);
showSkill(0);
setInterval(nextSkillItem, 3000);

// Gravity effect
const canvas = document.getElementById('gravity-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 50;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.7)`;
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (100 - distance) / 100;
    if (distance < 100) {
      this.speedX += dx * force * 0.01;
      this.speedY += dy * force * 0.01;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.99;
    this.speedY *= 0.99;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update(mouseX, mouseY);
    particle.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});
