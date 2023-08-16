"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bitmask = void 0;
exports.Bitmask = {
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
