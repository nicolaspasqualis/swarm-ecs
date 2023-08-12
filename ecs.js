const js = () => {

function Component(name, data) {
  return { name, data };
}

function Entity(id, entityManager) {
  const state = { id, archetype: 0, components: new Map() };

  const entity = {
    id,
    getArchetype: () => state.archetype,
    getComponent: (name) => state.components.get(name),
    hasComponent: (name) => state.components.has(name),
    addComponent: (component) => {
      entityManager.addComponent(state, component);
    },
    deleteComponent: (component) => {
      entityManager.deleteComponent(state, component);
    }
  };

  return entity;
}

function System(name, query, logic) {
  const update = (entities) => {
    logic(entities);
  };

  return { name, query, update };
}

function Query(archetype) {
  return { 
    archetype,
    run: (entities) => entities.filter(
      e => Archetype.contains(e.getArchetype(), archetype)
    ),
  }
}

function CachedQuery(query, queryCache) {
  const cacheKey = String(query.archetype);

  return {
    archetype: query.archetype,
    run: (entities) =>  {
      const cachedResult = queryCache.get(cacheKey);
      
      if (!cachedResult) {
        const result = query.run(entities);
        queryCache.set(cacheKey, result);
        return result;
      }
  
      return cachedResult;
    }
  }
}

function QueryCache() {
  const cachedEntities = new Map();
  return {
    get: (key) => cachedEntities.get(key),
    set: (key, entities) => {
      cachedEntities.set(key, entities);
    },
    invalidate: (entityState) => {
      // TODO: invalidate only affected queries
      cachedEntities.clear();
    }
  }
}

function ECS() {
  const entities = new Map(); // TODO: enable entity systems to be injected? for testing
  const systems = [];
  const archetypes = ArchetypeRegistry();
  const queryCache = QueryCache(); // TODO: enable cache systems to be injected?

  const entityManager = {
    addComponent: (entityState, componentToAdd) => {
      entityState.components.set(componentToAdd.name, componentToAdd);
      const newType = archetypes.get(componentToAdd.name);
      entityState.archetype = Archetype.add(entityState.archetype, newType);
      
      queryCache.invalidate(entityState);
    },
    deleteComponent: (entityState, componentToDelete) => {
      entityState.components.delete(componentToDelete);
      const removedType = archetypes.get(componentToDelete.name);
      entityState.archetype = Archetype.remove(entityState.archetype, removedType);
      
      queryCache.invalidate(entityState);
    }
  }

  const ecs = {
    System: (name, query, logic) => {
      systems.push(System(name, query, logic));
    },

    Entity: (id) => {
      const entity = Entity(id, entityManager);
      entities.set(entity.id, entity);
      queryCache.invalidate(entity);
      return entity;
    },

    Query: (components) => CachedQuery(
      Query(archetypes.getAll(components)),
      queryCache
    ),

    deleteEntity: (entity) => { 
      entities.delete(entity.id);
      queryCache.invalidate(entity);
    },

    getEntity: (id) => entities.get(id),

    run: () => {
      for (const system of systems) {
        system.update(system.query.run([...entities.values()]));
      }
    },
  };

  return ecs;
}

function ArchetypeRegistry() {
  const componentTypesIndex = new Map();

  const get = (type) => {
    if(!componentTypesIndex.has(type)) {
      componentTypesIndex.set(type, componentTypesIndex.size);
    }

    return Archetype.fromBitIndex(componentTypesIndex.get(type));
  }

  const getAll = (types) => Archetype.merge(types.map(type => get(type)));

  return {
    get,
    getAll
  }
}

const Archetype = {
  fromBitIndex: (indexNumber) => {
    return (1 << indexNumber);
  },
  add: (targetArchetype, archetypeToAdd) => {
    return targetArchetype | archetypeToAdd;
  },
  remove: (targetArchetype, archetypeToRemove) => {
    return targetArchetype & ~archetypeToRemove;
  },
  contains: (containerArchetype, containedArchetype) => {
    return (containerArchetype & containedArchetype) === containedArchetype;
  },
  merge: (archetypes) => {
    let merged = 0

    for (let archetype of archetypes) {
      merged |= archetype;
    }

    return merged;
  }
}

}