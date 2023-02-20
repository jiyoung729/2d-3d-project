const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

let CANVAS_WIDTH;
let CANVAS_HEIGHT;
let particles;

function init() {
  CANVAS_WIDTH = innerWidth;
  CANVAS_HEIGHT = innerHeight;

  canvas.style.width = CANVAS_WIDTH + "px";
  canvas.style.height = CANVAS_HEIGHT + "px";

  canvas.width = CANVAS_WIDTH * dpr; // dpr만큼 캔버스의 크기가 커짐
  canvas.height = CANVAS_HEIGHT * dpr;
  ctx.scale(dpr, dpr); // dpr만큼 요소도 커짐

  // 랜덤 파티클이 만들어지는 부분
  particles = [];
  const TOTAL = CANVAS_WIDTH / 60;

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, CANVAS_WIDTH);
    const y = randomNumBetween(0, CANVAS_HEIGHT);
    const radius = randomNumBetween(50, 100);
    const vy = randomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }

  //console.log(particles);
}

const feGussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");

const controls = new (function () {
  this.blurValue = 40;
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

let gui = new dat.GUI();

const f1 = gui.addFolder("Gooey Effect");
f1.open();

f1.add(controls, "blurValue", 0, 100).onChange((value) => {
  feGussianBlur.setAttribute("stdDeviation", value);
});
f1.add(controls, "alphaChannel", 1, 200).onChange((value) => {
  feColorMatrix.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`);
});
f1.add(controls, "alphaOffset", -40, 40).onChange((value) => {
  feColorMatrix.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`);
});

const f2 = gui.addFolder("Particle Property");
f2.open();
f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy; // 속도 설정
    this.acc = 1.03; // 중력 설정
  }
  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  }
}

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

let interval = 1000 / 60;
let now, delta;
let then = Date.now();

function animate() {
  window.requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > CANVAS_HEIGHT) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, CANVAS_WIDTH);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
}

window.addEventListener("load", () => {
  init();
  animate();
});
window.addEventListener("resize", () => {
  init();
});
