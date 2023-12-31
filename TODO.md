readme

homepage?
- swarm demo with UI with iterations/systems&entity metrics.
- architecture diagram but using an actual simulation with systems, entities, components, etc
- ecs explanation/introduction
- basic interactive/canvas example


TODO advanced features:
- JSDoc
- entity "delete" method
- default component values on init/create()
- granular query index updates
- shared context (typed), readonly? permissions?
- write permissions?
- system update policy function?
    - support single run, frame/time skipping?
    - I imagine that a stateful function/closure wich returns a boolean to evaluate on each tick if the system needs to run is enough
- tracing
- add internal delta-time
- add internal metrics
    - time between runs
    - time since start
    - systems?
    - entities?
    - components?
- removable systems

good-to-have:
- components with internal archetype representation instead of name string as ID
    - maybe through inicialization using ecs.Component()
- allow alternatives to the primitive number-based bitmask implementation 
    - the idea is to support more than 32 comps
        - uint arrays? 
        - bitmask "lists"?
- use iterators? 
- open the ECS internals to be injected and allow more custom implementations
- remove entity array from ecs state, into EntityIndex
- remove plain strings as query index keys
- optimize entity object memory usage. wrapped classes?
