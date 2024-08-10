Page({
  canvasContext: null,
  data: {
    points: [],
    sticks: [],
    draggedPoint: null,
    friction: 0.98,  // 增加阻尼系数
    gravityStrength: 0.5,
    windStrength: 0,
    fluidMotion: 0.03,  // 降低流体扰动系数
    stickStrength: 0.02,  // 降低连接杆的强度以减少计算量
    tearStrengthVal: 47.5,  // 撕裂强度阈值
    clothSize: 30,  // 降低布料点数量
    bgColor: '',
    title: '',
    containerHeight: 0,  // 容器高度
  },

  onLoad(options) {
    const { title, color } = options;
    this.setData({
      bgColor: `bg-gradual-${color}`,
      title: title
    });

    const that = this;

    // 获取屏幕尺寸并计算 container 高度
    const systemInfo = wx.getSystemInfoSync();
    const containerHeight = systemInfo.windowHeight - 100; // 100rpx 为 cu-custom 的高度
    this.setData({ containerHeight });

    wx.createSelectorQuery().select('#canvas').node().exec((res) => {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');

      // 设置 canvas 尺寸
      canvas.width = systemInfo.windowWidth;
      canvas.height = containerHeight;

      that.canvasContext = ctx;
      that.canvas = canvas;

      // 调整 createCloth 以使用整个屏幕尺寸
      that.createCloth(canvas.width, canvas.height);
      that.updateCanvas(1 / 30);  // 降低刷新频率到 30 FPS
    });
  },

  // 触摸开始
  onTouchStart(e) {
    const { x, y } = e.touches[0];
    const closestPoint = this.getClosestPoint(x, y);

    if (closestPoint && Math.hypot(closestPoint.x - x, closestPoint.y - y) <= 20) {
      this.data.draggedPoint = closestPoint;
    } else {
      this.data.draggedPoint = null;
    }
  },

  // 触摸移动
  onTouchMove(e) {
    const { x, y } = e.touches[0];
    this.data.mouseX = x;
    this.data.mouseY = y;
    if (this.data.draggedPoint && !this.data.draggedPoint.pinned) {
      this.data.draggedPoint.x = x;
      this.data.draggedPoint.y = y;
    }
  },

  // 触摸结束
  onTouchEnd() {
    this.data.draggedPoint = null;
  },

  getClosestPoint(x, y) {
    let closestPoint = null;
    let minDistance = Infinity;

    this.data.points.forEach(p => {
      const distance = Math.hypot(p.x - x, p.y - y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = p;
      }
    });

    return closestPoint;
  },

  createCloth(canvasWidth, canvasHeight) {
    const { clothSize } = this.data;
    const that = this;

    const rows = clothSize;
    const cols = Math.round(clothSize * (canvasWidth / canvasHeight)); // 根据宽高比调整列数
    const spacingX = canvasWidth / (cols - 1);  // 计算X方向的点间距
    const spacingY = canvasHeight / (rows - 1); // 计算Y方向的点间距

    let points = [];
    let sticks = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const p = that.createPoint(x * spacingX, y * spacingY);
        if (y === 0) p.pinned = true;  // 顶部点固定
        points.push(p);

        if (x > 0) {
          sticks.push(that.createStick(points[y * cols + x], points[y * cols + x - 1]));
        }
        if (y > 0) {
          sticks.push(that.createStick(points[y * cols + x], points[(y - 1) * cols + x]));
        }
      }
    }
    that.setData({ points, sticks });
  },

  createPoint(x, y) {
    return { x, y, oldX: x, oldY: y, vx: 0, vy: 0, pinned: false, tension: 0 };
  },

  createStick(p1, p2) {
    if (!p1 || !p2) return null;
    return { p1, p2, length: Math.hypot(p1.x - p2.x, p1.y - p2.y), stiffness: 0.5, tension: 0 };
  },

  getTensionColor(tension) {
    tension = Math.min(tension, 1);
    const r = Math.floor(255 * tension);
    const g = Math.floor(255 * (1 - tension));
    const b = 0;
    return `rgb(${r}, ${g}, ${b})`;
  },

  updateCanvas(dt) {
    const { points, sticks } = this.data;
    const ctx = this.canvasContext;

    // 更新点和连接杆
    points.forEach(p => {
      this.updatePoint(p, dt);
      p.tension = 0;
    });

    if (this.data.draggedPoint && !this.data.draggedPoint.pinned) {
      this.data.draggedPoint.x = this.data.mouseX;
      this.data.draggedPoint.y = this.data.mouseY;
    }

    this.setData({
      sticks: sticks.filter(stick => stick && !this.updateStick(stick))
    });

    // 绘制布料
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();

    sticks.forEach(s => {
      if (!s) return;
      ctx.strokeStyle = this.getTensionColor(s.tension);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.p1.x, s.p1.y);
      ctx.lineTo(s.p2.x, s.p2.y);
      ctx.stroke();
    });

    points.forEach(p => {
      ctx.fillStyle = this.getTensionColor(p.tension);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    setTimeout(() => {
      this.updateCanvas(1 / 30);  // 保持 30 FPS
    }, 1000 / 30);
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

    // 检查是否达到撕裂条件
    if (stick.tension > 1) {
      return true;
    }
    return false;
  }
});
