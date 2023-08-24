import { Bitmask } from "./bitmask";
import { Component } from "./component";

export type Archetype = number;

// Interface for managing and manipulating archetypes.
export type ArchetypeResolver = {
  // Gets the archetype for a single component type.
  get: (component: Component) => Archetype;

  // Gets the merged archetype for a list of component types.
  getAll: (components: Component[]) => Archetype;

  // Returns an empty (void) archetype
  getEmpty: () => Archetype;

  // Returns the sum two archetypes.
  add: (source: Archetype, toAdd: Archetype) => Archetype;

  // Checks if an archetype contains another.
  contains: (container: Archetype, contained: Archetype) => boolean;

  // Checks if two archetypes overlap
  intersects: (archetypeA: Archetype, archetypeB: Archetype) => boolean;

  // Removes a component type from an existing archetype.
  remove: (source: Archetype, toRemove: Archetype) => Archetype;

  // Merges multiple archetypes into a single archetype.
  merge: (masks: Archetype[]) => Archetype;
};

export function BitmaskArchetypeResolver(): ArchetypeResolver {
  const componentTypesToBitIndex = new Map();

  const resolver = {
    get: (component: Component): Archetype => {
      if (!componentTypesToBitIndex.has(component.type)) {
        componentTypesToBitIndex.set(component.type, componentTypesToBitIndex.size);
      }
      return Bitmask.fromBitIndex(componentTypesToBitIndex.get(component.type));
    },
    getAll: (components: Component[]): Archetype => {
      return Bitmask.merge(components.map((component) => resolver.get(component)));
    },
    getEmpty: () => { 
      return Bitmask.empty();
    },
    add: (source: Archetype, toAdd: Archetype) => {
      return Bitmask.add(source, toAdd);
    },
    remove: (source: Archetype, toRemove: Archetype) => {
      return Bitmask.remove(source, toRemove);
    },
    contains: (container: Archetype, contained: Archetype) => {
      return Bitmask.contains(container, contained);
    },
    intersects: (archetypeA: Archetype, archetypeB: Archetype) => {
      return Bitmask.intersects(archetypeA, archetypeB);
    },
    merge: (masks: Archetype[]) => {
      return Bitmask.merge(masks);
    },
  };

  return resolver;
}
