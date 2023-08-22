import { Query } from "./query";
import { Entity } from "./entity";

export type Stage = string;

export type System = {
  // Name used to identify the system
  name: string;

  // Stage in which the system should be executed
  stage: Stage;

  // Query used to fetch the required entities on each tick
  query: Query;
  
  // Runs the system one tick
  update: (entities: Entity[]) => void;
}

export const System = (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void)
: System => ({ 
  name,
  stage,
  query,
  update: (entities: Entity[]) => { 
    logic(query.filter(entities));
  }
})