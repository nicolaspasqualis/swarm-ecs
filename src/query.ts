import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Entity } from "./entity";

export type Query = {
  // returns true if the entity matches with the query
  match: (entity: Entity) => boolean,

  // returns a filtered list of all entities that match with the query
  filter: (entities: Entity[]) => Entity[],
}

export function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver): Query {
  const query = {
    match: (entity: Entity) => resolver.contains(entity.getArchetype(), archetype),
    filter: (entities: Entity[]) => entities.filter(query.match),
  };
  return query;
}

export function IndexedQuery(query: Query, indexKey: string, entityIndex: EntityIndex): Query {
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