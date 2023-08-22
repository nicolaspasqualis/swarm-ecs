import { System, Stage } from "./system";
export type SystemScheduler = {
    addSystem: (system: System) => void;
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
export type Stages = (typeof Stages)[keyof typeof Stages];
export declare function StageBasedScheduler(executionStages?: Stage[]): SystemScheduler;
