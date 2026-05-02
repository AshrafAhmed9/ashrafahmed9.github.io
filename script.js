const terminalText = document.getElementById('terminal-text');
const commands = [
  '$ whoami  ',
  'Ashraf Ahmed — ML Systems Engineer',
  '$ open repo  ',
  'https://github.com/AshrafAhmed9/-SMTTP',
  '$ show tech  ',
  'FastAPI, Redis, PostgreSQL, Docker, PyTorch, Transformers',
  '$ deploy  ',
  'Deploy with GitHub Pages for free at asharfahmed9.github.io'
];
let idx = 0;
let char = 0;
let currentText = '';

function typeCommand() {
  if (idx >= commands.length) {
    idx = 0;
  }
  const line = commands[idx];
  if (char < line.length) {
    currentText += line[char];
    terminalText.textContent = currentText;
    char += 1;
    setTimeout(typeCommand, 70);
  } else {
    setTimeout(() => {
      currentText = '';
      char = 0;
      idx += 1;
      typeCommand();
    }, 1400);
  }
}

typeCommand();

const techList = [
  'FastAPI — API design, async request handling, validation',
  'Redis — queues, caching, pub/sub, realtime state',
  'PostgreSQL — reliable relational data stores, SQLAlchemy ORM',
  'Docker — containerized deployment, local reproducibility',
  'PyTorch & Transformers — ML inference and NLP model pipelines',
  'GitHub Pages — free static hosting for polished portfolio sites'
];
let techIndex = 0;
const techSlide = document.getElementById('tech-slide');
const prevTech = document.getElementById('prevTech');
const nextTech = document.getElementById('nextTech');

function showTech(index) {
  techSlide.innerHTML = `<div class="tech-item">${techList[index]}</div>`;
}

function nextItem() {
  techIndex = (techIndex + 1) % techList.length;
  showTech(techIndex);
}

function prevItem() {
  techIndex = (techIndex - 1 + techList.length) % techList.length;
  showTech(techIndex);
}

prevTech.addEventListener('click', prevItem);
nextTech.addEventListener('click', nextItem);
showTech(0);
setInterval(nextItem, 4200);
