export default class CanvasOption {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio;
    this.fps = 60;
    this.interval = 1000 / this.fps;
    this.CANVAS_WIDTH = innerWidth;
    this.CANVAS_HEIGHT = innerHeight;
    this.bgColor = "#000000";
  }
}
