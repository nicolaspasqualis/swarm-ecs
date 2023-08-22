export type Archetype = number;
export type ArchetypeResolver = {
    get: (component: string) => Archetype;
    getAll: (components: string[]) => Archetype;
    getEmpty: () => Archetype;
    add: (source: Archetype, toAdd: Archetype) => Archetype;
    contains: (container: Archetype, contained: Archetype) => boolean;
    intersects: (archetypeA: Archetype, archetypeB: Archetype) => boolean;
    remove: (source: Archetype, toRemove: Archetype) => Archetype;
    merge: (masks: Archetype[]) => Archetype;
};
export declare function BitmaskArchetypeResolver(): ArchetypeResolver;
