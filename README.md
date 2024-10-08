# swarm — entity component system

Modular [ECS architecture](https://en.wikipedia.org/wiki/Entity_component_system) implementation for composing simulation and game-like systems' behaviors.

### [Dosc / API Reference](https://nicolaspasqualis.github.io/swarm-ecs/typedoc/index.html)

While this library implements a generic ECS, its main goal is to provide a friendly API for combining agent-behavior systems and achieving complex results easily. An example is the classic boid swarm, which can be built by combining Separation, Alignment, and Cohesion systems:

<img height="300" src="./docs/flock250.gif"></img>

`separation → alignment → cohesion → movement → render pipeline`

### Features
- Cached queries with constant-time lookup.
- Bitmask-based archetype resolution **limited to 32 components** per ECS instance.
- Queries with support for ALL, ANY, and NONE operators.
- Simple stage-based system execution ordering.
- Typed components API.
- OOP-like entity/component interface.
- Archetypal model but without focus on memory layout/cache locality for now.

![](./docs/diagram.svg)

## Basic usage

### Creating an ECS instance
```typescript
const ecs = ECS();
```

### Creating an entity
```typescript
const entity = ecs.Entity();
```

### Adding components
New types of components can be declared using the `ComponentType<Schema>()` function.
```typescript
const Position = ComponentType<{ x: number, y: number }>();
const Velocity = ComponentType<{ velocity: number }>();
```
And instances of a specific component type can be created through its `create()` function. 
```typescript
entity.addComponent(Position.create({ x: 50, y: 50 }));
entity.addComponent(Velocity.create({ velocity: 0 }));
```

### Creating systems
Systems are built using a **query** that describes the type of entities that this system will process, an **update function** to process these entities on each ECS "run", and a **stage** that specifies _when_ the update function runs.
```typescript
ecs.System('movement', Stages.UPDATE, 
  ecs.Query(Position, Velocity), (entities) => {
    for (const entity of entities) {
      const position = entity.getComponent(Position).data;
      const velocity = entity.getComponent(Velocity).data;

      if (!(position && velocity)) { return; }

      position.x += velocity;
      position.y += velocity;
    }
  }
);
```

### Query operators
Queries used by systems support combining `all`, `any` and `none` operators in order to have more control over the types of entities that a system receives.
For example a system that runs only on entities that are "static" could be expressed like:
```typescript
ecs.System('example', Stages.UPDATE, 
  ecs.Query({ none: [Velocity] }), (entities) => {
    // process entities...
  }
);
```
Or a more complex query to process al "adversary" entities that are not visible and without health:
```typescript
ecs.System('example', Stages.UPDATE, 
  ecs.Query({ all: [Adversary], none: [Health, Visible] }), (entities) => {
    // process entities...
  }
);
```

### System stages
Systems are run in order of registration, but also in order of their defined stages.
Currently the ECS has a set of defined stages that run in the following order:
1. INIT
2. POST_INIT
3. PRE_UPDATE
4. UPDATE
5. POST_UPDATE
6. PRE_RENDER
7. RENDER

Example usage:
```typescript
ecs.System('A', Stages.PRE_UPDATE, ecs.Query(Position), (entities) => {});
ecs.System('B', Stages.UPDATE, ecs.Query(Position), (entities) => {});
ecs.System('C', Stages.PRE_UPDATE, ecs.Query(Position), (entities) => {});
ecs.System('D', Stages.RENDER, ecs.Query(Position), (entities) => {});
```
This setup will run the systems in order: `A` -> `C` -> `B` -> `D`

### Running Systems
The ECS `run()` function runs all systems _once_, meaning that the update function of each registered system is called once in the specified stage/registration order: 
```typescript
ecs.run();
```
A common setup for "infinite" system iteration is the classic game-like loop:
```typescript
const running = true;

while (running) {
  ecs.run();
}
```

<hr>

### [API Reference](https://nicolaspasqualis.github.io/swarm-ecs/typedoc/index.html)
