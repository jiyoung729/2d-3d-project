import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import Tail from "./js/Tail.js";
import { hypotenuse, randomNumBetween } from "./js/utils.js";
import Spark from "./js/spark.js";

class Canvas extends CanvasOption {
  constructor() {
    super();
    // 부모 클래스에 선언된 변수나 메서드들을 자식 클래스(여기서는 canvas클래스)에서 this로 쉽게 가져다 쓸 수 있음

    this.tails = [];
    this.particles = [];
    this.sparks = [];
  }

  init() {
    this.CANVAS_WIDTH = innerWidth;
    this.CANVAS_HEIGHT = innerHeight;
    this.canvas.width = this.CANVAS_WIDTH * this.dpr;
    this.canvas.height = this.CANVAS_HEIGHT * this.dpr;
    // scale을 줘 캔버스 크기에 맞게 파티클을 조정
    this.ctx.scale(this.dpr, this.dpr);

    // dpr의 크기에 따라 화면과 파티클이 커지기 때문에 초기 값을 다시 css로 잡아주는 것을 정의함
    // 처음 초기화로 잡았던 사이즈를 스크립트에서 다시 잡아 원래 사이즈에서도 파티클이 같은 모양으로 보이도록 조정
    this.canvas.style.width = this.CANVAS_WIDTH + "px";
    this.canvas.style.height = this.CANVAS_HEIGHT + "px";

    this.createParticles();
  }

  createTail() {
    const x = randomNumBetween(this.CANVAS_WIDTH * 0.2, this.CANVAS_WIDTH * 0.8);
    const vy = this.CANVAS_HEIGHT * randomNumBetween(0.01, 0.015) * -1;
    const colorDeg = randomNumBetween(0, 360);
    this.tails.push(new Tail(x, vy, colorDeg));
  }

  createParticles(x, y, colorDeg) {
    const PARTICLE_NUM = 400;
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r = randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);
      const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
      this.particles.push(new Particle(x, y, vx, vy, opacity, _colorDeg));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;

      if (delta < this.interval) return;
      this.ctx.fillStyle = this.bgColor + "40"; // #00000010
      this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.particles.length / 40000})`;
      this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

      if (Math.random() < 0.03) this.createTail();

      this.tails.forEach((tail, index) => {
        tail.update();
        tail.draw();

        for (var i = 0; i < Math.round(-tail.vy * 0.5); i++) {
          const vx = randomNumBetween(-5, 5) * 0.05;
          const vy = randomNumBetween(-5, 5) * 0.05;
          const opacity = Math.min(-tail.vy, 0.5);
          this.sparks.push(new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg));
        }

        if (tail.vy > -0.7) {
          this.tails.splice(index, 1);
          this.createParticles(tail.x, tail.y, tail.colorDeg);
        }
      });

      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (Math.random() < 0.1) {
          this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45));
        }

        if (particle.opacity < 0) this.particles.splice(index, 1);
      });

      this.sparks.forEach((spark, index) => {
        spark.update();
        spark.draw();

        if (spark.opacity < 0) this.sparks.splice(index, 1);
      });

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});
window.addEventListener("resize", () => {
  canvas.init();
});
