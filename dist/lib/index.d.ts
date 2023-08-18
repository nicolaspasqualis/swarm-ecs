import { Query } from "./query";
import { Component } from "./component";
import { System } from "./system";
import { Entity } from "./entity";
type ECS = {
    System: (name: string, query: Query, logic: (entities: Entity[]) => void) => void;
    Entity: (id: string) => Entity;
    Query: (components: string[]) => Query;
    deleteEntity: (entity: Entity) => void;
    getEntity: (id: string) => Entity | undefined;
    run: () => void;
};
declare function ECS(): ECS;
export { ECS, Entity, Component, System, Query };
