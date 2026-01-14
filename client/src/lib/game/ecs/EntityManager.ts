export type EntityId = number;

export interface Component {
  _type: string;
}

export class EntityManager {
  private nextEntityId: EntityId = 0;
  private entities: Set<EntityId> = new Set();
  private components: Map<string, Map<EntityId, Component>> = new Map();
  private entitiesToDestroy: EntityId[] = [];

  createEntity(): EntityId {
    const id = this.nextEntityId++;
    this.entities.add(id);
    return id;
  }

  addComponent(entity: EntityId, component: Component) {
    if (!this.components.has(component._type)) {
      this.components.set(component._type, new Map());
    }
    this.components.get(component._type)!.set(entity, component);
  }

  getComponent<T extends Component>(entity: EntityId, type: string): T | undefined {
    return this.components.get(type)?.get(entity) as T | undefined;
  }

  hasComponent(entity: EntityId, type: string): boolean {
    return this.components.get(type)?.has(entity) ?? false;
  }

  removeComponent(entity: EntityId, type: string) {
    this.components.get(type)?.delete(entity);
  }

  getEntitiesWithComponents(types: string[]): EntityId[] {
    const result: EntityId[] = [];
    this.entities.forEach(entity => {
      if (types.every(type => this.hasComponent(entity, type))) {
        result.push(entity);
      }
    });
    return result;
  }

  destroyEntity(entity: EntityId) {
    this.entitiesToDestroy.push(entity);
  }

  flushDestroyedEntities() {
    for (const entity of this.entitiesToDestroy) {
      this.entities.delete(entity);
      Array.from(this.components.values()).forEach(componentMap => {
        componentMap.delete(entity);
      });
    }
    this.entitiesToDestroy = [];
  }
}
