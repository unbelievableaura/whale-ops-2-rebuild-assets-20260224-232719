import { EntityManager } from "../ecs/EntityManager";
import { Transform, Velocity, AIControl, Weapon, createTransform, createVelocity, createSprite, createCollider, createLifetime } from "../components";

export const AISystem = (entityManager: EntityManager, currentTime: number) => {
  const aiEntities = entityManager.getEntitiesWithComponents(["Transform", "Velocity", "AIControl"]);
  const playerEntities = entityManager.getEntitiesWithComponents(["PlayerControl", "Transform"]);

  if (playerEntities.length === 0) return;
  const player = playerEntities[0];
  const playerTransform = entityManager.getComponent<Transform>(player, "Transform")!;

  aiEntities.forEach(entity => {
    const transform = entityManager.getComponent<Transform>(entity, "Transform")!;
    const velocity = entityManager.getComponent<Velocity>(entity, "Velocity")!;
    const ai = entityManager.getComponent<AIControl>(entity, "AIControl")!;
    const weapon = entityManager.getComponent<Weapon>(entity, "Weapon");

    const dx = playerTransform.x - transform.x;
    const dy = playerTransform.y - transform.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // State Machine
    switch (ai.state) {
      case "idle":
        if (distance < ai.detectionRange) {
          ai.state = "chase";
        } else {
          // Wander slowly
          if (Math.random() < 0.02) {
            velocity.vx += (Math.random() - 0.5) * 0.5;
            velocity.vy += (Math.random() - 0.5) * 0.5;
          }
        }
        break;

      case "chase":
        if (distance > ai.detectionRange * 1.5) {
          ai.state = "idle";
        } else {
          // Move towards player
          const speed = 0.05; // Enemy speed
          let moveX = (dx / distance) * speed;
          let moveY = (dy / distance) * speed;

          // Separation Logic (Avoid stacking)
          const separationRadius = 50;
          let sepX = 0;
          let sepY = 0;
          let count = 0;

          aiEntities.forEach(other => {
            if (entity === other) return;
            const otherTransform = entityManager.getComponent<Transform>(other, "Transform")!;
            const dist = Math.sqrt(Math.pow(transform.x - otherTransform.x, 2) + Math.pow(transform.y - otherTransform.y, 2));
            
            if (dist < separationRadius) {
              sepX += transform.x - otherTransform.x;
              sepY += transform.y - otherTransform.y;
              count++;
            }
          });

          if (count > 0) {
            const sepStrength = 0.002; // Adjust strength of separation
            moveX += sepX * sepStrength;
            moveY += sepY * sepStrength;
          }

          velocity.vx += moveX;
          velocity.vy += moveY;
          
          // Rotate towards player
          transform.rotation = Math.atan2(dy, dx);

          // Shoot if has weapon and in range
          if (weapon && distance < 400 && currentTime - weapon.lastFired >= weapon.cooldown) {
             weapon.lastFired = currentTime;
             
             // Create Enemy Projectile
             const projectile = entityManager.createEntity();
             const offset = 20;
             const spawnX = transform.x + Math.cos(transform.rotation) * offset;
             const spawnY = transform.y + Math.sin(transform.rotation) * offset;

             entityManager.addComponent(projectile, createTransform(spawnX, spawnY, transform.rotation, 1));
             
             const vx = Math.cos(transform.rotation) * weapon.projectileSpeed;
             const vy = Math.sin(transform.rotation) * weapon.projectileSpeed;
             
             entityManager.addComponent(projectile, createVelocity(vx, vy, 0));
             entityManager.addComponent(projectile, createSprite("#ff0000", 6, 6, 20)); // Red bullet
             entityManager.addComponent(projectile, createCollider(6, 6, "enemy_projectile"));
             entityManager.addComponent(projectile, createLifetime(2));
          }
        }
        break;

      case "strafe":
        // Air enemy behavior: Fly past the player and shoot
        const strafeSpeed = 0.15; // Faster than ground units
        
        // If too far, fly towards player
        if (distance > 600) {
           const moveX = (dx / distance) * strafeSpeed;
           const moveY = (dy / distance) * strafeSpeed;
           velocity.vx += moveX;
           velocity.vy += moveY;
           transform.rotation = Math.atan2(dy, dx);
        } else {
           // When close, keep current momentum but steer slightly towards player
           // This creates a strafing run effect
           const turnRate = 0.02;
           const targetAngle = Math.atan2(dy, dx);
           let currentAngle = transform.rotation;
           
           // Normalize angles
           while (targetAngle - currentAngle > Math.PI) currentAngle += Math.PI * 2;
           while (targetAngle - currentAngle < -Math.PI) currentAngle -= Math.PI * 2;
           
           const angleDiff = targetAngle - currentAngle;
           transform.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnRate);
           
           velocity.vx = Math.cos(transform.rotation) * strafeSpeed;
           velocity.vy = Math.sin(transform.rotation) * strafeSpeed;
           
           // Shoot rapidly when in strafing range
           if (weapon && currentTime - weapon.lastFired >= weapon.cooldown) {
             weapon.lastFired = currentTime;
             
             const projectile = entityManager.createEntity();
             const offset = 30;
             const spawnX = transform.x + Math.cos(transform.rotation) * offset;
             const spawnY = transform.y + Math.sin(transform.rotation) * offset;

             entityManager.addComponent(projectile, createTransform(spawnX, spawnY, transform.rotation, 1));
             
             // Add some spread to bullets
             const spread = (Math.random() - 0.5) * 0.2;
             const vx = Math.cos(transform.rotation + spread) * weapon.projectileSpeed;
             const vy = Math.sin(transform.rotation + spread) * weapon.projectileSpeed;
             
             entityManager.addComponent(projectile, createVelocity(vx, vy, 0));
             entityManager.addComponent(projectile, createSprite("#ffff00", 4, 8, 20)); // Yellow tracers
             entityManager.addComponent(projectile, createCollider(6, 6, "enemy_projectile"));
             entityManager.addComponent(projectile, createLifetime(1.5));
           }
        }
        break;
    }
  });
};
