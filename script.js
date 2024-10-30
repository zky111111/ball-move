class Shape {
    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.element = document.createElement('div');
        this.element.className = 'shape';
        this.element.style.width = this.element.style.height = `${this.size}px`;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        document.body.appendChild(this.element);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    remove() {
        this.element.remove();
    }
}

class Ball extends Shape {
    constructor(size, x, y, velocityX, velocityY) {
        super(size, x, y);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.element.className += ' ball';
        this.element.style.backgroundColor = getRandomColor();
    }

    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    bounce() {
        if (this.x <= 0 || this.x >= window.innerWidth - this.size) {
            this.velocityX *= -1;
        }
        if (this.y <= 0 || this.y >= window.innerHeight - this.size) {
            this.velocityY *= -1;
        }
    }
}

class DevilRing extends Shape {
    constructor(size, x, y) {
        super(size, x, y);
        this.element.className += ' devil-ring';
    }

    move(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.y = Math.max(0, this.y - 10);
                break;
            case 'ArrowDown':
                this.y = Math.min(window.innerHeight - this.size, this.y + 10);
                break;
            case 'ArrowLeft':
                this.x = Math.max(0, this.x - 10);
                break;
            case 'ArrowRight':
                this.x = Math.min(window.innerWidth - this.size, this.x + 10);
                break;
        }
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function checkCollision(ball1, ball2) {
    const rect1 = ball1.getBoundingClientRect();
    const rect2 = ball2.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}
function updateScoreboard(ballsLeft) {
    document.getElementById('scoreboard').textContent = `Balls Left: ${ballsLeft}`;
}
function updateBalls() {
    balls.forEach(ball => {
        ball.bounce(); // 更新小球速度
        ball.update(); // 更新小球位置

        // 检查弹球之间是否碰撞并变色
        balls.forEach(otherBall => {
            if (ball !== otherBall && checkCollision(ball.element, otherBall.element)) {
                ball.element.style.backgroundColor = getRandomColor();
                otherBall.element.style.backgroundColor = getRandomColor();
            }
        });

        // 检查恶魔圈是否抓到弹球
        if (checkCollision(ball.element, devilRing.element)) {
            document.body.removeChild(ball.element);
            balls.splice(balls.indexOf(ball), 1);
        }
    });
    updateScoreboard(balls.length);
    requestAnimationFrame(updateBalls);
}

// 初始化弹球和恶魔圈
const balls = [];
const ballCount = 25;
const ballSize = 40;
const speed = 2;
const devilRingSize = 50;

const devilRing = new DevilRing(devilRingSize, (window.innerWidth - devilRingSize) / 2, (window.innerHeight - devilRingSize) / 2);

for (let i = 0; i < ballCount; i++) {
    const x = Math.random() * (window.innerWidth - ballSize);
    const y = Math.random() * (window.innerHeight - ballSize);
    const ball = new Ball(ballSize, x, y, (Math.random() > 0.5 ? speed : -speed), (Math.random() > 0.5 ? speed : -speed));
    balls.push(ball);
}

function moveDevilRing(event) {
    devilRing.move(event);
}
updateScoreboard(balls.length);
document.addEventListener('keydown', moveDevilRing);

updateBalls();