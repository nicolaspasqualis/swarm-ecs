import { Query } from "./query";
import { Entity } from "./entity";
export type Stage = string;
export type System = {
    name: string;
    stage: Stage;
    query: Query;
    update: (entities: Entity[]) => void;
};
export declare const System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => System;
