import { Archetype, ArchetypeResolver } from "./archetype";
import { EntityIndex } from "./entityIndex";
import { Entity } from "./entity";
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
    all?: string[];
    any?: string[];
    none?: string[];
};
export declare function ArchetypeFilterQuery(filter: ArchetypeFilter, resolver: ArchetypeResolver): Query;
export declare function ArchetypeQuery(archetype: Archetype, resolver: ArchetypeResolver): Query;
export declare function IndexedQuery(query: Query, indexKey: string, entityIndex: EntityIndex): Query;
