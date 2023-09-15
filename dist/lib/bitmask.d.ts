/**
 * Bitmask utility functions.
 * @namespace Bitmask
 */
export declare const Bitmask: {
    /**
     * Returns an empty bitmask.
     * @returns {number} An empty bitmask represented by the number 0.
     */
    empty: () => number;
    /**
     * Converts a bit index to its respective mask.
     * @param {number} index - The index of the bit to convert.
     * @returns {number} The bitmask corresponding to the given bit index.
     */
    fromBitIndex: (index: number) => number;
    /**
     * Combines two masks.
     * @param {number} sourceMask - The original bitmask.
     * @param {number} maskToAdd - The bitmask to add.
     * @returns {number} A new bitmask that combines both input masks.
     */
    add: (sourceMask: number, maskToAdd: number) => number;
    /**
     * Removes one mask from another.
     * @param {number} sourceMask - The original bitmask.
     * @param {number} maskToRemove - The bitmask to remove.
     * @returns {number} A new bitmask with the bits of maskToRemove removed from sourceMask.
     */
    remove: (sourceMask: number, maskToRemove: number) => number;
    /**
     * Checks if one mask contains another.
     * @param {number} containerMask - The containing bitmask.
     * @param {number} containedMask - The bitmask to check for containment.
     * @returns {boolean} True if containerMask contains all bits of containedMask, otherwise false.
     */
    contains: (containerMask: number, containedMask: number) => boolean;
    /**
     * Checks if two masks intersect.
     * @param {number} maskA - The first bitmask.
     * @param {number} maskB - The second bitmask.
     * @returns {boolean} True if the masks have at least one bit in common, otherwise false.
     */
    intersects: (maskA: number, maskB: number) => boolean;
    /**
     * Combines multiple masks.
     * @param {number[]} masks - An array of bitmasks to merge.
     * @returns {number} A new bitmask that combines all input masks.
     */
    merge: (masks: number[]) => number;
};
