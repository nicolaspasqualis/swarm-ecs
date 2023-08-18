import { ArchetypeResolver, BitmaskArchetypeResolver } from "./archetype";
import { EntityIndex, EntitiesByQueryIndex } from "./entityIndex";
import { Query, ArchetypeQuery, IndexedQuery } from "./query";
import { Component } from "./component";
import { System } from "./system";
import { Entity } from "./entity";

type ECS = {
  // Creates and registers a new system
  System: (name: string, query: Query, logic: (entities: Entity[]) => void) => void,

  // Creates and registers a new entity
  Entity: (id: string) => Entity,
  
  // Creates a registers a new  uery
  Query: (components: string[]) => Query,
  
  // Removes the provided entity from  the ECS 
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
  const systems: System[] = [];

  const ecs = {
    System: (
      name: string,
      query: Query,
      logic: (entities: Entity[]) => void
    ) => {
      systems.push(System(name, query, logic));
    },

    Entity: (id: string) => {
      const entity = Entity(id, archetypeResolver, entityIndex);
      entities.set(entity.id, entity);
      entityIndex.update(entity);
      return entity;
    },

    Query: (components: string[]) => {
      const archetype = archetypeResolver.getAll(components);
      return IndexedQuery(
        ArchetypeQuery(archetype, archetypeResolver),
        String(archetype),
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
      for (const system of systems) {
        system.update(entityArray);
      }
    },
  };

  return ecs;
}

export { ECS, Entity, Component, System, Query }
