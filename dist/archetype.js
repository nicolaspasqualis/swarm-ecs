"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitmaskArchetypeResolver = void 0;
const bitmask_1 = require("./bitmask");
function BitmaskArchetypeResolver() {
    const componentTypesToBitIndex = new Map();
    const resolver = {
        get: (component) => {
            if (!componentTypesToBitIndex.has(component)) {
                componentTypesToBitIndex.set(component, componentTypesToBitIndex.size);
            }
            return bitmask_1.Bitmask.fromBitIndex(componentTypesToBitIndex.get(component));
        },
        getAll: (components) => {
            return bitmask_1.Bitmask.merge(components.map(type => resolver.get(type)));
        },
        add: (source, toAdd) => {
            return bitmask_1.Bitmask.add(source, toAdd);
        },
        remove: (source, toRemove) => {
            return bitmask_1.Bitmask.remove(source, toRemove);
        },
        contains: (container, contained) => {
            return bitmask_1.Bitmask.contains(container, contained);
        },
        merge: (masks) => {
            return bitmask_1.Bitmask.merge(masks);
        }
    };
    return resolver;
}
exports.BitmaskArchetypeResolver = BitmaskArchetypeResolver;
