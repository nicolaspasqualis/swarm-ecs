import { ArchetypeResolver, BitmaskArchetypeResolver } from "./archetype";
import { EntityIndex, EntitiesByQueryIndex } from "./entityIndex";
import { Query, ArchetypeFilterQuery, ComponentFilter, IndexedQuery } from "./query";
import { SystemScheduler, StageBasedScheduler, Stages } from "./systemScheduler";
import { Component, ComponentType } from "./component";
import { System, Stage } from "./system";
import { Entity } from "./entity";

type ECS = {
  // Creates and registers a new system
  System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => void,

  // Creates and registers a new entity
  Entity: (id: string) => Entity,
  
  // Creates and registers a new query
  Query: ((...components: symbol[]) => Query) & ((filter: ComponentFilter) => Query),
  
  // Removes the provided entity from the ECS
  deleteEntity: (entity: Entity) => void,
  
  // Retrieves an entity
  getEntity: (id: string) => Entity | undefined,
  
  // Advances the ECS one tick by running each system
  run: () => void,
}

function ECS(): ECS {
  const archetypeResolver: ArchetypeResolver = BitmaskArchetypeResolver();
  const entityIndex: EntityIndex = EntitiesByQueryIndex();
  const entities: Map<string, Entity> = new Map();
  const systems: SystemScheduler = StageBasedScheduler();

  const ecs = {
    System: (
      name: string,
      stage: Stage,
      query: Query,
      logic: (entities: Entity[]) => void,
    ) => {
      systems.addSystem(System(name, stage, query, logic));
    },

    Entity: (id: string) => {
      const entity = Entity(id, archetypeResolver, entityIndex);
      entities.set(entity.id, entity);
      entityIndex.update(entity);
      return entity;
    },

    Query: (...args: any[]) => {
      const filter: ComponentFilter = typeof args[0] === 'object' // parse argument >
        ? args[0] // > from ComponentFilter
        : { all: args as string[] } // > from list of component names
      
      const all = filter.all && archetypeResolver.getAll(filter.all);
      const any = filter.any && archetypeResolver.getAll(filter.any);
      const none = filter.none && archetypeResolver.getAll(filter.none);

      return IndexedQuery(
        ArchetypeFilterQuery({all, any, none}, archetypeResolver),
        entityIndex
      );
    },

    deleteEntity: (entity: Entity) => {
      entities.delete(entity.id);
      entityIndex.update(entity);
    },

    getEntity: (id: string) => entities.get(id),

    run: () => {
      const entityArray = [...entities.values()];
      for (const system of systems.getSchedule()) {
        system.update(entityArray);
      }
    },
  };

  return ecs;
}

export { ECS, Entity, ComponentType, System, Stages, Query, ComponentFilter }
