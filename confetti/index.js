import Particle from "./js/Particle.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio > 1 ? 2 : 1;
const interval = 1000 / 60;

let canvasWidth, canvasHeight;

const particles = [];

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.scale(dpr, dpr);

  //   confetti({
  //     x: canvasWidth / 2,
  //     y: canvasHeight / 2,
  //     count: 10,
  //   });
}

function confetti({ x, y, count, deg, colors, shapes, spread }) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, deg, colors, shapes, spread));
  }
}

function render() {
  let now, delta;
  let then = Date.now();

  let deg = 0;

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //축하포;
    confetti({
      x: 0, // 0 ~ 1
      y: 0.5, // 0 ~ 1
      count: 5,
      deg: -50,
    });

    confetti({
      x: 1,
      y: 0.5,
      count: 5,
      deg: -130,
    });

    // 가운데에서 퍼지는 콘페티
    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 270,
    //   spread: 180,
    // });

    // 가운데서 회전하면서 퍼지는 콘페티
    // deg += 1;

    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 225 + deg,
    //   spread: 1,
    // });
    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 90 + deg,
    //   spread: 1,
    // });
    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 315 + deg,
    //   spread: 1,
    // });

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].opacity < 0) particles.splice(i, 1);
      if (particles[i].y > canvasHeight) particles.splice(i, 1);
    }

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("click", () => {
  confetti({
    x: 0,
    y: 0.5,
    count: 10,
    deg: -50,
    spread: 1,
  });
});
window.addEventListener("load", () => {
  init();
  render();
});
window.addEventListener("resize", () => {
  init();
});
