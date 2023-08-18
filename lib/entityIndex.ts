import { Entity } from "./entity";

export type EntityIndex = {
  get: (key: string) => Entity[];
  set: (key: string, entities: Entity[]) => void;
  update: (entity: Entity) => void;
}

export function EntitiesByQueryIndex(): EntityIndex {
  const queryResultsIndex = new Map();

  return {
    get: (key: string) => {
      return queryResultsIndex.get(key);
    },
    set: (key: string, entities: Entity[]) => {
      queryResultsIndex.set(key, entities);
    },
    update: (entity: Entity) => {
      // TODO: update each indexed query granularly 
      queryResultsIndex.clear();
    }
  }
}