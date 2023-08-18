import { ECS, Component } from "../lib/index"
import p5 from "p5"

const ecs = ECS();

const initECS = (ecs: ECS, p: p5) => {
  // settings
  const maxSpeed = 0.9; // in px per ms
  const startingAgents = 100; // num of starting agents
  const startingPoint = { x: 500, y: 300, r: 30 };
  const agentSize = 10; // in px
  const maxTrailLength = 300; // length of trail in num of points
  let trailLife = 2000; // duration of a visible trail point in ms

  // components
  const PositionComponent = "Position";
  const RadiusComponent = "Radius";
  const SpeedComponent = "Speed";
  const HealthComponent = "Health";
  const LastHitComponent = "LastHit";
  const NoiseOffsetComponent = "NoiseOffset";
  const TimeComponent = "Time";

  // entities
  const AgentEntity = "Agent";
  const TrailPointEntity = "TrailPoint";

  ecs.System("InputSystem", ecs.Query([
      PositionComponent,
      HealthComponent,
      LastHitComponent,
    ]),
    (entities) => {
      if(p.mouseIsPressed) {
        let trailPoint = ecs.Entity(TrailPointEntity + p.millis());
        trailPoint.addComponent(Component(PositionComponent, {x: p.mouseX, y: p.mouseY}));
        trailPoint.addComponent(Component(TimeComponent, { time: Date.now() }));
      }

      for (const entity of entities) {
        const position = entity.getComponent(PositionComponent)?.data;
        const health = entity.getComponent(HealthComponent)?.data;
        const lastHit = entity.getComponent(LastHitComponent)?.data;
        
        if (p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, position.x, position.y) < entity.getComponent(RadiusComponent)?.data.r) {
          // deplete agent's health while mouse is pressed on it
          if (lastHit.lastHit === null) {
            lastHit.lastHit = p.millis();
          } else {
            health.health -= p.millis() - lastHit.lastHit;
            lastHit.lastHit = p.millis();
          }
        } else {
          lastHit.lastHit = null;
        }
      }
    }
  );

  ecs.System("AgentMovementSystem", ecs.Query([
      PositionComponent, 
      SpeedComponent, 
      NoiseOffsetComponent
    ]),
    (entities) => {
      for (const entity of entities) {
        const position = entity.getComponent(PositionComponent)?.data;
        const speed = entity.getComponent(SpeedComponent)?.data;
        const noiseOffset = entity.getComponent(NoiseOffsetComponent)?.data;
      
        // update agent's speed based on perlin noise
        speed.speedX = maxSpeed * (p.noise(noiseOffset.noiseOffsetX) - 0.5) * 2;
        speed.speedY = maxSpeed * (p.noise(noiseOffset.noiseOffsetY) - 0.5) * 2;
      
        // update agent's position based on its speed
        position.x += speed.speedX * p.deltaTime;
        position.y += speed.speedY * p.deltaTime;
      
        // if the agent is out of bounds: reverse its speed and adjust position to get back within bounds
        if (position.x + agentSize > p.width) {
          position.x = p.width - agentSize;
          speed.speedX *= -1;
        } else if (position.x - agentSize < 1) {
          position.x = agentSize;
          speed.speedX *= -1;
        }
      
        if (position.y + agentSize > p.height) {
          position.y = p.height - agentSize;
          speed.speedY *= -1;
        } else if (position.y - agentSize < 1) {
          position.y = agentSize;
          speed.speedY *= -1;
        }
      
        // update entity's perlin noise offsets
        noiseOffset.noiseOffsetX += 0.05;
        noiseOffset.noiseOffsetY += 0.05;
      }
    }
  );

  ecs.System("RenderAgentSystem", ecs.Query([
      PositionComponent, 
      RadiusComponent, 
      HealthComponent
    ]), 
    (entities) => {   
      for (const entity of entities) {
        const position = entity.getComponent(PositionComponent)?.data;
        const radius = entity.getComponent(RadiusComponent)?.data;
        const health = entity.getComponent(HealthComponent)?.data;
      
        if (health.health > 0) {
          // render agent hit-box
          p.fill(0,0,0,0);
          p.stroke(0,0,0,20);
          p.ellipse(position.x, position.y, radius.r * 2);
          
          // render actual agent
          p.fill(0,0,0,100);
          p.ellipse(position.x, position.y, agentSize);
        } else {
          ecs.deleteEntity(entity);
        }
      }
    }
  );

  ecs.System("RenderTrailSystem", ecs.Query([
      PositionComponent,
      TimeComponent,
    ]),
    (entities) => {
      for (const entity of entities) {
        const position = entity.getComponent(PositionComponent)?.data;
        const time = entity.getComponent(TimeComponent)?.data.time;

        const timeLived = Date.now() - time;
        
        if (timeLived > trailLife) {
          ecs.deleteEntity(entity);
        }
        
        let alpha = p.map(timeLived, 0, trailLife, 255, 0);
        let size = p.map(timeLived, 0, trailLife, 20, 0);
        p.stroke(0, 0, 0, 0);
        p.fill(255, alpha);
        p.ellipse(position.x, position.y, size, size);
        p.ellipse(position.x, position.y, size * 2, size * 2);
      }
    }
  );

  for (let i = 0; i < startingAgents; i++) {
    const agentEntity = ecs.Entity(AgentEntity + i);

    agentEntity.addComponent(Component(PositionComponent, {
      x: startingPoint.x + p.random(-startingPoint.r, startingPoint.r),
      y: startingPoint.y + p.random(-startingPoint.r, startingPoint.r),
    }));
    agentEntity.addComponent(Component(SpeedComponent, {
      speedX: maxSpeed / 2,  // in px per ms
      speedY: maxSpeed / 2, // in px per ms
    }));
    agentEntity.addComponent(Component(NoiseOffsetComponent, {
      noiseOffsetX: p.random(1000), // perlin noise state offset
      noiseOffsetY: p.random(1000),
    }));
    agentEntity.addComponent(Component(RadiusComponent, {r: 50}));
    agentEntity.addComponent(Component(HealthComponent, {health: 1000}));
    agentEntity.addComponent(Component(LastHitComponent, {lastHit: null}));
  }
}

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600);
    initECS(ecs, p);
  };

  p.draw = () => {  
    p.background(200);
    ecs.run();
    p.fill(255, 0, 0);
    p.text(Math.floor(p.frameRate()), 10, 20);
  };
};

new p5(sketch);