export type Component = { 
  name: string;
  data: any;
}

export const Component = (
  name: string, 
  data: any,
): Component => ({ name, data })