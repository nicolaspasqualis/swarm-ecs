import { System, Stage } from "./system";
/** Manages the scheduling of systems in an ECS architecture. */
export type SystemScheduler = {
    /** Adds a new system to the scheduler. */
    addSystem: (system: System) => void;
    /** Gets the list of systems in execution order. */
    getSchedule: () => System[];
};
export declare const Stages: {
    readonly INIT: "INIT";
    readonly POST_INIT: "POSTINIT";
    readonly PRE_UPDATE: "PREUPDATE";
    readonly UPDATE: "UPDATE";
    readonly POST_UPDATE: "POSTUPDATE";
    readonly PRE_RENDER: "PRERENDER";
    readonly RENDER: "RENDER";
};
/**
 * Type representing the default execution stages.
 * Check {@link DefaultOrder} for the default ordering used by the {@link SystemScheduler}.
 */
export type Stages = (typeof Stages)[keyof typeof Stages];
/** Initializes a stage-based scheduler from a list of stage names in order of execution */
export declare function StageBasedScheduler(executionStages?: Stage[]): SystemScheduler;
