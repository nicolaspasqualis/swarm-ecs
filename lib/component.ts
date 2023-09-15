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

export function ComponentType<T>() {
  const typeSymbol = Symbol();
  return {
      type: typeSymbol,
      data: {} as T,
      create: (data: T) => ({ type: typeSymbol, data })
  };
}