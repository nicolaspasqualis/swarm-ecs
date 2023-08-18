export type Component = {
  // Component name/type
  name: string;
  
  // Component data to be read and mutated by systems
  data: any;
}

export const Component = (
  name: string, 
  data: any,
): Component => ({ name, data })