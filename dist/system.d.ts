import { Query } from "./query";
import { Entity } from "./entity";
export type System = {
    name: string;
    query: Query;
    update: (entities: Entity[]) => void;
};
export declare const System: (name: string, query: Query, logic: (entities: Entity[]) => void) => System;
