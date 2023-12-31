import { Bitmask } from "./bitmask";
import { Component } from "./component";

export type Archetype = number;
/**
 * Interface for managing and manipulating archetypes.
 * @typedef {object} ArchetypeResolver
 */
export type ArchetypeResolver = {
  /**
   * Gets the archetype for a single component type.
   * @param {Component} component - The component for which to get the archetype.
   * @returns {Archetype} The archetype corresponding to the given component.
   */
  get: (component: Component) => Archetype;

  /**
   * Gets the merged archetype for a list of component types.
   * @param {Component[]} components - An array of components for which to get the merged archetype.
   * @returns {Archetype} The archetype that combines all the given components.
   */
  getAll: (components: Component[]) => Archetype;

  /**
   * Returns an empty (void) archetype.
   * @returns {Archetype} An empty archetype.
   */
  getEmpty: () => Archetype;

  /**
   * Returns the sum of two archetypes.
   * @param {Archetype} source - The original archetype.
   * @param {Archetype} toAdd - The archetype to add to the source.
   * @returns {Archetype} A new archetype that is the sum of both input archetypes.
   */
  add: (source: Archetype, toAdd: Archetype) => Archetype;

  /**
   * Checks if an archetype contains another.
   * @param {Archetype} container - The archetype that might contain another.
   * @param {Archetype} contained - The archetype to check for containment.
   * @returns {boolean} True if the container archetype contains the contained archetype, otherwise false.
   */
  contains: (container: Archetype, contained: Archetype) => boolean;

  /**
   * Checks if two archetypes overlap.
   * @param {Archetype} archetypeA - The first archetype.
   * @param {Archetype} archetypeB - The second archetype.
   * @returns {boolean} True if the archetypes overlap, otherwise false.
   */
  intersects: (archetypeA: Archetype, archetypeB: Archetype) => boolean;

  /**
   * Removes a component type from an existing archetype.
   * @param {Archetype} source - The original archetype.
   * @param {Archetype} toRemove - The archetype to remove from the source.
   * @returns {Archetype} A new archetype with the component removed.
   */
  remove: (source: Archetype, toRemove: Archetype) => Archetype;

  /**
   * Merges multiple archetypes into a single archetype.
   * @param {Archetype[]} masks - An array of archetypes to merge.
   * @returns {Archetype} A new archetype that combines all input archetypes.
   */
  merge: (masks: Archetype[]) => Archetype;
};

/**
 * Creates a new BitmaskArchetypeResolver.
 * This resolver utilizes a {@link Bitmask} representation for archetypes, offering efficient operations but 
 * with a maximum limit of 32 components, due to `number` bit length in most engines.
 * 
 * @returns {ArchetypeResolver} An object implementing the ArchetypeResolver interface using bitmasks.
 */
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
