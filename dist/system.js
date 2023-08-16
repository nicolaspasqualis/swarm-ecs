"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = void 0;
const System = (name, query, logic) => ({
    name,
    query,
    update: (entities) => {
        logic(query.filter(entities));
    }
});
exports.System = System;
