Page({
  data: {
    bgColor: '',
    title: '',
    clothSize: 30,
    tension: 50,
    gravity: 50,
    wind: 0,
    tearStrength: 95,
    damping: 99,
  },

  onLoad: function (options) {
    // 页面已经准备好，可以执行一些额外的初始化操作
    const { title, color } = options;
    // 动态设置 bgColor 和 itemName
    this.setData({
      bgColor: `bg-gradual-${color}`,
      title: title
    });

    this.canvas = wx.createCanvasContext('canvas');
    const canvas = wx.createSelectorQuery().select('#canvas');
    canvas.boundingClientRect(rect => {
      this.initCanvas(rect);
    }).exec();
  },

  initCanvas: function (rect) {
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    const ctx = this.canvas;

    // 设置画布尺寸
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    // 初始化物理模拟
    this.initSimulation(ctx, canvasWidth, canvasHeight);
  },

  initSimulation: function (ctx, canvasWidth, canvasHeight) {
    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = x;
        this.vx = 0;
        this.vy = 0;
        this.pinned = false;
        this.tension = 0;
      }

      update(dt) {
        if (this.pinned) return;

        const vx = (this.x - this.oldX) * friction;
        const vy = (this.y - this.oldY) * friction;

        this.oldX = this.x;
        this.oldY = this.y;

        this.x += vx;
        this.y += vy;

        this.y += gravityStrength * dt;
        this.x += windStrength * dt;

        this.x += (Math.random() - 0.5) * fluidMotion;
        this.y += (Math.random() - 0.5) * fluidMotion;

        this.x = Math.max(0, Math.min(this.x, canvasWidth));
        this.y = Math.max(0, Math.min(this.y, canvasHeight));
      }
    }

    class Stick {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        this.stiffness = 0.5;
        this.tension = 0;
      }

      update() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const distance = Math.hypot(dx, dy);
        const difference = this.length - distance;
        const percent = (difference / distance) * this.stiffness;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (!this.p1.pinned) {
          this.p1.x -= offsetX * stickStrength;
          this.p1.y -= offsetY * stickStrength;
        }
        if (!this.p2.pinned) {
          this.p2.x += offsetX * stickStrength;
          this.p2.y += offsetY * stickStrength;
        }

        this.tension = Math.abs(difference) / tearStrength;
        this.p1.tension = Math.max(this.p1.tension, this.tension);
        this.p2.tension = Math.max(this.p2.tension, this.tension);

        if (tearStrength < 50) {
          if (Math.abs(difference) > tearStrength && this.p1 !== draggedPoint && this.p2 !== draggedPoint) {
            return true;
          }
        }
        return false;
      }
    }

    let points = [];
    let sticks = [];
    let draggedPoint = null;
    let mouseX = 0;
    let mouseY = 0;

    let friction = 0.99;
    let gravityStrength = 0.5;
    let windStrength = 0;
    const fluidMotion = 0.05;
    let stickStrength = 0.03;
    let tearStrength = 47.5;
    let clothSize = 30;

    function createCloth() {
      points = [];
      sticks = [];

      const rows = clothSize;
      const cols = clothSize;
      const spacing = Math.min(canvasWidth, canvasHeight) * 0.7 / (clothSize + 5);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p = new Point(
              canvasWidth / 2 - cols * spacing / 2 + x * spacing,
              canvasHeight * 0.1 + y * spacing
          );
          if (y === 0) {
            p.pinned = true;
          }
          points.push(p);

          if (x > 0) {
            sticks.push(new Stick(points[y * cols + x], points[y * cols + x - 1]));
          }
          if (y > 0) {
            sticks.push(new Stick(points[y * cols + x], points[(y - 1) * cols + x]));
          }
        }
      }
    }

    function getTensionColor(tension) {
      tension = Math.min(tension, 1);
      const r = Math.floor(255 * tension);
      const g = Math.floor(255 * (1 - tension));
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }

    function update(dt) {
      points.forEach(p => {
        p.update(dt);
        p.tension = 0;
      });

      if (draggedPoint && !draggedPoint.pinned) {
        draggedPoint.x = mouseX;
        draggedPoint.y = mouseY;
      }

      sticks = sticks.filter(stick => !stick.update());

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      sticks.forEach(s => {
        ctx.strokeStyle = getTensionColor(s.tension);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
        ctx.stroke();
      });

      points.forEach(p => {
        ctx.fillStyle = getTensionColor(p.tension);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      points.filter(p => p.pinned).forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (draggedPoint) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(draggedPoint.x, draggedPoint.y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.draw();
      requestAnimationFrame(() => update(1 / 60));
    }

    function init() {
      createCloth();
      update(1 / 60);
    }

    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      draggedPoint = getClosestPoint(mouseX, mouseY);
    });

    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
    });

    canvas.addEventListener('touchend', () => {
      draggedPoint = null;
    });

    init();
  },

  getClosestPoint: function (x, y) {
    let closestPoint = null;
    let minDistance = Infinity;

    points.forEach(p => {
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = p;
      }
    });

    return minDistance < 20 ? closestPoint : null;
  }
});
