import { Query } from "./query";
import { Entity } from "./entity";

export type System = {
  // Name used to identify the system
  name: string;

  // Query used to fetch the required entities on each tick
  query: Query;
  
  // Runs the system one tick
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