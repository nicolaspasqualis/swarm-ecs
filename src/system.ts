import { Query } from "./query";
import { Entity } from "./entity";

export type System = {
  name: string;
  query: Query;
  update: (entities: Entity[]) => void;
}

export const System = (
  name: string, 
  query: Query, 
  logic: (entities: Entity[]) => void
): System => ({ 
  name,
  query,
  update: (entities: Entity[]) => { 
    logic(query.filter(entities));
  }
})