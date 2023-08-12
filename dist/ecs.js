"use strict";
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
    const systems = [];
    const entityManager = {
        archetypeChanged: (entity) => {
            queryCache.invalidate(entity);
        },
    };
    const ecs = {
        System: (name, query, logic) => {
            systems.push(System(name, query, logic));
        },
        Entity: (id) => {
            const entity = Entity(id, archetypes, entityManager);
            entities.set(entity.id, entity);
            queryCache.invalidate(entity);
            return entity;
        },
        Query: (components) => {
            const archetype = archetypes.getAll(components);
            return CachedQuery(ArchetypeQuery(archetype), String(archetype), queryCache);
        },
        deleteEntity: (entity) => {
            entities.delete(entity.id);
            queryCache.invalidate(entity);
        },
        getEntity: (id) => entities.get(id),
        run: () => {
            for (const system of systems) {
                system.update(system.query([...entities.values()]));
            }
        },
    };
    return ecs;
}
function Entity(id, archetypeRegistry, entityManager) {
    let archetype = 0;
    const components = new Map();
    function setArchetype(newArchetype) {
        archetype = newArchetype;
        entityManager.archetypeChanged(entity);
    }
    const entity = {
        id,
        getArchetype: () => archetype,
        getComponent: (name) => components.get(name),
        hasComponent: (name) => components.has(name),
        addComponent: (component) => {
            components.set(component.name, component);
            setArchetype(Bitmask.add(archetype, archetypeRegistry.get(component.name)));
        },
        deleteComponent: (component) => {
            components.delete(component.name);
            setArchetype(Bitmask.remove(archetype, archetypeRegistry.get(component.name)));
        }
    };
    return entity;
}
const Component = (name, data) => ({ name, data });
function System(name, query, logic) {
    const update = (entities) => {
        logic(entities);
    };
    return { name, query, update };
}
function ArchetypeQuery(archetype) {
    return (entities) => entities.filter(e => Bitmask.contains(e.getArchetype(), archetype));
}
function CachedQuery(query, cacheKey, queryCache) {
    return (entities) => {
        const cachedResult = queryCache.get(cacheKey);
        if (!cachedResult) {
            const result = query(entities);
            queryCache.set(cacheKey, result);
            return result;
        }
        return cachedResult;
    };
}
function QueryCache() {
    const cachedEntities = new Map();
    return {
        get: (key) => cachedEntities.get(key),
        set: (key, entities) => {
            cachedEntities.set(key, entities);
        },
        invalidate: (entity) => {
            cachedEntities.clear(); // TODO: invalidate only affected queries
        }
    };
}
function BitmaskArchetypeRegistry() {
    const componentTypesToBitIndex = new Map();
    const get = (component) => {
        if (!componentTypesToBitIndex.has(component)) {
            componentTypesToBitIndex.set(component, componentTypesToBitIndex.size);
        }
        return Bitmask.fromBitIndex(componentTypesToBitIndex.get(component));
    };
    const getAll = (components) => Bitmask.merge(components.map(type => get(type)));
    return {
        get,
        getAll
    };
}
const Bitmask = {
    fromBitIndex: (index) => {
        return (1 << index);
    },
    add: (sourceMask, maskToAdd) => {
        return sourceMask | maskToAdd;
    },
    remove: (sourceMask, maskToRemove) => {
        return sourceMask & ~maskToRemove;
    },
    contains: (containerMask, containedMask) => {
        return (containerMask & containedMask) === containedMask;
    },
    merge: (masks) => {
        let merged = 0;
        for (let mask of masks) {
            merged |= mask;
        }
        return merged;
    }
};
