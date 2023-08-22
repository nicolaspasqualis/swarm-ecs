import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Entity } from "./entity";

export type Query = {
  // returns true if the entity matches with the query
  match: (entity: Entity) => boolean,

  // returns a filtered list of all entities that match with the query
  filter: (entities: Entity[]) => Entity[],
}

export type ArchetypeFilter = {
  all?: Archetype,
  any?: Archetype,
  none?: Archetype,
}

export type ComponentFilter = {
  all?: string[],
  any?: string[],
  none?: string[],
}

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

export function IndexedQuery(query: Query, indexKey: string, entityIndex: EntityIndex)
: Query {
  return {
    match: query.match,
    filter: (entities: Entity[]) =>  {
      const indexedResult = entityIndex.get(indexKey);
      
      if (!indexedResult) {
        const result = query.filter(entities);
        entityIndex.set(indexKey, result);
        return result;
      }
  
      return indexedResult;
    },
  }
}