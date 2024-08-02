// pages/index/index.js
import { generateFaceCountourPoints } from '../../../utils/face_shape.js';
import { generateBothEyes } from '../../../utils/eye_shape.js';
import { generateHairLines0, generateHairLines1, generateHairLines2, generateHairLines3 } from '../../../utils/hair_lines.js';
import { generateMouthShape0, generateMouthShape1, generateMouthShape2 } from '../../../utils/mouth_shape.js';

function randomFromInterval(min, max) {
    return Math.random() * (max - min) + min;
}

Page({
    data: {
        faceScale: 1.8,
        computedFacePoints: [],
        eyeRightUpper: [],
        eyeRightLower: [],
        eyeRightCountour: [],
        eyeLeftUpper: [],
        eyeLeftLower: [],
        eyeLeftCountour: [],
        faceHeight: 0,
        faceWidth: 0,
        center: [0, 0],
        distanceBetweenEyes: 0,
        leftEyeOffsetX: 0,
        leftEyeOffsetY: 0,
        rightEyeOffsetX: 0,
        rightEyeOffsetY: 0,
        eyeHeightOffset: 0,
        leftEyeCenter: [0, 0],
        rightEyeCenter: [0, 0],
        rightPupilShiftX: 0,
        rightPupilShiftY: 0,
        leftPupilShiftX: 0,
        leftPupilShiftY: 0,
        rightNoseCenterX: 0,
        rightNoseCenterY: 0,
        leftNoseCenterX: 0,
        leftNoseCenterY: 0,
        hairs: [],
        haventSleptForDays: false,
        hairColors: [
            "rgb(0, 0, 0)", // Black
            "rgb(44, 34, 43)", // Dark Brown
            "rgb(80, 68, 68)", // Medium Brown
            "rgb(167, 133, 106)", // Light Brown
            "rgb(220, 208, 186)", // Blond
            "rgb(233, 236, 239)", // Platinum Blond
            "rgb(165, 42, 42)", // Red
            "rgb(145, 85, 61)", // Auburn
            "rgb(128, 128, 128)", // Grey
            "rgb(185, 55, 55)", // Fire
            "rgb(255, 192, 203)", // Pastel Pink
            "rgb(255, 105, 180)", // Bright Pink
            "rgb(230, 230, 250)", // Lavender
            "rgb(64, 224, 208)", // Turquoise
            "rgb(0, 191, 255)", // Bright Blue
            "rgb(148, 0, 211)", // Deep Purple
            "rgb(50, 205, 50)", // Lime Green
            "rgb(255, 165, 0)", // Vivid Orange
            "rgb(220, 20, 60)", // Crimson Red
            "rgb(192, 192, 192)", // Silver
            "rgb(255, 215, 0)", // Gold
            "rgb(255, 255, 255)", // White
            "rgb(124, 252, 0)", // Lawn Green
            "rgb(127, 255, 0)", // Chartreuse
            "rgb(0, 255, 127)", // Spring Green
            "rgb(72, 209, 204)", // Medium Turquoise
            "rgb(0, 255, 255)", // Cyan
            "rgb(0, 206, 209)", // Dark Turquoise
            "rgb(32, 178, 170)", // Light Sea Green
            "rgb(95, 158, 160)", // Cadet Blue
            "rgb(70, 130, 180)", // Steel Blue
            "rgb(176, 196, 222)", // Light Steel Blue
            "rgb(30, 144, 255)", // Dodger Blue
            "rgb(135, 206, 235)", // Sky Blue
            "rgb(0, 0, 139)", // Dark Blue
            "rgb(138, 43, 226)", // Blue Violet
            "rgb(75, 0, 130)", // Indigo
            "rgb(139, 0, 139)", // Dark Magenta
            "rgb(153, 50, 204)", // Dark Orchid
            "rgb(186, 85, 211)", // Medium Orchid
            "rgb(218, 112, 214)", // Orchid
            "rgb(221, 160, 221)", // Plum
            "rgb(238, 130, 238)", // Violet
            "rgb(255, 0, 255)", // Magenta
            "rgb(216, 191, 216)", // Thistle
            "rgb(255, 20, 147)", // Deep Pink
            "rgb(255, 69, 0)", // Orange Red
            "rgb(255, 140, 0)", // Dark Orange
            "rgb(255, 165, 0)", // Orange
            "rgb(250, 128, 114)", // Salmon
            "rgb(233, 150, 122)", // Dark Salmon
            "rgb(240, 128, 128)", // Light Coral
            "rgb(205, 92, 92)", // Indian Red
            "rgb(255, 99, 71)", // Tomato
            "rgb(255, 160, 122)", // Light Salmon
            "rgb(220, 20, 60)", // Crimson
            "rgb(139, 0, 0)", // Dark Red
            "rgb(178, 34, 34)", // Fire Brick
            "rgb(250, 235, 215)", // Antique White
            "rgb(255, 239, 213)", // Papaya Whip
            "rgb(255, 235, 205)", // Blanched Almond
            "rgb(255, 222, 173)", // Navajo White
            "rgb(245, 245, 220)", // Beige
            "rgb(255, 228, 196)", // Bisque
            "rgb(255, 218, 185)", // Peach Puff
            "rgb(244, 164, 96)", // Sandy Brown
            "rgb(210, 180, 140)", // Tan
            "rgb(222, 184, 135)", // Burly Wood
            "rgb(250, 250, 210)", // Light Goldenrod Yellow
            "rgb(255, 250, 205)", // Lemon Chiffon
            "rgb(255, 245, 238)", // Sea Shell
            "rgb(253, 245, 230)", // Old Lace
            "rgb(255, 228, 225)", // Misty Rose
            "rgb(255, 240, 245)", // Lavender Blush
            "rgb(250, 240, 230)", // Linen
            "rgb(255, 228, 181)", // Moccasin
            "rgb(255, 250, 250)", // Snow
            "rgb(240, 255, 255)", // Azure
            "rgb(240, 255, 240)", // Honeydew
            "rgb(245, 245, 245)", // White Smoke
            "rgb(245, 255, 250)", // Mint Cream
            "rgb(240, 248, 255)", // Alice Blue
            "rgb(240, 248, 255)", // Ghost White
            "rgb(248, 248, 255)", // Ghost White
            "rgb(255, 250, 240)", // Floral White
            "rgb(253, 245, 230)", // Old Lace
        ],
        hairColor: 'black',
        hairGradient: null,
        dyeColorOffset: '50%',
        backgroundColors: [
            "rgb(245, 245, 220)", // Soft Beige
            "rgb(176, 224, 230)", // Pale Blue
            "rgb(211, 211, 211)", // Light Grey
            "rgb(152, 251, 152)", // Pastel Green
            "rgb(255, 253, 208)", // Cream
            "rgb(230, 230, 250)", // Muted Lavender
            "rgb(188, 143, 143)", // Dusty Rose
            "rgb(135, 206, 235)", // Sky Blue
            "rgb(245, 255, 250)", // Mint Cream
            "rgb(245, 222, 179)", // Wheat
            "rgb(47, 79, 79)", // Dark Slate Gray
            "rgb(72, 61, 139)", // Dark Slate Blue
            "rgb(60, 20, 20)", // Dark Brown
            "rgb(25, 25, 112)", // Midnight Blue
            "rgb(139, 0, 0)", // Dark Red
            "rgb(85, 107, 47)", // Olive Drab
            "rgb(128, 0, 128)", // Purple
            "rgb(0, 100, 0)", // Dark Green
            "rgb(0, 0, 139)", // Dark Blue
            "rgb(105, 105, 105)", // Dim Gray
            "rgb(240, 128, 128)", // Light Coral
            "rgb(255, 160, 122)", // Light Salmon
            "rgb(255, 218, 185)", // Peach Puff
            "rgb(255, 228, 196)", // Bisque
            "rgb(255, 222, 173)", // Navajo White
            "rgb(255, 250, 205)", // Lemon Chiffon
            "rgb(250, 250, 210)", // Light Goldenrod Yellow
            "rgb(255, 239, 213)", // Papaya Whip
            "rgb(255, 245, 238)", // Sea Shell
            "rgb(255, 248, 220)", // Cornsilk
            "rgb(255, 255, 240)", // Ivory
            "rgb(240, 255, 240)", // Honeydew
            "rgb(240, 255, 255)", // Azure
            "rgb(240, 248, 255)", // Alice Blue
            "rgb(248, 248, 255)", // Ghost White
            "rgb(255, 250, 250)", // Snow
            "rgb(255, 240, 245)", // Lavender Blush
            "rgb(255, 228, 225)", // Misty Rose
            "rgb(230, 230, 250)", // Lavender
            "rgb(216, 191, 216)", // Thistle
            "rgb(221, 160, 221)", // Plum
            "rgb(238, 130, 238)", // Violet
            "rgb(218, 112, 214)", // Orchid
            "rgb(186, 85, 211)", // Medium Orchid
            "rgb(147, 112, 219)", // Medium Purple
            "rgb(138, 43, 226)", // Blue Violet
            "rgb(148, 0, 211)", // Dark Violet
            "rgb(153, 50, 204)", // Dark Orchid
            "rgb(139, 69, 19)", // Saddle Brown
            "rgb(160, 82, 45)", // Sienna
            "rgb(210, 105, 30)", // Chocolate
            "rgb(205, 133, 63)", // Peru
            "rgb(244, 164, 96)", // Sandy Brown
            "rgb(222, 184, 135)", // Burly Wood
            "rgb(255, 250, 240)", // Floral White
            "rgb(253, 245, 230)", // Old Lace
            "rgb(250, 240, 230)", // Linen
        ],
        mouthPoints: [],
        canvasWidth: 0,
        canvasHeight: 0,
        canvasCenter: [0, 0],
        bgColor: '',
        title: ''
    },

    onLoad(options) {
        // 页面已经准备好，可以执行一些额外的初始化操作
        const { title, color } = options;
        // 动态设置 bgColor 和 itemName
        this.setData({
            bgColor: `bg-gradual-${color}`,
            title: title
        });
        const res = wx.getSystemInfoSync();
        const canvasWidth = res.windowWidth;
        const canvasHeight = canvasWidth;
        this.setData({
            canvasWidth,
            canvasHeight,
            canvasCenter: [canvasWidth / 2, canvasHeight / 2]
        });
        this.generateFace();
    },

    generateFace() {
        this.faceScale = 1.5 + Math.random() * 0.6;
        this.haventSleptForDays = Math.random() > 0.8;

        const faceResults = generateFaceCountourPoints();
        this.setData({
            computedFacePoints: faceResults.face,
            faceHeight: faceResults.height,
            faceWidth: faceResults.width,
            center: faceResults.center
        });

        const eyes = generateBothEyes(this.data.faceWidth / 2);
        const left = eyes.left;
        const right = eyes.right;
        this.setData({
            eyeRightUpper: right.upper,
            eyeRightLower: right.lower,
            eyeRightCountour: right.upper.slice(10, 90).concat(right.lower.slice(10, 90).reverse()),
            eyeLeftUpper: left.upper,
            eyeLeftLower: left.lower,
            eyeLeftCountour: left.upper.slice(10, 90).concat(left.lower.slice(10, 90).reverse())
        });

        this.setData({
            distanceBetweenEyes: randomFromInterval(this.data.faceWidth / 4.5, this.data.faceWidth / 4),
            eyeHeightOffset: randomFromInterval(-this.data.faceHeight / 3, -this.data.faceHeight / 4), // 将眼睛位置上移
            leftEyeOffsetX: randomFromInterval(-this.data.faceWidth / 20, this.data.faceWidth / 10),
            leftEyeOffsetY: randomFromInterval(-this.data.faceHeight / 20, this.data.faceHeight / 20),
            rightEyeOffsetX: randomFromInterval(-this.data.faceWidth / 20, this.data.faceWidth / 10),
            rightEyeOffsetY: randomFromInterval(-this.data.faceHeight / 20, this.data.faceHeight / 20),
            rightNoseCenterX: randomFromInterval(this.data.faceWidth / 18, this.data.faceWidth / 12),
            rightNoseCenterY: randomFromInterval(0, this.data.faceHeight / 5),
            leftNoseCenterX: randomFromInterval(-this.data.faceWidth / 18, -this.data.faceWidth / 12),
            leftNoseCenterY: this.data.rightNoseCenterY + randomFromInterval(-this.data.faceHeight / 30, this.data.faceHeight / 20)
        });

        const leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
        const rightInd0 = Math.floor(randomFromInterval(10, right.upper.length - 10));
        const leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
        const rightInd1 = Math.floor(randomFromInterval(10, right.upper.length - 10));
        const leftLerp = randomFromInterval(0.2, 0.8);
        const rightLerp = randomFromInterval(0.2, 0.8);

        this.setData({
            leftPupilShiftY: left.upper[leftInd0][1] * leftLerp + left.lower[leftInd1][1] * (1 - leftLerp),
            rightPupilShiftY: right.upper[rightInd0][1] * rightLerp + right.lower[rightInd1][1] * (1 - rightLerp),
            leftPupilShiftX: left.upper[leftInd0][0] * leftLerp + left.lower[leftInd1][0] * (1 - leftLerp),
            rightPupilShiftX: right.upper[rightInd0][0] * rightLerp + right.lower[rightInd1][0] * (1 - rightLerp)
        });

        let hairs = [];
        if (Math.random() > 0.3) {
            hairs = generateHairLines0(this.data.computedFacePoints, randomFromInterval(10, 50));
        }
        if (Math.random() > 0.3) {
            hairs = hairs.concat(generateHairLines1(this.data.computedFacePoints, randomFromInterval(10, 50)));
        }
        if (Math.random() > 0.5) {
            hairs = hairs.concat(generateHairLines2(this.data.computedFacePoints, randomFromInterval(10, 50)));
        }
        if (Math.random() > 0.5) {
            hairs = hairs.concat(generateHairLines3(this.data.computedFacePoints, randomFromInterval(10, 50)));
        }
        this.setData({
            hairs
        });

        this.setData({
            rightNoseCenterX: randomFromInterval(this.data.faceWidth / 18, this.data.faceWidth / 12),
            rightNoseCenterY: randomFromInterval(0, this.data.faceHeight / 5),
            leftNoseCenterX: randomFromInterval(-this.data.faceWidth / 18, -this.data.faceWidth / 12),
            leftNoseCenterY: this.data.rightNoseCenterY + randomFromInterval(-this.data.faceHeight / 30, this.data.faceHeight / 20)
        });

        if (Math.random() > 0.1) {
            // use natural hair color
            this.setData({
                hairColor: this.data.hairColors[Math.floor(Math.random() * 10)]
            });
        } else {
            this.setData({
                hairColor: 'gradient',
                dyeColorOffset: randomFromInterval(0, 100) + '%'
            });
        }

        const choice = Math.floor(Math.random() * 3);
        let mouthPoints = [];
        if (choice === 0) {
            mouthPoints = generateMouthShape0(this.data.computedFacePoints, this.data.faceHeight, this.data.faceWidth);
        } else if (choice === 1) {
            mouthPoints = generateMouthShape1(this.data.computedFacePoints, this.data.faceHeight, this.data.faceWidth);
        } else {
            mouthPoints = generateMouthShape2(this.data.computedFacePoints, this.data.faceHeight, this.data.faceWidth);
        }
        this.setData({
            mouthPoints
        });

        this.drawFace();
    },

    drawFace() {
        const ctx = wx.createCanvasContext('faceCanvas', this);
        const centerX = this.data.canvasCenter[0];
        const centerY = this.data.canvasCenter[1];
        const scale = this.data.canvasWidth * 0.85 / Math.max(this.data.faceWidth, this.data.faceHeight);

        // Clear the canvas
        ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

        // Background color
        ctx.setFillStyle(this.data.backgroundColors[Math.floor(Math.random() * this.data.backgroundColors.length)]);
        ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);

        // Draw face contour
        ctx.setFillStyle('#ffc9a9');
        ctx.setStrokeStyle('black');
        ctx.setLineWidth(3.0 / this.data.faceScale);
        ctx.setLineJoin('round');
        ctx.beginPath();
        this.data.computedFacePoints.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
            } else {
                ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Create hair gradient
        if (this.data.hairColor === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, this.data.canvasWidth, 0);
            gradient.addColorStop(0, this.data.hairColors[Math.floor(Math.random() * this.data.hairColors.length)]);
            gradient.addColorStop(0.5, this.data.hairColors[Math.floor(Math.random() * this.data.hairColors.length)]);
            gradient.addColorStop(1, this.data.hairColors[Math.floor(Math.random() * this.data.hairColors.length)]);
            this.setData({ hairGradient: gradient });
            ctx.setStrokeStyle(this.data.hairGradient);
        } else {
            ctx.setStrokeStyle(this.data.hairColor);
        }

        // Draw hair lines
        this.data.hairs.forEach(hairLine => {
            ctx.beginPath();
            hairLine.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
                } else {
                    ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
                }
            });
            ctx.stroke();
        });

        // Draw mouth shape
        ctx.setFillStyle('rgb(215,127,140)');
        ctx.setStrokeStyle('black');
        ctx.setLineWidth(2.7 + Math.random() * 0.5);
        ctx.setLineJoin('round');
        ctx.beginPath();
        this.data.mouthPoints.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
            } else {
                ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw eyes
        const drawEye = (eyeUpper, eyeLower, centerX, centerY) => {
            ctx.setFillStyle('white');
            ctx.setStrokeStyle('black');
            ctx.setLineWidth(this.data.haventSleptForDays ? 5.0 / this.data.faceScale : 3.0 / this.data.faceScale);
            ctx.setLineJoin('round');
            ctx.setLineCap('round');

            // Draw upper part of eye
            ctx.beginPath();
            eyeUpper.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
                } else {
                    ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
                }
            });
            ctx.stroke();

            // Draw lower part of eye
            ctx.beginPath();
            eyeLower.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0] * scale + centerX, point[1] * scale + centerY);
                } else {
                    ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY);
                }
            });
            ctx.stroke();

            // Draw eye contour
            ctx.beginPath();
            ctx.moveTo(eyeUpper[0][0] * scale + centerX, eyeUpper[0][1] * scale + centerY);
            eyeUpper.forEach(point => ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY));
            eyeLower.slice().reverse().forEach(point => ctx.lineTo(point[0] * scale + centerX, point[1] * scale + centerY));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw pupils
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                const r = Math.random() * 2 + 3.0;
                const cx = centerX + Math.random() * 5 - 2.5;
                const cy = centerY + Math.random() * 5 - 2.5;
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.setStrokeStyle('black');
                ctx.setLineWidth(1.0 + Math.random() * 0.5);
                ctx.stroke();
            }
        };

        // Draw left eye
        const leftEyeCenterX = centerX - this.data.distanceBetweenEyes * scale + this.data.leftEyeOffsetX * scale;
        const leftEyeCenterY = centerY + this.data.eyeHeightOffset * scale + this.data.leftEyeOffsetY * scale;
        drawEye(this.data.eyeLeftUpper, this.data.eyeLeftLower, leftEyeCenterX, leftEyeCenterY);

        // Draw right eye
        const rightEyeCenterX = centerX + this.data.distanceBetweenEyes * scale + this.data.rightEyeOffsetX * scale;
        const rightEyeCenterY = centerY + this.data.eyeHeightOffset * scale + this.data.rightEyeOffsetY * scale;
        drawEye(this.data.eyeRightUpper, this.data.eyeRightLower, rightEyeCenterX, rightEyeCenterY);

        // Draw nose
        const drawNose = () => {
            const { rightNoseCenterX, rightNoseCenterY, leftNoseCenterX, leftNoseCenterY } = this.data;
            ctx.setFillStyle('black');
            ctx.setStrokeStyle('black');
            ctx.setLineWidth(2);

            if (Math.random() > 0.5) {
                // Point nose
                const noseRadius = Math.random() * 2 + 1.0;
                for (let i = 0; i < 10; i++) {
                    ctx.beginPath();
                    ctx.arc((rightNoseCenterX + Math.random() * 4 - 2) * scale + centerX,
                        (rightNoseCenterY + Math.random() * 4 - 2) * scale + centerY,
                        noseRadius, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc((leftNoseCenterX + Math.random() * 4 - 2) * scale + centerX,
                        (leftNoseCenterY + Math.random() * 4 - 2) * scale + centerY,
                        noseRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            } else {
                // Line nose
                ctx.beginPath();
                ctx.moveTo(leftNoseCenterX * scale + centerX, leftNoseCenterY * scale + centerY);
                ctx.quadraticCurveTo(
                    rightNoseCenterX * scale + centerX, rightNoseCenterY * 1.5 * scale + centerY,
                    (leftNoseCenterX + rightNoseCenterX) / 2 * scale + centerX, -this.data.eyeHeightOffset * 0.2 * scale + centerY
                );
                ctx.stroke();
            }
        };

        drawNose();

        ctx.draw();
    },

    downloadCanvasAsImage() {
        wx.canvasToTempFilePath({
            canvasId: 'faceCanvas',
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success() {
                        wx.showToast({
                            title: 'Image saved!',
                            icon: 'success',
                            duration: 2000
                        });
                    },
                    fail() {
                        wx.showToast({
                            title: 'Save failed!',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                });
            },
            fail() {
                wx.showToast({
                    title: 'Download failed!',
                    icon: 'none',
                    duration: 2000
                });
            }
        });
    }
});
