import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Component } from "./component";
export type Entity = {
    id: string;
    getArchetype: () => Archetype;
    getComponent: (name: string) => Component | undefined;
    hasComponent: (name: string) => boolean;
    addComponent: (component: Component) => void;
    deleteComponent: (component: Component) => void;
};
export declare function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity;
