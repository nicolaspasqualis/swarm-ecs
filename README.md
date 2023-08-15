TODO
- more advanced queries with support for common logic operators
- typed components for typescript clients
- allow alternatives to the primitive number-based bitmask implementation? uint arrays? bitmask "lists"? the idea is to support more than 32 comps
- allow explicit system ordering
- more control over system executions, maybe single run, frame/time skipping? 
- - update policy function? I imagine that a function that is called with its previous result as parameter could be powerfull, or just a stateful closure wich returns a boolean to evaluate on each tick if the system needs to run 
- open the ECS internals to be injected and allow more custom implementations
- remove entity array from ecs state, into EntityIndex
- remove plain strings as query index keys