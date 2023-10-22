import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Component } from "./component";

/**
 * Represents an Entity in an ECS (Entity-Component-System) architecture.
 * @typedef {object} Entity
 */
export type Entity = {
  /**
   * Gets the unique identifier for this entity.
   * @returns {number} The ID of this entity.
   */
  getId: () => number;

  /**
   * Gets the archetype associated with this entity.
   * @returns {Archetype} The archetype of this entity.
   */
  getArchetype: () => Archetype;

  /**
   * Gets a reference to the component by its type.
   * @template J - The type of the component data.
   * @template T - The type of the component object.
   * @param {T} type - The type of the component to retrieve.
   * @returns {T | undefined} The component of the specified type or undefined if not found.
   */
  getComponent: <J, T extends { type: symbol, data: J }>(type: T) => T | undefined;

  /**
   * Checks if the entity contains a component of the given type.
   * @param {symbol} type - The type of the component to check for.
   * @returns {boolean} True if the entity has the component, otherwise false.
   */
  hasComponent: (type: symbol) => boolean;

  /**
   * Adds a new component to this entity.
   * @param {Component} component - The component to add.
   * @returns {void}
   */
  addComponent: (component: Component) => void;

  /**
   * Removes a component from this entity.
   * @param {Component} component - The component to remove.
   * @returns {void}
   */
  deleteComponent: (component: Component) => void;
};

/**
 * Creates a new Entity with the given parameters.
 * 
 * @param {number} id - The unique identifier for the entity.
 * @param {ArchetypeResolver} archetypeResolver - Resolver to manage the entity's archetype.
 * @param {EntityIndex} entityIndex - Index to manage the entity.
 * 
 * @returns {Entity} A new entity instance.
 */
export function Entity(id: number, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity {
  const components = new Map<symbol, any>();
  let archetype: Archetype = 0;
  
  const entity: Entity = {
    getId: () => id,
    getArchetype: () => archetype,
    getComponent: <J, T extends { type: symbol, data: J }>(type: T) => components.get(type.type) as T | undefined,
    hasComponent: (type: symbol) => components.has(type),
    addComponent: (component: Component) => {
      components.set(component.type, component);
      archetype = archetypeResolver.add(archetype, archetypeResolver.get(component));
      entityIndex.update(entity);
    },
    deleteComponent: (component: Component) => {
      components.delete(component.type);
      archetype = archetypeResolver.remove(archetype, archetypeResolver.get(component));
      entityIndex.update(entity);
    }
  }

  return entity;
}