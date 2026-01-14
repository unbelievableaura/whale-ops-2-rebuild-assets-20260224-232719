import { EntityManager } from "../ecs/EntityManager";
import { Transform, Velocity } from "../components";

export const MovementSystem = (entityManager: EntityManager, dt: number) => {
  const entities = entityManager.getEntitiesWithComponents(["Transform", "Velocity"]);

  entities.forEach(entity => {
    const transform = entityManager.getComponent<Transform>(entity, "Transform")!;
    const velocity = entityManager.getComponent<Velocity>(entity, "Velocity")!;

    // Apply velocity to position
    transform.x += velocity.vx * dt;
    transform.y += velocity.vy * dt;

    // Apply friction
    if (velocity.friction > 0) {
      velocity.vx *= Math.pow(1 - velocity.friction, dt * 60);
      velocity.vy *= Math.pow(1 - velocity.friction, dt * 60);

      // Stop if very slow
      if (Math.abs(velocity.vx) < 0.1) velocity.vx = 0;
      if (Math.abs(velocity.vy) < 0.1) velocity.vy = 0;
    }
  });
};
