import { Query } from ".";
import { Entity } from "./entity";
export type EntityIndex = {
    get: (query: Query) => Entity[];
    set: (query: Query, entities: Entity[]) => void;
    update: (entity: Entity) => void;
};
export declare function EntitiesByQueryIndex(): EntityIndex;
