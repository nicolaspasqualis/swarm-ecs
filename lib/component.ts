export type Component = {
  // Component name/type
  type: symbol;
  
  // Component data to be read and mutated by systems
  data: any;
}


export function ComponentType<T>() {
  const typeSymbol = Symbol();
  return {
      type: typeSymbol,
      data: {} as T,
      create: (data: T) => ({ type: typeSymbol, data })
  };
}