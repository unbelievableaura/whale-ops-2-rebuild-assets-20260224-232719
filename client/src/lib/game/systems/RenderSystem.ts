import { EntityManager } from "../ecs/EntityManager";
import { Transform, Sprite } from "../components";
import { ResourceManager } from "../ResourceManager";

export const RenderSystem = (entityManager: EntityManager, ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // Clear screen
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, width, height);

  // Draw Grid
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  const gridSize = 50;
  
  ctx.beginPath();
  for (let x = 0; x <= width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Get renderable entities
  const entities = entityManager.getEntitiesWithComponents(["Transform", "Sprite"]);

  // Sort by layer
  entities.sort((a, b) => {
    const spriteA = entityManager.getComponent<Sprite>(a, "Sprite")!;
    const spriteB = entityManager.getComponent<Sprite>(b, "Sprite")!;
    return spriteA.layer - spriteB.layer;
  });

  entities.forEach(entity => {
    const transform = entityManager.getComponent<Transform>(entity, "Transform")!;
    const sprite = entityManager.getComponent<Sprite>(entity, "Sprite")!;

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.rotate(transform.rotation);
    ctx.scale(transform.scale, transform.scale);

    // Draw Sprite
    if (sprite.image) {
      const img = ResourceManager.loadImage(sprite.image);
      if (img.complete) {
        ctx.drawImage(img, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      } else {
        // Fallback while loading
        ctx.fillStyle = sprite.color;
        ctx.fillRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      }
    } else {
      ctx.fillStyle = sprite.color;
      ctx.fillRect(-sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
      
      // Draw Direction Indicator only for non-image sprites (usually debug)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(0, -2, sprite.width / 2 + 10, 4);
    }

    ctx.restore();
  });
};
