declare function ECS(): {
    System: (name: string, query: Query, logic: (entities: Entity[]) => void) => void;
    Entity: (id: string) => Entity;
    Query: (components: string[]) => Query;
    deleteEntity: (entity: Entity) => void;
    getEntity: (id: string) => Entity | undefined;
    run: () => void;
};
type Entity = {
    id: string;
    getArchetype: () => Archetype;
    getComponent: (name: string) => Component | undefined;
    hasComponent: (name: string) => boolean;
    addComponent: (component: Component) => void;
    deleteComponent: (component: Component) => void;
};
declare function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity;
type Archetype = number;
type Component = {
    name: string;
    data: any;
};
declare const Component: (name: string, data: any) => Component;
type System = {
    name: string;
    query: Query;
    update: (entities: Entity[]) => void;
};
declare const System: (name: string, query: Query, logic: (entities: Entity[]) => void) => System;
type Query = {
    match: (entity: Entity) => boolean;
    filter: (entities: Entity[]) => Entity[];
};
declare function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver): Query;
declare function IndexedQuery(query: Query, indexKey: string, entityIndex: EntityIndex): Query;
type EntityIndex = {
    get: (key: string) => Entity[];
    set: (key: string, entities: Entity[]) => void;
    update: (entity: Entity) => void;
};
declare function QueryEntitiesIndex(): EntityIndex;
type ArchetypeResolver = {
    get: (component: string) => Archetype;
    getAll: (components: string[]) => Archetype;
    add: (source: Archetype, toAdd: Archetype) => Archetype;
    contains: (container: Archetype, contained: Archetype) => boolean;
    remove: (source: Archetype, toRemove: Archetype) => Archetype;
    merge: (masks: Archetype[]) => Archetype;
};
declare function BitmaskArchetypeResolver(): ArchetypeResolver;
declare const Bitmask: {
    fromBitIndex: (index: number) => number;
    add: (sourceMask: number, maskToAdd: number) => number;
    remove: (sourceMask: number, maskToRemove: number) => number;
    contains: (containerMask: number, containedMask: number) => boolean;
    merge: (masks: number[]) => number;
};
