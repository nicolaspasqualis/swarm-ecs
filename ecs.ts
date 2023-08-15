function ECS() {
  const archetypeResolver: ArchetypeResolver = BitmaskArchetypeResolver();
  const entityIndex: EntityIndex = QueryEntitiesIndex();
  const entities: Map<string, Entity> = new Map();
  const systems: System[] = [];

  const ecs = {
    System: (name: string, query: Query, logic: (entities: Entity[]) => void) => {
      systems.push(System(name, query, logic));
    },

    Entity: (id: string) => {
      const entity = Entity(id, archetypeResolver, entityIndex);
      entities.set(entity.id, entity);
      entityIndex.update(entity);
      return entity;
    },

    Query: (components: string[]) => {
      const archetype = archetypeResolver.getAll(components)
      return IndexedQuery(
        ArchetypeQuery(archetype, archetypeResolver), 
        String(archetype), 
        entityIndex
      )
    },

    deleteEntity: (entity: Entity) => { 
      entities.delete(entity.id);
      entityIndex.update(entity);
    },

    getEntity: (id: string) => entities.get(id),

    run: () => {
      const entityArray = [...entities.values()]
      for (const system of systems) {
        system.update(entityArray);
      }
    },
  };

  return ecs;
}

type Entity = {
  id: string;
  getArchetype: () => Archetype;
  getComponent: (name: string) => Component | undefined;
  hasComponent: (name: string) => boolean;
  addComponent: (component: Component) => void;
  deleteComponent: (component: Component) => void;
}

function Entity(id: string, archetypeResolver: ArchetypeResolver, entityIndex: EntityIndex): Entity {
  const components = new Map();
  let archetype: Archetype = 0;
  
  const entity: Entity = {
    id,
    getArchetype: () => archetype,
    getComponent: (name: string) => components.get(name),
    hasComponent: (name: string) => components.has(name),
    addComponent: (component: Component) => {
      components.set(component.name, component);
      archetype = archetypeResolver.add(archetype, archetypeResolver.get(component.name));
      entityIndex.update(entity);
    },
    deleteComponent: (component: Component) => {
      components.delete(component.name);
      archetype = archetypeResolver.remove(archetype, archetypeResolver.get(component.name));
      entityIndex.update(entity);
    }
  }

  return entity;
}

type Archetype = number;

type Component = { 
  name: string;
  data: any;
}

const Component = (
  name: string, 
  data: any,
): Component => ({ name, data })

type System = {
  name: string;
  query: Query;
  update: (entities: Entity[]) => void;
}

const System = (
  name: string, 
  query: Query, 
  logic: (entities: Entity[]) => void
): System => ({ 
  name, 
  query, 
  update: (entities: Entity[]) => { 
    logic(query.filter(entities)) 
  }
})

type Query = {
  // returns true if the entity matches with the query
  match: (entity: Entity) => boolean,
  // returns a filtered list of all entities that match with the query
  filter: (entities: Entity[]) => Entity[],
}

function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver): Query {
  const query = {
    match: (entity: Entity) => resolver.contains(entity.getArchetype(), archetype),
    filter: (entities: Entity[]) => entities.filter(query.match),
  };
  return query;
}

function IndexedQuery(query: Query, indexKey: string, entityIndex: EntityIndex): Query {
  return {
    match: query.match,
    filter: (entities: Entity[]) =>  {
      const indexedResult = entityIndex.get(indexKey);
      
      if (!indexedResult) {
        const result = query.filter(entities);
        entityIndex.set(indexKey, result);
        return result;
      }
  
      return indexedResult;
    },
  }
}

type EntityIndex = {
  get: (key: string) => Entity[];
  set: (key: string, entities: Entity[]) => void;
  update: (entity: Entity) => void;
}

function QueryEntitiesIndex(): EntityIndex {
  const queryResultsIndex = new Map();

  return {
    get: (key: string) => {
      return queryResultsIndex.get(key);
    },
    set: (key: string, entities: Entity[]) => {
      queryResultsIndex.set(key, entities);
    },
    update: (entity: Entity) => {
      // TODO: update each indexed query granularly 
      queryResultsIndex.clear();
    }
  }
}

type ArchetypeResolver = {
  get: (component: string) => Archetype,
  getAll: (components: string[]) => Archetype,
  add: (source: Archetype, toAdd: Archetype) => Archetype,
  contains: (container: Archetype, contained: Archetype) => boolean,
  remove: (source: Archetype, toRemove: Archetype) => Archetype,
  merge: (masks: Archetype[]) => Archetype,
}

function BitmaskArchetypeResolver(): ArchetypeResolver {
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

const Bitmask = {
  // convert a bit index to its respective mask
  fromBitIndex: (index: number) => {
    return (1 << index);
  },
  // combine two masks
  add: (sourceMask: number, maskToAdd: number) => {
    return sourceMask | maskToAdd;
  },
  // remove one mask from another
  remove: (sourceMask: number, maskToRemove: number) => {
    return sourceMask & ~maskToRemove;
  },
  // check if one mask contains another
  contains: (containerMask: number, containedMask: number) => {
    return (containerMask & containedMask) === containedMask;
  },
  // combine multiple masks
  merge: (masks: number[]) => {
    let merged = 0;
    for (let mask of masks) {
      merged |= mask;
    }
    return merged;
  }
}