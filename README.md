# Swarm Entity Component System

ECS architecture for exploring emergent behaviour in simulations or game-like systems through composition.

Demo 🡥

## Design
- Indexed query results for constant-time lookup
- Bitmask based archetype resolution **limited to 32 components** per ECS instance
- Query support for ALL, ANY and NONE selectors
- Simple stage-based system execution ordering
- OOP-like entity interface
- Archetypal architecture but without focus on memory layout/cache locality
