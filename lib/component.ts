/**
 * @typedef {object} Component
 * Represents a Component in an ECS (Entity-Component-System) architecture.
 */
export type Component = {
  /**
   * The name or type of the component, represented as a symbol.
   * @type {symbol}
   */
  type: symbol,

  /**
   * The data associated with the component, which can be read and mutated by systems.
   * @type {any}
   */
  data: any,
}

/**
 * Defines a new component type with a unique symbol and associated data.
 * 
 * @template T - The data schema for the component.
 * @returns {object} An object with properties: type, data, and a create function.
 */
export function ComponentType<T>() {
  const typeSymbol = Symbol();

  /**
   * Creates a new component instance with the specified data.
   * 
   * @param {T} data - The data for the component.
   * @returns {Component} A new component with the provided data.
   */
  const create = (data: T) => ({ type: typeSymbol, data });

  return {
      type: typeSymbol,
      data: {} as T,
      create: (data: T) => ({ type: typeSymbol, data })
  };
}