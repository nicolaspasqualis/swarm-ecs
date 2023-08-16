"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
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
exports.Entity = Entity;
