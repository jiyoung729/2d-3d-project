import { hexToRgb, randomNumBetween } from "./utils.js";

export default class Particle {
  constructor(x, y, deg = 0, colors, shapes, spread = 30) {
    this.angle = (Math.PI / 180) * randomNumBetween(deg - spread, deg + spread);
    this.r = randomNumBetween(30, 100);
    this.x = x * innerWidth;
    this.y = y * innerHeight;

    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);

    this.friction = 0.89;
    this.gravity = 0.5;

    this.width = 12;
    this.height = 12;

    this.opacity = 1;

    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);

    this.rotation = randomNumBetween(0, 360);
    this.rotationDelta = randomNumBetween(-1, 1);
    // 시계방향과 반시계방향으로 돌 수 있음

    this.colors = colors || ["#FF577F", "FF884B", "FFD384", "FFF9B0"];
    this.color = hexToRgb(this.colors[Math.floor(randomNumBetween(0, this.colors.length))]);
    // 배열 안에 있는 인자 중 하나를 가짐

    this.shapes = shapes || ["circle", "square"];
    this.shape = this.shapes[Math.floor(randomNumBetween(0, this.shapes.length))];
  }
  update() {
    this.vy += this.gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    this.opacity -= 0.005;

    this.widthDelta += 2;
    this.heightDelta += 2;

    this.rotation += this.rotationDelta;
  }
  drawSquare(ctx) {
    ctx.fillRect(
      this.x,
      this.y,
      this.width * Math.cos((Math.PI / 180) * this.widthDelta),
      this.height * Math.sin((Math.PI / 180) * this.heightDelta)
    );
  }
  drawCircle(ctx) {
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      Math.abs(this.width * Math.cos((Math.PI / 180) * this.widthDelta)) / 2,
      Math.abs(this.height * Math.sin((Math.PI / 180) * this.heightDelta)) / 2,
      0,
      0,
      Math.PI * 2
    );
    // arc가 반지름 하나를 가지고 원을 그린다면, ellipse는 반지름 두개로 원을 그림
    // 반지름에 widht와 height값을 넣기 때문에 square보다 크기가 크기때문에 반지름으로 들어가는 부분에 나누기 2를 해줌
    // Math.abs로 음수가 나오지 않도록 절대값으로
    ctx.fill();
    ctx.closePath();
  }
  draw(ctx) {
    ctx.translate(this.x + this.width * 2, this.y + this.height * 2);
    ctx.rotate((Math.PI / 180) * this.rotation);
    ctx.translate(-this.x - this.width * 2, -this.y - this.height * 2);

    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;

    switch (this.shape) {
      case "square":
        this.drawSquare(ctx);
        break;
      case "circle":
        this.drawCircle(ctx);
        break;
    }

    ctx.resetTransform();
  }
}
