import { Component } from "./component";
export type Archetype = number;
export type ArchetypeResolver = {
    get: (component: Component) => Archetype;
    getAll: (components: Component[]) => Archetype;
    getEmpty: () => Archetype;
    add: (source: Archetype, toAdd: Archetype) => Archetype;
    contains: (container: Archetype, contained: Archetype) => boolean;
    intersects: (archetypeA: Archetype, archetypeB: Archetype) => boolean;
    remove: (source: Archetype, toRemove: Archetype) => Archetype;
    merge: (masks: Archetype[]) => Archetype;
};
export declare function BitmaskArchetypeResolver(): ArchetypeResolver;
