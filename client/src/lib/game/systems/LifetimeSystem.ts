import { EntityManager } from "../ecs/EntityManager";
import { Lifetime } from "../components";

export const LifetimeSystem = (entityManager: EntityManager, dt: number) => {
  const entities = entityManager.getEntitiesWithComponents(["Lifetime"]);

  entities.forEach(entity => {
    const lifetime = entityManager.getComponent<Lifetime>(entity, "Lifetime")!;
    lifetime.remaining -= dt;

    if (lifetime.remaining <= 0) {
      entityManager.destroyEntity(entity);
    }
  });
};
