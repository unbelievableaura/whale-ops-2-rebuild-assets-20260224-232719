import { EntityManager } from "../ecs/EntityManager";
import { Transform, Weapon, createTransform, createVelocity, createSprite, createCollider, createLifetime } from "../components";

export const ShootingSystem = (
  entityManager: EntityManager,
  inputState: { shoot: boolean },
  currentTime: number
) => {
  const entities = entityManager.getEntitiesWithComponents(["Transform", "Weapon"]);

  entities.forEach(entity => {
    const transform = entityManager.getComponent<Transform>(entity, "Transform")!;
    const weapon = entityManager.getComponent<Weapon>(entity, "Weapon")!;

    if (inputState.shoot && currentTime - weapon.lastFired >= weapon.cooldown) {
      weapon.lastFired = currentTime;

      // Create Projectile
      const projectile = entityManager.createEntity();
      
      // Spawn at player position, slightly offset forward
      const offset = 20;
      const spawnX = transform.x + Math.cos(transform.rotation) * offset;
      const spawnY = transform.y + Math.sin(transform.rotation) * offset;

      entityManager.addComponent(projectile, createTransform(spawnX, spawnY, transform.rotation, 1));
      
      // Velocity based on rotation
      const vx = Math.cos(transform.rotation) * weapon.projectileSpeed;
      const vy = Math.sin(transform.rotation) * weapon.projectileSpeed;
      
      entityManager.addComponent(projectile, createVelocity(vx, vy, 0)); // No friction for bullets
      entityManager.addComponent(projectile, createSprite("#ffff00", 8, 8, 20)); // Yellow bullet
      entityManager.addComponent(projectile, createCollider(8, 8, "projectile"));
      entityManager.addComponent(projectile, createLifetime(2)); // Destroy after 2 seconds
    }
  });
};
