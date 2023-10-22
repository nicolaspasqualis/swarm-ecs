import { Query, ComponentFilter } from "./query";
import { Stage } from "./system";
import { Component } from "./component";
import { Entity } from "./entity";
/**
 * @typedef {object} ECS
 * Entity-Component-System interface.
 */
export type ECS = {
    /**
     * Creates and registers a new system.
     * @param {string} name - The name of the system.
     * @param {Stage} stage - The stage at which the system will run.
     * @param {Query} query - The query that selects entities for the system.
     * @param {(entities: Entity[]) => void} logic - Logic for each tick.
     */
    System: (name: string, stage: Stage, query: Query, logic: (entities: Entity[]) => void) => void;
    /**
     * Creates and registers a new entity.
     * @returns {Entity} The newly created entity.
     */
    Entity: () => Entity;
    /**
     * Creates and registers a new query.
     * @param {...Component[]} components - Components to include in the query.
     * @param {ComponentFilter} filter - Filter condition for the query.
     * @returns {Query} The newly created query.
     */
    Query: ((...components: Component[]) => Query) & ((filter: ComponentFilter) => Query);
    /**
     * Removes the provided entity from the ECS.
     * @param {Entity} entity - The entity to remove.
     */
    deleteEntity: (entity: Entity) => void;
    /**
     * Retrieves an entity by its ID.
     * @param {number} id - The ID of the entity.
     * @returns {Entity | undefined} The retrieved entity or undefined if not found.
     */
    getEntity: (id: number) => Entity | undefined;
    /**
     * Advances the ECS one tick by running each system.
     */
    run: () => void;
};
/**
 * Creates a new ECS instance.
 * @returns {ECS} An instance of the ECS.
 */
export declare function ECS(): ECS;
