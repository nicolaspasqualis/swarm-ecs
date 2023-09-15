import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Entity } from "./entity";
import { Component } from "./component";

/**
 * Represents a Query for filtering entities based on certain conditions.
 * @typedef {object} Query
 */
export type Query = {
  /**
   * Determines if a given entity matches with the query.
   * @param {Entity} entity - The entity to check against the query.
   * @returns {boolean} True if the entity matches, otherwise false.
   */
  match: (entity: Entity) => boolean,

  /**
   * Filters a list of entities based on the query.
   * @param {Entity[]} entities - The list of entities to filter.
   * @returns {Entity[]} A filtered list of entities that match the query.
   */
  filter: (entities: Entity[]) => Entity[],
};

/** Filters entities by archetypes. */
export type ArchetypeFilter = {
  /** Requires all specified archetypes. */
  all?: Archetype,
  /** Requires any of the specified archetypes. */
  any?: Archetype,
  /** Excludes entities with the specified archetypes. */
  none?: Archetype,
};

/** Filters entities by components. */
export type ComponentFilter = {
  /** Requires all specified components. */
  all?: Component[],
  /** Requires any of the specified components. */
  any?: Component[],
  /** Excludes entities with the specified components. */
  none?: Component[],
};


export function ArchetypeFilterQuery(filter: ArchetypeFilter, resolver: ArchetypeResolver): Query {
  const all = filter.all ?? resolver.getEmpty();
  const any = filter.any ?? resolver.getEmpty();
  const none = filter.none ?? resolver.getEmpty();

  const query = {
    match: (entity: Entity) => {
      const archetype = entity.getArchetype();
      return (
        resolver.contains(archetype, all) &&
        (resolver.intersects(archetype, any) || resolver.contains(archetype, any)) &&
        !resolver.intersects(archetype, none)
      )
    },
    filter: (entities: Entity[]) => entities.filter(query.match),
  };

  return query
}

export function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver)
: Query {
  const query = {
    match: (entity: Entity) => resolver.contains(entity.getArchetype(), archetype),
    filter: (entities: Entity[]) => entities.filter(query.match),
  };
  return query;
}

export function IndexedQuery(query: Query, entityIndex: EntityIndex)
: Query {
  return {
    match: query.match,
    filter: (entities: Entity[]) =>  {
      const indexedResult = entityIndex.get(query);
      
      if (!indexedResult) {
        const result = query.filter(entities);
        entityIndex.set(query, result);
        return result;
      }
  
      return indexedResult;
    },
  }
}