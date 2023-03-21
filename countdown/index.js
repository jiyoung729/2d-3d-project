import Particle from "./js/Particle.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
const interval = 1000 / 60;

let canvasWidth, canvasHeight;

const particles = [];
const ringImg = document.querySelector("#ring");
const clickText = document.querySelector("#click-txt");

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
}

function createRing() {
  const PARTICLE_NUM = 800;
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push(new Particle());
  }
}

function aniRing() {
  const texts = document.querySelectorAll("#countdown span");
  const countDownOption = {
    opacity: 1,
    scale: 1,
    duration: 0.4,
    ease: "Power4.easeOut",
  };
  gsap.fromTo(
    texts[0],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 1,
    }
  );
  gsap.fromTo(
    texts[1],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 2,
      onStart: () => (texts[0].style.opacity = 0),
    }
  );
  gsap.fromTo(
    texts[2],
    { opacity: 0, scale: 5 },
    {
      ...countDownOption,
      delay: 3,
      onStart: () => (texts[1].style.opacity = 0),
    }
  );
  gsap.fromTo(
    ringImg,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 1,
      delay: 4,
      onStart: () => {
        createRing();
        texts[2].style.opacity = 0;
      },
    }
  );
  gsap.fromTo(clickText, { opacity: 1 }, { opacity: 0 });
}

function render() {
  let now, delta;
  let then = Date.now();

  const frame = () => {
    requestAnimationFrame(frame);
    // 프레임을 인자로 넣어 스스로 반복시키는 재귀함수로 만들어 현재 디스플레이 사양에 따라 매 프레임마다 실행이 될 수 있는 윈도우에 리퀘스트애니메이션을 실행
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // particles.forEach((particle, index) => {
    //   particle.update();
    //   particle.draw(ctx);

    //   if (particle.opacity < 0) particles.splice(index, 1);
    // });

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].opacity < 0) {
        particles.splice(i, 1);
        if (particles.length === 0) {
          ringImg.style.opacity = "1";
          clickText.style.opacity = "1";
          clickText.style.pointerEvents = "auto";
        }
      }
    }

    then = now - (delta % interval);
  };

  requestAnimationFrame(frame);
}

window.addEventListener("load", () => {
  init();
  render();
});
window.addEventListener("resize", () => {
  init();
});

clickText.addEventListener("click", () => {
  clickText.style.pointerEvents = "none";
  aniRing();
});
