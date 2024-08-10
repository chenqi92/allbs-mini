const app = getApp(); // 确保能够访问全局变量

Page({
  canvasContext: null,
  data: {
    points: [],
    sticks: [],
    draggedPoint: null,
    friction: 0.99,
    gravityStrength: 0.5,
    windStrength: 0,
    fluidMotion: 0.05,
    stickStrength: 0.03,
    tearStrengthVal: 47.5, // Initial tear strength (95% of 50)
    clothSize: 30, // 固定初始大小
    bgColor: '',
    title: '',
  },

  onLoad(options) {
    const { title, color } = options;
    this.setData({
      bgColor: `bg-gradual-${color}`,
      title: title
    });

    const that = this;

    wx.createSelectorQuery().select('#canvas').node().exec((res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');

      // 获取设备屏幕尺寸
      const systemInfo = wx.getSystemInfoSync();
      canvas.width = systemInfo.windowWidth;
      canvas.height = systemInfo.windowHeight;

      that.canvasContext = ctx;
      that.canvas = canvas;

      // 调整 createCloth 以使用整个屏幕尺寸
      that.createCloth(canvas.width, canvas.height);
      that.updateCanvas(1 / 60);
    });
  },

  createCloth(canvasWidth, canvasHeight) {
    const { clothSize } = this.data;
    const that = this;

    const rows = clothSize;
    const cols = clothSize;
    const spacing = Math.min(canvasWidth, canvasHeight) * 0.7 / (clothSize + 5);
    let points = [];
    let sticks = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const p = that.createPoint(
            canvasWidth / 2 - cols * spacing / 2 + x * spacing,
            canvasHeight * 0.1 + y * spacing
        );
        if (y === 0) p.pinned = true;
        points.push(p);

        if (x > 0) sticks.push(that.createStick(points[y * cols + x], points[y * cols + x - 1]));
        if (y > 0) sticks.push(that.createStick(points[y * cols + x], points[(y - 1) * cols + x]));
      }
    }
    that.setData({ points, sticks });
  },

  createPoint(x, y) {
    return { x, y, oldX: x, oldY: y, vx: 0, vy: 0, pinned: false, tension: 0 };
  },

  createStick(p1, p2) {
    return { p1, p2, length: Math.hypot(p1.x - p2.x, p1.y - p2.y), stiffness: 0.5, tension: 0 };
  },

  getTensionColor(tension) {
    tension = Math.min(tension, 1); // Clamp tension to 1
    const r = Math.floor(255 * tension);
    const g = Math.floor(255 * (1 - tension));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  },

  updateCanvas(dt) {
    const { points, sticks } = this.data;
    const ctx = this.canvasContext;

    points.forEach(p => {
      this.updatePoint(p, dt);
      p.tension = 0; // Reset tension for recalculation
    });

    if (this.data.draggedPoint && !this.data.draggedPoint.pinned) {
      this.data.draggedPoint.x = this.data.mouseX;
      this.data.draggedPoint.y = this.data.mouseY;
    }

    this.setData({
      sticks: sticks.filter(stick => !this.updateStick(stick))
    });

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw sticks (cloth)
    sticks.forEach(s => {
      ctx.strokeStyle = this.getTensionColor(s.tension);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.p1.x, s.p1.y);
      ctx.lineTo(s.p2.x, s.p2.y);
      ctx.stroke();
    });

    // Draw points
    points.forEach(p => {
      ctx.fillStyle = this.getTensionColor(p.tension);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Highlight pinned points
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    points.filter(p => p.pinned).forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Highlight dragged point
    if (this.data.draggedPoint) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(this.data.draggedPoint.x, this.data.draggedPoint.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Use setTimeout instead of requestAnimationFrame
    setTimeout(() => {
      this.updateCanvas(1 / 60);
    }, 1000 / 60); // Approximate 60 FPS
  },

  updatePoint(p, dt) {
    if (p.pinned) return;

    const { friction, gravityStrength, windStrength, fluidMotion } = this.data;
    const vx = (p.x - p.oldX) * friction;
    const vy = (p.y - p.oldY) * friction;

    p.oldX = p.x;
    p.oldY = p.y;

    p.x += vx;
    p.y += vy;

    p.y += gravityStrength * dt;
    p.x += windStrength * dt;

    p.x += (Math.random() - 0.5) * fluidMotion;
    p.y += (Math.random() - 0.5) * fluidMotion;

    p.x = Math.max(0, Math.min(p.x, this.canvas.width));
    p.y = Math.max(0, Math.min(p.y, this.canvas.height));
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
      stick.p1.x -= offsetX * this.data.stickStrength;
      stick.p1.y -= offsetY * this.data.stickStrength;
    }
    if (!stick.p2.pinned) {
      stick.p2.x += offsetX * this.data.stickStrength;
      stick.p2.y += offsetY * this.data.stickStrength;
    }

    stick.tension = Math.abs(difference) / this.data.tearStrengthVal;
    stick.p1.tension = Math.max(stick.p1.tension, stick.tension);
    stick.p2.tension = Math.max(stick.p2.tension, stick.tension);

    // Check for tearing only if tear strength is not at maximum
    if (this.data.tearStrength < 50) {
      if (Math.abs(difference) > this.data.tearStrength && stick.p1 !== this.data.draggedPoint && stick.p2 !== this.data.draggedPoint) {
        return true; // Stick should be removed
      }
    }
    return false;
  }
});