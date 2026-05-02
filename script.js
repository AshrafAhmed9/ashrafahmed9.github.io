// Slideshow for sides
const leftSlideshow = document.getElementById('left-slideshow');
const rightSlideshow = document.getElementById('right-slideshow');
const leftSlides = leftSlideshow.querySelectorAll('.slide');
const rightSlides = rightSlideshow.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide() {
  leftSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
  rightSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === currentSlide);
  });
  currentSlide = (currentSlide + 1) % leftSlides.length;
}

setInterval(showSlide, 2000);
showSlide();

// Scroll with cursor
document.addEventListener('mousemove', (e) => {
  const y = e.clientY;
  const translateY = (y - window.innerHeight / 2) * 0.3;
  leftSlideshow.style.transform = `translateY(${translateY}px)`;
  rightSlideshow.style.transform = `translateY(${translateY}px)`;
});

// Gravity effect like over water
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
    // Gravity down
    this.speedY += 0.05;
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const force = (100 - distance) / 100;
    if (distance < 100) {
      // Repel from cursor, like pushing water
      this.speedX -= dx * force * 0.02;
      this.speedY -= dy * force * 0.02;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX *= 0.99;
    this.speedY *= 0.99;

    // Reset if out of bounds
    if (this.y > canvas.height) {
      this.y = 0;
      this.speedY = 0;
    }
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
