import { World, SAND, WATER, WALL } from './simulation.js';

const canvas = document.getElementById('sand');
const ctx = canvas.getContext('2d', { alpha: false });
const brush = document.getElementById('brush');
const size = document.getElementById('size');
let world, pixels, material = SAND, paused = false, pointer = null, drawing = false;
let activePointer = null;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const cell = Math.max(3, Math.ceil(rect.width / 320));
  const next = new World(Math.max(1, Math.floor(rect.width / cell)), Math.max(1, Math.floor(rect.height / cell)));
  if (world) {
    // Preserve individual particles and the floor alignment on resize.
    const dx = Math.floor((next.width - world.width) / 2), dy = next.height - world.height;
    for (let y = 0; y < world.height; y++) for (let x = 0; x < world.width; x++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < next.width && ny >= 0 && ny < next.height) next.cells[ny * next.width + nx] = world.cells[y * world.width + x];
    }
  }
  world = next;
  canvas.width = world.width;
  canvas.height = world.height;
  pixels = ctx.createImageData(world.width, world.height);
  pointer = null;
  drawing = false;
  brush.hidden = true;
}

function position(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: Math.floor((event.clientX - rect.left) * world.width / rect.width), y: Math.floor((event.clientY - rect.top) * world.height / rect.height) };
}
function showBrush(point) {
  const rect = canvas.getBoundingClientRect();
  const unit = rect.width / world.width;
  brush.style.left = `${rect.left + (point.x + .5) * unit}px`;
  brush.style.top = `${rect.top + (point.y + .5) * rect.height / world.height}px`;
  brush.style.width = brush.style.height = `${(+size.value * 2 + 1) * unit}px`;
  brush.hidden = false;
}
function paint(point) { world.paint(point.x, point.y, +size.value, material); }
function stroke(from, to) {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let n = 1; n <= steps; n++) paint({ x: Math.round(from.x + (to.x - from.x) * n / steps), y: Math.round(from.y + (to.y - from.y) * n / steps) });
}
canvas.addEventListener('pointerdown', event => {
  if (activePointer !== null || event.button !== 0) return;
  canvas.focus({ preventScroll: true });
  activePointer = event.pointerId;
  canvas.setPointerCapture(event.pointerId);
  pointer = position(event);
  drawing = true;
  paint(pointer);
  showBrush(pointer);
});
canvas.addEventListener('pointermove', event => {
  if (activePointer !== null && activePointer !== event.pointerId) return;
  const next = position(event);
  if (drawing && pointer) stroke(pointer, next);
  pointer = next;
  showBrush(pointer);
});
function endPointer(event) {
  if (event.pointerId !== activePointer) return;
  activePointer = null;
  drawing = false;
  brush.hidden = true;
}
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, endPointer);
canvas.addEventListener('pointerleave', () => { if (!drawing) brush.hidden = true; });
canvas.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) return;
  event.preventDefault();
  pointer ??= { x: Math.floor(world.width / 2), y: Math.floor(world.height / 3) };
  const from = { ...pointer };
  if (event.key === ' ') drawing = true;
  if (event.key === 'ArrowLeft') pointer.x--;
  if (event.key === 'ArrowRight') pointer.x++;
  if (event.key === 'ArrowUp') pointer.y--;
  if (event.key === 'ArrowDown') pointer.y++;
  pointer.x = Math.max(0, Math.min(world.width - 1, pointer.x));
  pointer.y = Math.max(0, Math.min(world.height - 1, pointer.y));
  if (drawing) stroke(from, pointer);
  showBrush(pointer);
});
canvas.addEventListener('keyup', event => { if (event.key === ' ') drawing = false; });
canvas.addEventListener('blur', () => { drawing = false; brush.hidden = true; });
window.addEventListener('blur', () => { drawing = false; activePointer = null; });
for (const button of document.querySelectorAll('[data-material]')) {
  button.addEventListener('click', () => {
    material = +button.dataset.material;
    for (const item of document.querySelectorAll('[data-material]')) item.setAttribute('aria-pressed', String(item === button));
  });
}
document.getElementById('pause').addEventListener('click', event => {
  paused = !paused;
  event.currentTarget.setAttribute('aria-pressed', String(paused));
  event.currentTarget.setAttribute('aria-label', paused ? 'Resume simulation' : 'Pause simulation');
  event.currentTarget.textContent = paused ? 'PLAY' : 'PAUSE';
});
document.getElementById('clear').addEventListener('click', () => world.cells.fill(0));
size.addEventListener('input', () => { if (pointer && !brush.hidden) showBrush(pointer); });

function render() {
  const data = pixels.data;
  for (let i = 0; i < world.cells.length; i++) {
    const type = world.cells[i], offset = i * 4;
    const grain = ((i * 13 + (i % world.width) * 7) % 19) - 9;
    data[offset] = type === SAND ? 214 + grain : type === WATER ? 65 : type === WALL ? 132 : 0;
    data[offset + 1] = type === SAND ? 187 + grain : type === WATER ? 139 : type === WALL ? 134 : 0;
    data[offset + 2] = type === SAND ? 128 + grain : type === WATER ? 190 : type === WALL ? 141 : 0;
    data[offset + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0);
}
let previous = 0, accumulated = 0;
function frame(time) {
  accumulated += Math.min(time - previous, 50);
  previous = time;
  while (accumulated >= 1000 / 60) {
    if (drawing && pointer) paint(pointer);
    if (!paused) world.step();
    accumulated -= 1000 / 60;
  }
  render();
  requestAnimationFrame(frame);
}
new ResizeObserver(resize).observe(canvas);
resize();
requestAnimationFrame(frame);
