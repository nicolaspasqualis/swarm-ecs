export declare const Bitmask: {
    empty: () => number;
    fromBitIndex: (index: number) => number;
    add: (sourceMask: number, maskToAdd: number) => number;
    remove: (sourceMask: number, maskToRemove: number) => number;
    contains: (containerMask: number, containedMask: number) => boolean;
    intersects: (maskA: number, maskB: number) => boolean;
    merge: (masks: number[]) => number;
};
