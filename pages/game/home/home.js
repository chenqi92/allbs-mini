Page({
  canvas: null,
  ctx: null,
  points: [],
  sticks: [],
  draggedPoint: null,
  mouseX: 0,
  mouseY: 0,

  onLoad() {
    this.canvas = wx.createCanvasContext('canvas');
    this.ctx = this.canvas;
    this.init();
  },

  init() {
    this.createCloth();
    this.update();
  },

  resetCloth() {
    this.createCloth();
  },

  createCloth() {
    this.points = [];
    this.sticks = [];
    const clothSize = 30;
    const rows = clothSize;
    const cols = clothSize;
    const spacing = Math.min(wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight) * 0.7 / (clothSize + 5);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const p = this.createPoint(
            wx.getSystemInfoSync().windowWidth / 2 - cols * spacing / 2 + x * spacing,
            wx.getSystemInfoSync().windowHeight * 0.1 + y * spacing
        );
        if (y === 0) {
          p.pinned = true;
        }
        this.points.push(p);

        if (x > 0) {
          this.sticks.push(this.createStick(this.points[y * cols + x], this.points[y * cols + x - 1]));
        }
        if (y > 0) {
          this.sticks.push(this.createStick(this.points[y * cols + x], this.points[(y - 1) * cols + x]));
        }
      }
    }
  },

  createPoint(x, y) {
    return {
      x: x,
      y: y,
      oldX: x,
      oldY: y,
      vx: 0,
      vy: 0,
      pinned: false,
      tension: 0,
    };
  },

  createStick(p1, p2) {
    return {
      p1: p1,
      p2: p2,
      length: Math.hypot(p1.x - p2.x, p1.y - p2.y),
      stiffness: 0.5,
      tension: 0,
    };
  },

  update() {
    this.points.forEach(p => {
      this.updatePoint(p);
      p.tension = 0;
    });

    if (this.draggedPoint && !this.draggedPoint.pinned) {
      this.draggedPoint.x = this.mouseX;
      this.draggedPoint.y = this.mouseY;
    }

    this.sticks = this.sticks.filter(stick => !this.updateStick(stick));

    this.ctx.clearRect(0, 0, wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight);
    this.draw();
    this.ctx.draw();

    wx.nextTick(() => this.update());
  },

  updatePoint(p) {
    if (p.pinned) return;

    const friction = 0.99;
    const gravityStrength = 0.5;
    const vx = (p.x - p.oldX) * friction;
    const vy = (p.y - p.oldY) * friction;

    p.oldX = p.x;
    p.oldY = p.y;

    p.x += vx;
    p.y += vy;
    p.y += gravityStrength;
  },

  updateStick(stick) {
    const dx = stick.p2.x - stick.p1.x;
    const dy = stick.p2.y - stick.p1.y;
    const distance = Math.hypot(dx, dy);
    const difference = stick.length - distance;
    const percent = (difference / distance) * stick.stiffness;
    const offsetX = dx * percent;
    const offsetY = dy * percent;

    if (!stick.p1.pinned) {
      stick.p1.x -= offsetX;
      stick.p1.y -= offsetY;
    }
    if (!stick.p2.pinned) {
      stick.p2.x += offsetX;
      stick.p2.y += offsetY;
    }

    stick.tension = Math.abs(difference) / 50;

    return false;
  },

  draw() {
    this.sticks.forEach(s => {
      this.ctx.strokeStyle = this.getTensionColor(s.tension);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(s.p1.x, s.p1.y);
      this.ctx.lineTo(s.p2.x, s.p2.y);
      this.ctx.stroke();
    });

    this.points.forEach(p => {
      this.ctx.fillStyle = this.getTensionColor(p.tension);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    this.points.filter(p => p.pinned).forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    });

    if (this.draggedPoint) {
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(this.draggedPoint.x, this.draggedPoint.y, 7, 0, Math.PI * 2);
      this.ctx.fill();
    }
  },

  getTensionColor(tension) {
    tension = Math.min(tension, 1);
    const r = Math.floor(255 * tension);
    const g = Math.floor(255 * (1 - tension));
    return `rgb(${r}, ${g}, 0)`;
  },

  onTouchStart(e) {
    this.mouseX = e.touches[0].x;
    this.mouseY = e.touches[0].y;
    this.draggedPoint = this.getClosestPoint(this.mouseX, this.mouseY);
  },

  onTouchMove(e) {
    this.mouseX = e.touches[0].x;
    this.mouseY = e.touches[0].y;
  },

  onTouchEnd() {
    this.draggedPoint = null;
  },

  getClosestPoint(x, y) {
    let closestPoint = null;
    let minDistance = Infinity;

    this.points.forEach(p => {
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = p;
      }
    });

    return minDistance < 20 ? closestPoint : null;
  },
});
