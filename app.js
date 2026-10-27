'use strict';
const themes = {
  fruit: { tag: 'JUICY & JOYFUL', title: '一刀下去，<br>烦恼也切碎了。', description: '苹果、草莓、西瓜轮番登场。找准时机，一划连斩，在果汁飞溅中挑战自己的最好成绩。', features: ['挑战关卡，点亮属于你的星星', '迎战水果 Boss，收获通关的满足感', '解锁刀光，让每一划都有你的风格'], images: [['pastel-hero_fruit.png','新版水果主题主视觉'],['banana.png','香蕉'],['kiwi.png','猕猴桃']], note: '快乐，鲜切现玩。' },
  letter: { tag: 'SLICE, SPELL & DISCOVER', title: '划开字母，<br>拼出小小新世界。', description: '52 个大小写字母等你发现。切开时听见发音，完成一局后，看收集的字母重新组合成一个个单词。', features: ['大小写字母切割，听见英文发音', '50 个三字母启蒙词，离线也能听读', '发现新单词，慢慢填满你的单词墙'], images: [['pastel-hero_letters.png','新版字母主题主视觉'],['B.png','字母 B'],['C.png','字母 C']], note: '让好奇心，也开花。' }
};
const tabs = [...document.querySelectorAll('[data-theme]')];
function selectTheme(tab) {
  const key = tab.dataset.theme;
  const theme = themes[key];
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  document.querySelector('#theme-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#theme-panel').classList.toggle('is-letter', key === 'letter');
  document.querySelector('#theme-tag').textContent = theme.tag;
  document.querySelector('#theme-title').innerHTML = theme.title;
  document.querySelector('#theme-description').textContent = theme.description;
  document.querySelector('#theme-features').replaceChildren(...theme.features.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  document.querySelectorAll('.scene-image').forEach((img, index) => { img.src = `assets/${theme.images[index][0]}`; img.alt = theme.images[index][1]; });
  const note = document.querySelector('.scene-note'); note.replaceChildren(document.createTextNode(theme.note)); const star = document.createElement('span'); star.textContent = '✦'; note.append(star);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTheme(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = tabs[(index + 1) % tabs.length];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs.at(-1);
    if (next) { event.preventDefault(); selectTheme(next); next.focus(); }
  });
});
const equipment = {
  flame: ['烈焰', '炽热刀光，让每一次连斩都充满能量。通关第 3 关解锁。', 'KNIFE COLLECTION / 刀具'],
  thunder: ['紫电', '利落的紫色锋芒，点亮你的切割瞬间。完成一次五连斩解锁。', 'KNIFE COLLECTION / 刀具'],
  aurora: ['极光', '把绚丽极光握在手中，划出属于你的轨迹。累计获得 12 颗星解锁。', 'KNIFE COLLECTION / 刀具'],
  pencil: ['铅笔', '熟悉的笔尖，全新的玩法。用铅笔划开字母，留下你的探索笔迹。', 'STATIONERY COLLECTION / 文具'],
  rainbow: ['彩虹画笔', '把颜色装进每一笔，让字母切割也充满想象力。字母主题中可直接选择。', 'STATIONERY COLLECTION / 文具']
};
document.querySelectorAll('[data-equipment]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.equipment;
  const [title, description, category] = equipment[key];
  document.querySelectorAll('[data-equipment]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#equipment-image').src = `assets/${key}.png`;
  document.querySelector('#equipment-image').alt = `${title}装备预览`;
  document.querySelector('#equipment-title').textContent = title;
  document.querySelector('#equipment-description').textContent = description;
  document.querySelector('#equipment-category').textContent = category;
}));
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if(event.matches) closeMenu(); });

// Progressive visual enhancements: every interaction remains usable without animation.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const heroArt = document.querySelector('.pastel-hero');
const sliceButton = document.querySelector('#slice-demo');
const sliceCanvas = document.querySelector('#slice-canvas');
const sliceContext = sliceCanvas.getContext('2d');
let demoCombo = 0;
let particles = [];
let animationFrame = null;
let previousFrame = 0;
let lastPointer = null;
let lastSpark = 0;
function resizeSliceCanvas() {
  const rect = heroArt.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  sliceCanvas.width = Math.round(rect.width * scale);
  sliceCanvas.height = Math.round(rect.height * scale);
  sliceContext?.setTransform(scale, 0, 0, scale, 0, 0);
}
new ResizeObserver(resizeSliceCanvas).observe(heroArt);
function drawSliceFrame(time) {
  const step = previousFrame ? Math.min((time - previousFrame) / 16.67, 3) : 1;
  previousFrame = time;
  sliceContext.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.life -= .025 * step;
    p.x += p.vx * step; p.y += p.vy * step; p.vy += .05 * step;
    sliceContext.globalAlpha = Math.max(p.life, 0);
    sliceContext.strokeStyle = p.color; sliceContext.fillStyle = p.color;
    sliceContext.shadowBlur = 12; sliceContext.shadowColor = p.color;
    if (p.line) { sliceContext.lineWidth = 2.5; sliceContext.beginPath(); sliceContext.moveTo(p.x, p.y); sliceContext.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); sliceContext.stroke(); }
    else { sliceContext.beginPath(); sliceContext.arc(p.x, p.y, p.size, 0, Math.PI * 2); sliceContext.fill(); }
  });
  sliceContext.globalAlpha = 1;
  if (particles.length) animationFrame = requestAnimationFrame(drawSliceFrame);
  else { animationFrame = null; previousFrame = 0; }
}
function sparkAt(x, y, burst = false) {
  if (!sliceContext || motionPreference.matches) return;
  const colors = ['#c4ff9d', '#d2adff', '#9deaff', '#ffffff'];
  for (let i = 0; i < (burst ? 28 : 3); i++) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = burst ? 2 + Math.random() * 5 : .5 + Math.random();
    particles.push({x, y, vx:Math.cos(angle)*velocity, vy:Math.sin(angle)*velocity, life:1, size:1+Math.random()*2, color:colors[i%4], line:burst || i===0});
  }
  particles = particles.slice(-160);
  if (!animationFrame) animationFrame = requestAnimationFrame(drawSliceFrame);
}
heroArt.addEventListener('pointermove', event => {
  if (motionPreference.matches || event.pointerType === 'touch') return;
  const bounds = heroArt.getBoundingClientRect();
  const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
  heroArt.style.setProperty('--px', (x / bounds.width - .5) * 2);
  heroArt.style.setProperty('--py', (y / bounds.height - .5) * 2);
  if (event.timeStamp - lastSpark > 24 && (!lastPointer || Math.hypot(x-lastPointer.x,y-lastPointer.y)>4)) { sparkAt(x, y); lastSpark=event.timeStamp; lastPointer={x,y}; }
});
heroArt.addEventListener('pointerleave', () => { heroArt.style.setProperty('--px', 0); heroArt.style.setProperty('--py', 0); lastPointer=null; });
sliceButton.addEventListener('click', () => {
  demoCombo++;
  document.querySelector('#demo-status').textContent = `互动演示 · COMBO × ${demoCombo} · 游戏中挑战更多连斩`;
  const bounds = heroArt.getBoundingClientRect();
  for (let i=0;i<5;i++) sparkAt(bounds.width*(.2+i*.14),bounds.height*(.7-i*.1),true);
});
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) { if(animationFrame) cancelAnimationFrame(animationFrame); animationFrame=null; particles=[]; previousFrame=0; sliceContext?.clearRect(0,0,sliceCanvas.width,sliceCanvas.height); heroArt.style.setProperty('--px',0); heroArt.style.setProperty('--py',0); }
});
const tickerTrack = document.querySelector('.ticker > div');
const tickerOriginal = document.createElement('span');
tickerOriginal.className = 'ticker-copy';
while (tickerTrack.firstChild) tickerOriginal.append(tickerTrack.firstChild);
tickerTrack.append(tickerOriginal, tickerOriginal.cloneNode(true));
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } }), {threshold:.08});
  document.querySelectorAll('.section-heading, .theme-panel, .modes, .collection-grid, .equipment, .download-box').forEach(element => { element.classList.add('reveal-ready'); reveals.observe(element); });
}
