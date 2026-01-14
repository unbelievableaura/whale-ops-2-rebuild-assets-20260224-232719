export class Camera {
  x: number = 0;
  y: number = 0;
  shake: number = 0;

  targetX: number = 0;
  targetY: number = 0;

  update(dt: number) {
    if (this.shake > 0) {
      this.shake -= dt * 5; // Decay shake
      if (this.shake < 0) this.shake = 0;
    }
  }

  setTarget(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
  }

  getOffset() {
    // Basic camera follow logic could go here, but for now we keep it static centered
    // If we wanted scrolling, we'd return -targetX + screenWidth/2, etc.
    // For this fixed screen game, we just return shake offset.
    
    if (this.shake <= 0) return { x: 0, y: 0 };
    const angle = Math.random() * Math.PI * 2;
    const amount = this.shake * 10;
    return {
      x: Math.cos(angle) * amount,
      y: Math.sin(angle) * amount
    };
  }

  addShake(amount: number) {
    this.shake = Math.min(this.shake + amount, 2.0); // Cap max shake
  }
}
