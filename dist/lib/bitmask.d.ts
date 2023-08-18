export declare const Bitmask: {
    fromBitIndex: (index: number) => number;
    add: (sourceMask: number, maskToAdd: number) => number;
    remove: (sourceMask: number, maskToRemove: number) => number;
    contains: (containerMask: number, containedMask: number) => boolean;
    merge: (masks: number[]) => number;
};
