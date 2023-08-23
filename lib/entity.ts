import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Component } from "./component";

export type Entity = {
  // Entity ID
  id: string;

  // Returns this entity's archetype
  getArchetype: () => Archetype;

  // Returns a reference to the component by name
  getComponent: <J, T extends { type: symbol, data: J }>(type: T) => T | undefined;

  // Checks if the entity contains a component by name
  hasComponent: (type: symbol) => boolean;

  // Adds a component to this entity
  addComponent: (component: Component) => void;

  // Removes the component from this entity
  deleteComponent: (component: Component) => void;
}
  
export function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity {
  const components = new Map<symbol, any>();
  let archetype: Archetype = 0;
  
  const entity: Entity = {
    id,
    getArchetype: () => archetype,
    getComponent: <J, T extends { type: symbol, data: J }>(type: T) => components.get(type.type) as T | undefined,
    hasComponent: (type: symbol) => components.has(type),
    addComponent: (component: Component) => {
      components.set(component.type, component);
      archetype = archetypeResolver.add(archetype, archetypeResolver.get(component.type));
      entityIndex.update(entity);
    },
    deleteComponent: (component: Component) => {
      components.delete(component.type);
      archetype = archetypeResolver.remove(archetype, archetypeResolver.get(component.type));
      entityIndex.update(entity);
    }
  }

  return entity;
}