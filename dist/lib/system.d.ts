import { Query } from "./query";
import { Entity } from "./entity";
export type Stage = string;
/**
 * Represents a system in an ECS architecture.
 * @typedef {object} System
 */
export type System = {
    /** The name identifying the system. */
    name: string;
    /** The stage in which the system is executed. */
    stage: Stage;
    /** The query used to fetch relevant entities each tick. */
    query: Query;
    /** Advances the system by one tick. */
    update: (entities: Entity[]) => void;
};
export declare const System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => System;
