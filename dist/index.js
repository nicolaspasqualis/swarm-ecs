"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = exports.Entity = exports.ECS = void 0;
const archetype_1 = require("./archetype");
const entityIndex_1 = require("./entityIndex");
const query_1 = require("./query");
const system_1 = require("./system");
Object.defineProperty(exports, "System", { enumerable: true, get: function () { return system_1.System; } });
const entity_1 = require("./entity");
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return entity_1.Entity; } });
function ECS() {
    const archetypeResolver = (0, archetype_1.BitmaskArchetypeResolver)();
    const entityIndex = (0, entityIndex_1.EntitiesByQueryIndex)();
    const entities = new Map();
    const systems = [];
    const ecs = {
        System: (name, query, logic) => {
            systems.push((0, system_1.System)(name, query, logic));
        },
        Entity: (id) => {
            const entity = (0, entity_1.Entity)(id, archetypeResolver, entityIndex);
            entities.set(entity.id, entity);
            entityIndex.update(entity);
            return entity;
        },
        Query: (components) => {
            const archetype = archetypeResolver.getAll(components);
            return (0, query_1.IndexedQuery)((0, query_1.ArchetypeQuery)(archetype, archetypeResolver), String(archetype), entityIndex);
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
exports.ECS = ECS;
