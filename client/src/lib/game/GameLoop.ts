import { EntityManager } from "./ecs/EntityManager";

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1 / 60;
  private isRunning: boolean = false;
  private animationFrameId: number = 0;

  public inputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
    mouseX: 0,
    mouseY: 0
  };

  constructor(
    private entityManager: EntityManager,
    private update: (dt: number) => void,
    private render: () => void
  ) {
    this.setupInputListeners();
  }

  private setupInputListeners() {
    window.addEventListener("keydown", (e) => this.handleKey(e, true));
    window.addEventListener("keyup", (e) => this.handleKey(e, false));
    window.addEventListener("mousemove", (e) => {
      this.inputState.mouseX = e.clientX;
      this.inputState.mouseY = e.clientY;
    });
    window.addEventListener("mousedown", () => this.inputState.shoot = true);
    window.addEventListener("mouseup", () => this.inputState.shoot = false);
  }

  private handleKey(e: KeyboardEvent, isPressed: boolean) {
    switch (e.code) {
      case "KeyW": this.inputState.up = isPressed; break;
      case "KeyS": this.inputState.down = isPressed; break;
      case "KeyA": this.inputState.left = isPressed; break;
      case "KeyD": this.inputState.right = isPressed; break;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }

    this.render();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
