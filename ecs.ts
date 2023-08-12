/* 
# notes

if queries support operations like containsall, contains some, contains none, contains only, and, or, etc.
the pure archetypal system looses the capability to quickly remove the entity from its previous 
archetype container and add it to the new one after its component list changed
!!!WRONG: entities wont have to be removed _just_ from its previous archetype, it will have to be removed from all its sub-archetypes too.
  I think a "query cache" abstraction is enough, 
    and its also a better option than each query object keeping its own cache and using mutating calls to invalidate/update

probably both Archetype based entity selector and advanced component queries should exist. component queries with advanced operators can also use cache with automatic invalidation
if we iterate over each of the cached queries, check if it matches against the current entity configuration, 
and then add it or remove it from the cached list.
   actually, "Archetype based entity selector" are just a containsAll component-query

something to note, is that both systems will need to make use of the component-to-archetype mapping code.

a map of archetypes to entities will be needed for the archetypequeries

allow alternatives to the primitive number-based bitmask implementation? uint arrays? bitmask "lists"? the idea is to support more than 32 comps
      
*/

function ECS() {
  const archetypes = BitmaskArchetypeRegistry();
  const queryCache = QueryCache(); // TODO: enable cache systems to be injected?
  const entities = new Map(); // TODO: enable entity systems to be injected? for testing
  const systems: System[] = [];

  const entityManager: EntityManager = {
    archetypeChanged: (entity) => {
      queryCache.invalidate(entity);
    },
  }

  const ecs = {
    System: (name: string, query: Query, logic: (entities: Entity[]) => void) => {
      systems.push(System(name, query, logic));
    },

    Entity: (id: string) => {
      const entity = Entity(id, archetypes, entityManager);
      entities.set(entity.id, entity);
      queryCache.invalidate(entity);
      return entity;
    },

    Query: (components: string[]) => {
      const archetype = archetypes.getAll(components)
      return CachedQuery(ArchetypeQuery(archetype), String(archetype), queryCache)
    },

    deleteEntity: (entity: Entity) => { 
      entities.delete(entity.id);
      queryCache.invalidate(entity);
    },

    getEntity: (id: string) => entities.get(id),

    run: () => {
      for (const system of systems) {
        system.update(system.query([...entities.values()]));
      }
    },
  };

  return ecs;
}

type Entity = {
  id: string;
  getArchetype: () => number;
  getComponent: (name: string) => Component | undefined;
  hasComponent: (name: string) => boolean;
  addComponent: (component: Component) => void;
  deleteComponent: (component: Component) => void;
}

type EntityManager = {
  archetypeChanged: (entity: Entity) => void;
}

function Entity(id: string, archetypeRegistry: ArchetypeRegistry, entityManager: EntityManager): Entity {
  let archetype = 0;
  const components = new Map();

  function setArchetype(newArchetype: number) {
    archetype = newArchetype;
    entityManager.archetypeChanged(entity);
  }

  const entity = {
    id,
    getArchetype: () => archetype,
    getComponent: (name: string) => components.get(name),
    hasComponent: (name: string) => components.has(name),
    addComponent: (component: Component) => {
      components.set(component.name, component);
      setArchetype(Bitmask.add(archetype, archetypeRegistry.get(component.name)));
    },
    deleteComponent: (component: Component) => {
      components.delete(component.name);
      setArchetype(Bitmask.remove(archetype, archetypeRegistry.get(component.name)));
    }
  }

  return entity;
}

type Component = { name: string, data: any }
const Component = (name: string, data: any): Component => ({ name, data })

type System = {
  name: string;
  query: Query;
  update: (entities: Entity[]) => void;
}

function System(name: string, query: Query, logic: (entities: Entity[]) => void): System {
  const update = (entities: Entity[]) => {
    logic(entities);
  };

  return { name, query, update };
}

type Query = (entities: Entity[]) => Entity[]

function ArchetypeQuery(archetype: number): Query {
  return (entities: Entity[]) => entities.filter(
    e => Bitmask.contains(e.getArchetype(), archetype)
  )
}

function CachedQuery(query: Query, cacheKey: string, queryCache: QueryCache): Query {
  return (entities: Entity[]) =>  {
    const cachedResult = queryCache.get(cacheKey);
    
    if (!cachedResult) {
      const result = query(entities);
      queryCache.set(cacheKey, result);
      return result;
    }

    return cachedResult;
  }
}


type QueryCache = {
  get: (key: string) => Entity[];
  set: (key: string, entities: Entity[]) => void;
  invalidate: (entity: Entity) => void;
}

function QueryCache(): QueryCache {
  const cachedEntities = new Map();
  return {
    get: (key: string) => cachedEntities.get(key),
    set: (key: string, entities: Entity[]) => {
      cachedEntities.set(key, entities);
    },
    invalidate: (entity: Entity) => {
      cachedEntities.clear(); // TODO: invalidate only affected queries
    }
  }
}

type ArchetypeRegistry = {
  get: (component: string) => number;
  getAll: (components: string[]) => number;
}

function BitmaskArchetypeRegistry(): ArchetypeRegistry {
  const componentTypesToBitIndex = new Map();

  const get = (component: string) => {
    if(!componentTypesToBitIndex.has(component)) {
      componentTypesToBitIndex.set(component, componentTypesToBitIndex.size);
    }

    return Bitmask.fromBitIndex(componentTypesToBitIndex.get(component));
  }

  const getAll = (components: string[]) => Bitmask.merge(components.map(type => get(type)));

  return {
    get,
    getAll
  }
}

const Bitmask = {
  fromBitIndex: (index: number) => {
    return (1 << index);
  },
  add: (sourceMask: number, maskToAdd: number) => {
    return sourceMask | maskToAdd;
  },
  remove: (sourceMask: number, maskToRemove: number) => {
    return sourceMask & ~maskToRemove;
  },
  contains: (containerMask: number, containedMask: number) => {
    return (containerMask & containedMask) === containedMask;
  },
  merge: (masks: number[]) => {
    let merged = 0;

    for (let mask of masks) {
      merged |= mask;
    }

    return merged;
  }
}