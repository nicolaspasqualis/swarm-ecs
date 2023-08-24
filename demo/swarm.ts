import { ECS, ComponentType, Stages } from "../lib/index"
import p5 from "p5"

const ecs = ECS();

const initECS = (p: p5) => {
  // settings
  const maxSpeed = 0.9; // in px per ms
  const startingAgents = 100; // num of starting agents
  const startingPoint = { x: 1000, y: 150, r: 40 };
  const agentSize = 10; // in px
  const maxTrailLength = 300; // length of trail in num of points
  let trailLife = 2000; // duration of a visible trail point in ms

  const Position = ComponentType<{ x: number, y: number }>();
  const Time = ComponentType<{ time: number }>()
  const Health = ComponentType<{ health: number }>();
  const LastHit = ComponentType<{ lastHit: number | null }>();
  const Speed = ComponentType<{ speedX: number, speedY: number }>();
  const Radius = ComponentType<{ r: number }>();
  const NoiseOffset = ComponentType<{ noiseOffsetX: number, noiseOffsetY: number }>();

  ecs.System("InputSystem", Stages.PRE_UPDATE, ecs.Query(
    Position, Health, LastHit
    ),
    (entities) => {
      if(!p.mouseIsPressed) { return; }

      let trailPoint = ecs.Entity();
      trailPoint.addComponent(Position.create({x: p.mouseX, y: p.mouseY}));
      trailPoint.addComponent(Time.create({ time: Date.now() }));
      
      for (const entity of entities) {
        const position = entity.getComponent(Position)?.data;
        const health = entity.getComponent(Health)?.data;
        const lastHit = entity.getComponent(LastHit)?.data;
        const radius = entity.getComponent(Radius)?.data;

        if(!(position && health && lastHit && radius)) { return }
        
        if (p.dist(p.mouseX, p.mouseY, position.x, position.y) < radius.r) {
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

  ecs.System("AgentMovementSystem", Stages.UPDATE, ecs.Query({ 
      all: [Position, Speed, NoiseOffset]
    }),
    (entities) => {
      for (const entity of entities) {
        const position = entity.getComponent(Position)?.data;
        const speed = entity.getComponent(Speed)?.data;
        const noiseOffset = entity.getComponent(NoiseOffset)?.data;

        if(!(position && speed && noiseOffset)) { return }
      
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

  ecs.System("RenderAgentSystem", Stages.RENDER, ecs.Query({
      all: [Position, Radius, Health]
    }), 
    (entities) => {   
      for (const entity of entities) {
        const position = entity.getComponent(Position)?.data;
        const radius = entity.getComponent(Radius)?.data;
        const health = entity.getComponent(Health)?.data;

        if(!(position && radius && health)) { return }
      
        if (health.health > 0) {
          // render agent hit-box
          p.noFill();
          p.stroke(0, 0, 0, 20);
          p.ellipse(position.x, position.y, radius.r * 2);
          
          // render actual agent
          p.fill(0);
          p.circle(position.x, position.y, 10);
        } else {
          ecs.deleteEntity(entity);
        }
      }
    }
  );

  ecs.System("RenderTrailSystem", Stages.RENDER, ecs.Query({
    all: [Position, Time]
    }),
    (entities) => {
      for (const entity of entities) {
        const position = entity.getComponent(Position)?.data;
        const time = entity.getComponent(Time)?.data;

        if(!(position && time)) { return }

        const timeLived = Date.now() - time.time;
        
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
    const agent = ecs.Entity();

    agent.addComponent(Position.create({
      x: startingPoint.x + p.random(-startingPoint.r, startingPoint.r),
      y: startingPoint.y + p.random(-startingPoint.r, startingPoint.r),
    }));
    agent.addComponent(Speed.create({
      speedX: maxSpeed / 2,  // in px per ms
      speedY: maxSpeed / 2, // in px per ms
    }));
    agent.addComponent(NoiseOffset.create({
      noiseOffsetX: p.random(1000), // perlin noise state offset
      noiseOffsetY: p.random(1000),
    }));
    agent.addComponent(Radius.create({r: 20}));
    agent.addComponent(Health.create({health: 1000}));
    agent.addComponent(LastHit.create({lastHit: null}));
  }
}

const sketch = (p: p5) => {
  p.setup = () => {
    p.disableFriendlyErrors = true;
    p.noSmooth();
    p.createCanvas(1920, 300);
    initECS(p);
  };

  p.draw = () => {  
    p.background(200);
    ecs.run();
    p.fill(255, 0, 0);
    //p.text(Math.floor(p.frameRate()), 10, 20);
  };
};

new p5(sketch);