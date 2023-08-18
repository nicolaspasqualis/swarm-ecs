import { Entity } from "./entity";
export type EntityIndex = {
    get: (key: string) => Entity[];
    set: (key: string, entities: Entity[]) => void;
    update: (entity: Entity) => void;
};
export declare function EntitiesByQueryIndex(): EntityIndex;
