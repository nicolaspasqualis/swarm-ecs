import { Bitmask } from "./bitmask";

export type Archetype = number;

export type ArchetypeResolver = {
  get: (component: string) => Archetype,
  getAll: (components: string[]) => Archetype,
  add: (source: Archetype, toAdd: Archetype) => Archetype,
  contains: (container: Archetype, contained: Archetype) => boolean,
  remove: (source: Archetype, toRemove: Archetype) => Archetype,
  merge: (masks: Archetype[]) => Archetype,
}

export function BitmaskArchetypeResolver(): ArchetypeResolver {
  const componentTypesToBitIndex = new Map();

  const resolver = {
    get: (component: string): Archetype => {
      if(!componentTypesToBitIndex.has(component)) {
        componentTypesToBitIndex.set(component, componentTypesToBitIndex.size);
      }
      return Bitmask.fromBitIndex(componentTypesToBitIndex.get(component));
    },
    getAll: (components: string[]): Archetype => {
      return Bitmask.merge(components.map(type => resolver.get(type)));
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
    merge: (masks: Archetype[]) => {
      return Bitmask.merge(masks);
    }
  }

  return resolver;
}