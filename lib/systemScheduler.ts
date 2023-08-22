import { System, Stage } from "./system";

export type SystemScheduler = {
  // adds a new system to the scheduler
  addSystem: (system: System) => void;

  // returns the list of systems in execution order
  getSchedule: () => System[];
};

export const Stages = {
  INIT: "INIT",
  POST_INIT: "POSTINIT",
  PRE_UPDATE: "PREUPDATE",
  UPDATE: "UPDATE",
  POST_UPDATE: "POSTUPDATE",
  PRE_RENDER: "PRERENDER",
  RENDER: "RENDER",
} as const;

export type Stages = (typeof Stages)[keyof typeof Stages];

const DefaultOrder = [
  Stages.INIT,
  Stages.POST_INIT,
  Stages.PRE_UPDATE,
  Stages.UPDATE,
  Stages.POST_UPDATE,
  Stages.PRE_RENDER,
  Stages.RENDER,
];

// Initializes a stage-based scheduler from a list of stage names in order of execution
export function StageBasedScheduler(executionStages: Stage[] = DefaultOrder): SystemScheduler {
  const systemsByStage = new Map(
    executionStages.map((stage) => [stage as Stage, [] as System[]])
  );

  let orderedSystems: System[] = [];

  const orderSystems = () => {
    const systems: System[] = [];

    for (const stage of executionStages) {
      systemsByStage.get(stage)?.forEach((system) => {
        systems.push(system);
      });
    }

    orderedSystems = systems;
  };

  const scheduler = {
    addSystem: (system: System) => {
      systemsByStage.get(system.stage)?.push(system);
      orderSystems();
    },
    getSchedule: () => {
      return orderedSystems;
    },
  };

  return scheduler;
}
