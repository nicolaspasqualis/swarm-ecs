import { Query, ComponentFilter } from "./query";
import { Stage } from "./system";
import { Component } from "./component";
import { Entity } from "./entity";
export type ECS = {
    System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => void;
    Entity: () => Entity;
    Query: ((...components: Component[]) => Query) & ((filter: ComponentFilter) => Query);
    deleteEntity: (entity: Entity) => void;
    getEntity: (id: number) => Entity | undefined;
    run: () => void;
};
export declare function ECS(): ECS;
