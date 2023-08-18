import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Component } from "./component";

export type Entity = {
  // Entity ID
  id: string;

  // Returns this entity's archetype
  getArchetype: () => Archetype;

  // Returns a reference to the component by name 
  getComponent: (name: string) => Component | undefined;

  // Checks if the entity contains a component by name
  hasComponent: (name: string) => boolean;

  // Adds a component to this entity
  addComponent: (component: Component) => void;
  
  // Removes the component from this entity
  deleteComponent: (component: Component) => void;
}
  
export function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity {
  const components = new Map();
  let archetype: Archetype = 0;
  
  const entity: Entity = {
    id,
    getArchetype: () => archetype,
    getComponent: (name: string) => components.get(name),
    hasComponent: (name: string) => components.has(name),
    addComponent: (component: Component) => {
      components.set(component.name, component);
      archetype = archetypeResolver.add(archetype, archetypeResolver.get(component.name));
      entityIndex.update(entity);
    },
    deleteComponent: (component: Component) => {
      components.delete(component.name);
      archetype = archetypeResolver.remove(archetype, archetypeResolver.get(component.name));
      entityIndex.update(entity);
    }
  }

  return entity;
}