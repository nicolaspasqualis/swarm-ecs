import { Query } from ".";
import { Entity } from "./entity";

export type EntityIndex = {
  get: (query: Query) => Entity[] | undefined;
  set: (query: Query, entities: Entity[]) => void;
  update: (entity: Entity) => void;
}

export function EntitiesByQueryIndex(): EntityIndex {
  const queryResultsIndex = new Map<Query, Entity[]>();

  return {
    get: (query: Query) => {
      return queryResultsIndex.get(query);
    },
    set: (query: Query, entities: Entity[]) => {
      queryResultsIndex.set(query, entities);
    },
    update: (entity: Entity) => {
      // TODO: update each indexed query granularly 
      // queryResultsIndex should use sets instead for fast lookup if the 
      // result set contains or not the entity.
      // if(query.matches(entity)) { result.add(entity)} 
      // else { result.delete(entity) }
      
      queryResultsIndex.clear();
    }
  }
}