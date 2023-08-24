import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Entity } from "./entity";
import { Component } from "./component";
export type Query = {
    match: (entity: Entity) => boolean;
    filter: (entities: Entity[]) => Entity[];
};
export type ArchetypeFilter = {
    all?: Archetype;
    any?: Archetype;
    none?: Archetype;
};
export type ComponentFilter = {
    all?: Component[];
    any?: Component[];
    none?: Component[];
};
export declare function ArchetypeFilterQuery(filter: ArchetypeFilter, resolver: ArchetypeResolver): Query;
export declare function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver): Query;
export declare function IndexedQuery(query: Query, entityIndex: EntityIndex): Query;
