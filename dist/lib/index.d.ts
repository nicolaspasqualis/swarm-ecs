import { Query, ComponentFilter } from "./query";
import { Stages } from "./systemScheduler";
import { Component, ComponentType } from "./component";
import { System, Stage } from "./system";
import { Entity } from "./entity";
type ECS = {
    System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => void;
    Entity: () => Entity;
    Query: ((...components: Component[]) => Query) & ((filter: ComponentFilter) => Query);
    deleteEntity: (entity: Entity) => void;
    getEntity: (id: number) => Entity | undefined;
    run: () => void;
};
declare function ECS(): ECS;
export { ECS, Entity, ComponentType, System, Stages, Query, ComponentFilter };
