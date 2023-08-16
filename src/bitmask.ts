export const Bitmask = {
  // convert a bit index to its respective mask
  fromBitIndex: (index: number) => {
    return 1 << index;
  },

  // combine two masks
  add: (sourceMask: number, maskToAdd: number) => {
    return sourceMask | maskToAdd;
  },

  // remove one mask from another
  remove: (sourceMask: number, maskToRemove: number) => {
    return sourceMask & ~maskToRemove;
  },

  // check if one mask contains another
  contains: (containerMask: number, containedMask: number) => {
    return (containerMask & containedMask) === containedMask;
  },

  // combine multiple masks
  merge: (masks: number[]) => {
    let merged = 0;
    for (let mask of masks) {
      merged |= mask;
    }
    return merged;
  },
};
