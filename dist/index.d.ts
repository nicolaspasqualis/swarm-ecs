import { Query } from "./query";
import { System } from "./system";
import { Entity } from "./entity";
declare function ECS(): {
    System: (name: string, query: Query, logic: (entities: Entity[]) => void) => void;
    Entity: (id: string) => Entity;
    Query: (components: string[]) => Query;
    deleteEntity: (entity: Entity) => void;
    getEntity: (id: string) => Entity | undefined;
    run: () => void;
};
export { ECS, Entity, System, Query };
