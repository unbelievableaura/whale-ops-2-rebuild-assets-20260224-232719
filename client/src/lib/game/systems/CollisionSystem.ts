import { EntityManager } from "../ecs/EntityManager";
import { Collider, Health, Transform } from "../components";

export const CollisionSystem = (entityManager: EntityManager) => {
  const entities = entityManager.getEntitiesWithComponents(["Transform", "Collider"]);

  // Simple AABB Collision
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const entityA = entities[i];
      const entityB = entities[j];

      const transformA = entityManager.getComponent<Transform>(entityA, "Transform")!;
      const colliderA = entityManager.getComponent<Collider>(entityA, "Collider")!;
      
      const transformB = entityManager.getComponent<Transform>(entityB, "Transform")!;
      const colliderB = entityManager.getComponent<Collider>(entityB, "Collider")!;

      // Check collision
      if (
        transformA.x < transformB.x + colliderB.width &&
        transformA.x + colliderA.width > transformB.x &&
        transformA.y < transformB.y + colliderB.height &&
        transformA.y + colliderA.height > transformB.y
      ) {
        handleCollision(entityManager, entityA, colliderA, entityB, colliderB);
      }
    }
  }
};

const handleCollision = (
  entityManager: EntityManager, 
  entityA: number, 
  colliderA: Collider, 
  entityB: number, 
  colliderB: Collider
) => {
  // Player Projectile hits Enemy (Ground or Air)
  if (
    (colliderA.tag === "projectile" && (colliderB.tag === "enemy" || colliderB.tag === "air_enemy")) ||
    ((colliderA.tag === "enemy" || colliderA.tag === "air_enemy") && colliderB.tag === "projectile")
  ) {
    // Destroy both (one shot kill for now)
    entityManager.destroyEntity(entityA);
    entityManager.destroyEntity(entityB);
  }

  // Enemy Projectile hits Player
  if (
    (colliderA.tag === "enemy_projectile" && colliderB.tag === "player") ||
    (colliderA.tag === "player" && colliderB.tag === "enemy_projectile")
  ) {
    // Destroy projectile
    if (colliderA.tag === "enemy_projectile") entityManager.destroyEntity(entityA);
    if (colliderB.tag === "enemy_projectile") entityManager.destroyEntity(entityB);
    
    // Damage player
    const health = entityManager.getComponent<Health>(entityB, "Health");
    if (health) {
      health.current -= 10; // 10 damage per hit
      console.log(`Player Hit! HP: ${health.current}`);
      
      if (health.current <= 0) {
        // Game Over Logic (for now just reset or log)
        console.log("GAME OVER");
        // Optional: Trigger game over state
      }
    }
  }
};
