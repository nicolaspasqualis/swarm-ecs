"use strict";
function ECS() {
    const archetypeResolver = BitmaskArchetypeResolver();
    const entityIndex = QueryEntitiesIndex();
    const entities = new Map();
    const systems = [];
    const ecs = {
        System: (name, query, logic) => {
            systems.push(System(name, query, logic));
        },
        Entity: (id) => {
            const entity = Entity(id, archetypeResolver, entityIndex);
            entities.set(entity.id, entity);
            entityIndex.update(entity);
            return entity;
        },
        Query: (components) => {
            const archetype = archetypeResolver.getAll(components);
            return IndexedQuery(ArchetypeQuery(archetype, archetypeResolver), String(archetype), entityIndex);
        },
        deleteEntity: (entity) => {
            entities.delete(entity.id);
            entityIndex.update(entity);
        },
        getEntity: (id) => entities.get(id),
        run: () => {
            const entityArray = [...entities.values()];
            for (const system of systems) {
                system.update(entityArray);
            }
        },
    };
    return ecs;
}
function Entity(id, archetypeResolver, entityIndex) {
    const components = new Map();
    let archetype = 0;
    const entity = {
        id,
        getArchetype: () => archetype,
        getComponent: (name) => components.get(name),
        hasComponent: (name) => components.has(name),
        addComponent: (component) => {
            components.set(component.name, component);
            archetype = archetypeResolver.add(archetype, archetypeResolver.get(component.name));
            entityIndex.update(entity);
        },
        deleteComponent: (component) => {
            components.delete(component.name);
            archetype = archetypeResolver.remove(archetype, archetypeResolver.get(component.name));
            entityIndex.update(entity);
        }
    };
    return entity;
}
const Component = (name, data) => ({ name, data });
const System = (name, query, logic) => ({
    name,
    query,
    update: (entities) => {
        logic(query.filter(entities));
    }
});
function ArchetypeQuery(archetype, resolver) {
    const query = {
        match: (entity) => resolver.contains(entity.getArchetype(), archetype),
        filter: (entities) => entities.filter(query.match),
    };
    return query;
}
function IndexedQuery(query, indexKey, entityIndex) {
    return {
        match: query.match,
        filter: (entities) => {
            const indexedResult = entityIndex.get(indexKey);
            if (!indexedResult) {
                const result = query.filter(entities);
                entityIndex.set(indexKey, result);
                return result;
            }
            return indexedResult;
        },
    };
}
function QueryEntitiesIndex() {
    const queryResultsIndex = new Map();
    return {
        get: (key) => {
            return queryResultsIndex.get(key);
        },
        set: (key, entities) => {
            queryResultsIndex.set(key, entities);
        },
        update: (entity) => {
            // TODO: update each indexed query granularly 
            queryResultsIndex.clear();
        }
    };
}
function BitmaskArchetypeResolver() {
    const componentTypesToBitIndex = new Map();
    const resolver = {
        get: (component) => {
            if (!componentTypesToBitIndex.has(component)) {
                componentTypesToBitIndex.set(component, componentTypesToBitIndex.size);
            }
            return Bitmask.fromBitIndex(componentTypesToBitIndex.get(component));
        },
        getAll: (components) => {
            return Bitmask.merge(components.map(type => resolver.get(type)));
        },
        add: (source, toAdd) => {
            return Bitmask.add(source, toAdd);
        },
        remove: (source, toRemove) => {
            return Bitmask.remove(source, toRemove);
        },
        contains: (container, contained) => {
            return Bitmask.contains(container, contained);
        },
        merge: (masks) => {
            return Bitmask.merge(masks);
        }
    };
    return resolver;
}
const Bitmask = {
    // convert a bit index to its respective mask
    fromBitIndex: (index) => {
        return (1 << index);
    },
    // combine two masks
    add: (sourceMask, maskToAdd) => {
        return sourceMask | maskToAdd;
    },
    // remove one mask from another
    remove: (sourceMask, maskToRemove) => {
        return sourceMask & ~maskToRemove;
    },
    // check if one mask contains another
    contains: (containerMask, containedMask) => {
        return (containerMask & containedMask) === containedMask;
    },
    // combine multiple masks
    merge: (masks) => {
        let merged = 0;
        for (let mask of masks) {
            merged |= mask;
        }
        return merged;
    }
};
