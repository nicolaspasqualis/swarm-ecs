"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitiesByQueryIndex = void 0;
function EntitiesByQueryIndex() {
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
exports.EntitiesByQueryIndex = EntitiesByQueryIndex;
