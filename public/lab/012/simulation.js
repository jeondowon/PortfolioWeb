export const EMPTY = 0, SAND = 1, WATER = 2, WALL = 3;

export class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Uint8Array(width * height);
    this.moved = new Uint8Array(width * height);
    this.reverse = false;
  }

  paint(x, y, radius, material) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = x + dx, py = y + dy;
        if (dx * dx + dy * dy > radius * radius || px < 0 || px >= this.width || py < 0 || py >= this.height) continue;
        const i = py * this.width + px;
        if (material === EMPTY || this.cells[i] === EMPTY) this.cells[i] = material;
      }
    }
  }

  step() {
    const { width: w, height: h, cells, moved } = this;
    moved.fill(0);
    this.reverse = !this.reverse;
    const move = (from, x, y, material) => {
      if (x < 0 || x >= w || y < 0 || y >= h) return false;
      const to = y * w + x;
      if (cells[to] !== EMPTY && (moved[to] || !(material === SAND && cells[to] === WATER))) return false;
      cells[from] = cells[to];
      cells[to] = material;
      moved[from] = moved[to] = 1;
      return true;
    };
    // Bottom-up updates keep each grain to one vertical step per tick.
    for (let y = h - 1; y >= 0; y--) {
      for (let n = 0; n < w; n++) {
        const x = this.reverse ? w - n - 1 : n;
        const i = y * w + x, material = cells[i];
        if (moved[i] || (material !== SAND && material !== WATER)) continue;
        const dir = Math.random() < 0.5 ? -1 : 1;
        if (move(i, x, y + 1, material) || move(i, x + dir, y + 1, material) || move(i, x - dir, y + 1, material)) continue;
        if (material === WATER) {
          // Search sideways without crossing a wall or another particle.
          for (const direction of [dir, -dir]) {
            let target = x;
            for (let d = 1; d <= 4; d++) {
              const nx = x + direction * d;
              if (nx < 0 || nx >= w || cells[y * w + nx] !== EMPTY || moved[y * w + nx]) break;
              target = nx;
              if (y + 1 < h && cells[(y + 1) * w + nx] === EMPTY) break;
            }
            if (target !== x && move(i, target, y, material)) break;
          }
        }
      }
    }
  }
}
