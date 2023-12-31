import { ArchetypeResolver, BitmaskArchetypeResolver } from "./archetype";
import { EntityIndex, EntitiesByQueryIndex } from "./entityIndex";
import { Query, ArchetypeFilterQuery, ComponentFilter, IndexedQuery } from "./query";
import { SystemScheduler, StageBasedScheduler } from "./systemScheduler";
import { System, Stage } from "./system";
import { Component } from "./component";
import { Entity } from "./entity";

/**
 * @typedef {object} ECS
 * Entity-Component-System interface.
 */
export type ECS = {
  /**
   * Creates and registers a new system.
   * @param {string} name - The name of the system.
   * @param {Stage} stage - The stage at which the system will run.
   * @param {Query} query - The query that selects entities for the system.
   * @param {(entities: Entity[]) => void} logic - Logic for each tick.
   */
  System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => void,

  /**
   * Creates and registers a new entity.
   * @returns {Entity} The newly created entity.
   */
  Entity: () => Entity,

  /**
   * Creates and registers a new query.
   * @param {...Component[]} components - Components to include in the query.
   * @param {ComponentFilter} filter - Filter condition for the query.
   * @returns {Query} The newly created query.
   */
  Query: ((...components: Component[]) => Query) & ((filter: ComponentFilter) => Query),

  /**
   * Removes the provided entity from the ECS.
   * @param {Entity} entity - The entity to remove.
   */
  deleteEntity: (entity: Entity) => void,

  /**
   * Retrieves an entity by its ID.
   * @param {number} id - The ID of the entity.
   * @returns {Entity | undefined} The retrieved entity or undefined if not found.
   */
  getEntity: (id: number) => Entity | undefined,

  /**
   * Advances the ECS one tick by running each system.
   */
  run: () => void,
}

type IdManager = {
  useId: () => number;
  freeId: (id: number) => void;
}

function IdManager(): IdManager {
  let nextPositiveId = 0;
  const recycledIds: number[] = [];

  return {
    useId: () => {
      if (recycledIds.length > 0) {
        return recycledIds.pop() as number;
      }
      
      return ++nextPositiveId;
    },
    freeId: (id: number) => {
      recycledIds.push(id);
    },
  };
}

/**
 * Creates a new ECS instance.
 * @returns {ECS} An instance of the ECS.
 */
export function ECS(): ECS {
  const archetypeResolver: ArchetypeResolver = BitmaskArchetypeResolver();
  const entityIndex: EntityIndex = EntitiesByQueryIndex();
  const entities: Map<number, Entity> = new Map();
  const systems: SystemScheduler = StageBasedScheduler();
  const idManager = IdManager();


  const ecs = {
    System: (
      name: string,
      stage: Stage,
      query: Query,
      logic: (entities: Entity[]) => void,
    ) => {
      systems.addSystem(System(name, stage, query, logic));
    },

    Entity: () => {
      const entity = Entity(idManager.useId(), archetypeResolver, entityIndex);
      entities.set(entity.getId(), entity);
      entityIndex.update(entity);
      return entity;
    },

    Query: (...args: any[]) => {
      const filter: ComponentFilter = typeof args[0] === 'object' // parse arguments >
        ? args[0] // > from ComponentFilter
        : { all: args as Component[] } // > from list of component names
      
      const all = filter.all && archetypeResolver.getAll(filter.all);
      const any = filter.any && archetypeResolver.getAll(filter.any);
      const none = filter.none && archetypeResolver.getAll(filter.none);

      return IndexedQuery(
        ArchetypeFilterQuery({all, any, none}, archetypeResolver),
        entityIndex
      );
    },

    deleteEntity: (entity: Entity) => {
      entities.delete(entity.getId());
      entityIndex.update(entity);
    },

    getEntity: (id: number) => entities.get(id),

    run: () => {
      const entityArray = [...entities.values()];
      for (const system of systems.getSchedule()) {
        system.update(entityArray);
      }
    },
  };

  return ecs;
}