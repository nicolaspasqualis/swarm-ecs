import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Component } from "./component";
export type Entity = {
    id: string;
    getArchetype: () => Archetype;
    getComponent: <J, T extends {
        type: symbol;
        data: J;
    }>(type: T) => T | undefined;
    hasComponent: (type: symbol) => boolean;
    addComponent: (component: Component) => void;
    deleteComponent: (component: Component) => void;
};
export declare function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity;
