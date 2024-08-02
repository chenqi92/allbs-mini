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
        hairColor: 'black',
        dyeColorOffset: '50%',
        backgroundColors: [
            // Add your background colors here
        ],
        mouthPoints: [],
    },

    onLoad() {
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
            eyeHeightOffset: randomFromInterval(this.data.faceHeight / 8, this.data.faceHeight / 6),
            leftEyeOffsetX: randomFromInterval(-this.data.faceWidth / 20, this.data.faceWidth / 10),
            leftEyeOffsetY: randomFromInterval(-this.data.faceHeight / 50, this.data.faceHeight / 50),
            rightEyeOffsetX: randomFromInterval(-this.data.faceWidth / 20, this.data.faceWidth / 10),
            rightEyeOffsetY: randomFromInterval(-this.data.faceHeight / 50, this.data.faceHeight / 50)
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
                hairColor: this.data.hairColor[Math.floor(Math.random() * 10)]
            });
        } else {
            this.setData({
                hairColor: 'url(#rainbowGradient)',
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

        // Clear the canvas
        ctx.clearRect(0, 0, 500, 500);

        // Background color
        ctx.setFillStyle(this.data.backgroundColors[Math.floor(Math.random() * this.data.backgroundColors.length)]);
        ctx.fillRect(0, 0, 500, 500);

        // Draw face contour
        ctx.setFillStyle('#ffc9a9');
        ctx.setStrokeStyle('black');
        ctx.setLineWidth(3.0 / this.data.faceScale);
        ctx.setLineJoin('round');
        ctx.beginPath();
        this.data.computedFacePoints.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point[0] + 250, point[1] + 250);
            } else {
                ctx.lineTo(point[0] + 250, point[1] + 250);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw hair lines
        ctx.setStrokeStyle(this.data.hairColor);
        this.data.hairs.forEach(hairLine => {
            ctx.beginPath();
            hairLine.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0] + 250, point[1] + 250);
                } else {
                    ctx.lineTo(point[0] + 250, point[1] + 250);
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
                ctx.moveTo(point[0] + 250, point[1] + 250);
            } else {
                ctx.lineTo(point[0] + 250, point[1] + 250);
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
                    ctx.moveTo(point[0] + 250, point[1] + 250);
                } else {
                    ctx.lineTo(point[0] + 250, point[1] + 250);
                }
            });
            ctx.stroke();

            // Draw lower part of eye
            ctx.beginPath();
            eyeLower.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point[0] + 250, point[1] + 250);
                } else {
                    ctx.lineTo(point[0] + 250, point[1] + 250);
                }
            });
            ctx.stroke();

            // Draw eye contour
            ctx.beginPath();
            ctx.moveTo(eyeUpper[0][0] + 250, eyeUpper[0][1] + 250);
            eyeUpper.forEach(point => ctx.lineTo(point[0] + 250, point[1] + 250));
            eyeLower.slice().reverse().forEach(point => ctx.lineTo(point[0] + 250, point[1] + 250));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw pupils
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                const r = Math.random() * 2 + 3.0;
                const cx = centerX + Math.random() * 5 - 2.5;
                const cy = centerY + Math.random() * 5 - 2.5;
                ctx.arc(cx + 250, cy + 250, r, 0, 2 * Math.PI);
                ctx.setStrokeStyle('black');
                ctx.setLineWidth(1.0 + Math.random() * 0.5);
                ctx.stroke();
            }
        };

        // Draw left eye
        const leftEyeCenterX = 250 - this.data.distanceBetweenEyes + this.data.leftEyeOffsetX;
        const leftEyeCenterY = 250 + this.data.eyeHeightOffset + this.data.leftEyeOffsetY;
        drawEye(this.data.eyeLeftUpper, this.data.eyeLeftLower, leftEyeCenterX, leftEyeCenterY);

        // Draw right eye
        const rightEyeCenterX = 250 + this.data.distanceBetweenEyes + this.data.rightEyeOffsetX;
        const rightEyeCenterY = 250 + this.data.eyeHeightOffset + this.data.rightEyeOffsetY;
        drawEye(this.data.eyeRightUpper, this.data.eyeRightLower, rightEyeCenterX, rightEyeCenterY);

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
