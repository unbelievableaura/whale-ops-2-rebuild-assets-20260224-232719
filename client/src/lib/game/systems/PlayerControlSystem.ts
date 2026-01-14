import { EntityManager } from "../ecs/EntityManager";
import { PlayerControl, Velocity, Transform } from "../components";

export const PlayerControlSystem = (
  entityManager: EntityManager, 
  inputState: { up: boolean; down: boolean; left: boolean; right: boolean; mouseX: number; mouseY: number },
  canvas: HTMLCanvasElement
) => {
  const entities = entityManager.getEntitiesWithComponents(["PlayerControl", "Velocity", "Transform"]);

  entities.forEach(entity => {
    const control = entityManager.getComponent<PlayerControl>(entity, "PlayerControl")!;
    const velocity = entityManager.getComponent<Velocity>(entity, "Velocity")!;
    const transform = entityManager.getComponent<Transform>(entity, "Transform")!;

    // Movement
    let dx = 0;
    let dy = 0;

    if (inputState.up) dy -= 1;
    if (inputState.down) dy += 1;
    if (inputState.left) dx -= 1;
    if (inputState.right) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    // Apply acceleration
    const acceleration = control.speed * 10; // Adjust responsiveness
    velocity.vx += dx * acceleration;
    velocity.vy += dy * acceleration;

    // Cap max speed
    const currentSpeed = Math.sqrt(velocity.vx * velocity.vx + velocity.vy * velocity.vy);
    if (currentSpeed > control.speed) {
      const scale = control.speed / currentSpeed;
      velocity.vx *= scale;
      velocity.vy *= scale;
    }

    // Rotation (Look at mouse)
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (inputState.mouseX - rect.left) * scaleX;
    const mouseY = (inputState.mouseY - rect.top) * scaleY;

    const angle = Math.atan2(mouseY - transform.y, mouseX - transform.x);
    transform.rotation = angle;
  });
};
