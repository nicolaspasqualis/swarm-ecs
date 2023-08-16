"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedQuery = exports.ArchetypeQuery = void 0;
function ArchetypeQuery(archetype, resolver) {
    const query = {
        match: (entity) => resolver.contains(entity.getArchetype(), archetype),
        filter: (entities) => entities.filter(query.match),
    };
    return query;
}
exports.ArchetypeQuery = ArchetypeQuery;
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
exports.IndexedQuery = IndexedQuery;
