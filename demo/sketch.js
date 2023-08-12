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

const ecs = ECS();

ecs.System("InputSystem", ecs.Query([
    PositionComponent,
    HealthComponent,
    LastHitComponent,
  ]),
  (entities) => {
    if(mouseIsPressed) {
      let trailPoint = ecs.Entity(TrailPointEntity + millis());
      trailPoint.addComponent(Component(PositionComponent, {x: mouseX, y: mouseY}));
      trailPoint.addComponent(Component(TimeComponent, { time: Date.now() }));
    }

    for (const entity of entities) {
      const position = entity.getComponent(PositionComponent).data;
      const health = entity.getComponent(HealthComponent).data;
      const lastHit = entity.getComponent(LastHitComponent).data;
      
      if (mouseIsPressed && dist(mouseX, mouseY, position.x, position.y) < entity.getComponent(RadiusComponent).data.r) {
        // deplete agent's health while mouse is pressed on it
        if (lastHit.lastHit === null) {
          lastHit.lastHit = millis();
        } else {
          health.health -= millis() - lastHit.lastHit;
          lastHit.lastHit = millis();
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
      const position = entity.getComponent(PositionComponent).data;
      const speed = entity.getComponent(SpeedComponent).data;
      const noiseOffset = entity.getComponent(NoiseOffsetComponent).data;
    
      // update agent's speed based on perlin noise
      speed.speedX = maxSpeed * (noise(noiseOffset.noiseOffsetX) - 0.5) * 2;
      speed.speedY = maxSpeed * (noise(noiseOffset.noiseOffsetY) - 0.5) * 2;
    
      // update agent's position based on its speed
      position.x += speed.speedX * deltaTime;
      position.y += speed.speedY * deltaTime;
    
      // if the agent is out of bounds: reverse its speed and adjust position to get back within bounds
      if (position.x + agentSize > width) {
        position.x = width - agentSize;
        speed.speedX *= -1;
      } else if (position.x - agentSize < 1) {
        position.x = agentSize;
        speed.speedX *= -1;
      }
    
      if (position.y + agentSize > height) {
        position.y = height - agentSize;
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
      const position = entity.getComponent(PositionComponent).data;
      const radius = entity.getComponent(RadiusComponent).data;
      const health = entity.getComponent(HealthComponent).data;
    
      if (health.health > 0) {
        // render agent hit-box
        fill(0,0,0,0);
        stroke(0,0,0,20);
        ellipse(position.x, position.y, radius.r * 2);
        
        // render actual agent
        fill(0,0,0,100);
        ellipse(position.x, position.y, agentSize);
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
      const position = entity.getComponent(PositionComponent).data;
      const time = entity.getComponent(TimeComponent).data.time;

      const timeLived = Date.now() - time;
      
      if (timeLived > trailLife) {
        ecs.deleteEntity(entity);
      }
      
      let alpha = map(timeLived, 0, trailLife, 255, 0);
      let size = map(timeLived, 0, trailLife, 20, 0);
      stroke(0, 0, 0, 0);
      fill(255, alpha);
      ellipse(position.x, position.y, size, size);
      ellipse(position.x, position.y, size * 2, size * 2);
    }
  }
);

function initEntities() {
  for (let i = 0; i < startingAgents; i++) {
    const agentEntity = ecs.Entity(AgentEntity + i);

    agentEntity.addComponent(Component(PositionComponent, {
      x: startingPoint.x + random(-startingPoint.r, startingPoint.r),
      y: startingPoint.y + random(-startingPoint.r, startingPoint.r),
    }));
    agentEntity.addComponent(Component(SpeedComponent, {
      speedX: maxSpeed / 2,  // in px per ms
      speedY: maxSpeed / 2, // in px per ms
    }));
    agentEntity.addComponent(Component(NoiseOffsetComponent, {
      noiseOffsetX: random(1000), // perlin noise state offset
      noiseOffsetY: random(1000),
    }));
    agentEntity.addComponent(Component(RadiusComponent, {r: 50}));
    agentEntity.addComponent(Component(HealthComponent, {health: 1000}));
    agentEntity.addComponent(Component(LastHitComponent, {lastHit: null}));
  }
}

function setup() {
  createCanvas(800, 600);
  initEntities();
}

function draw() {
  background(200);
  ecs.run();
  fill(255, 0, 0);
  text(Math.floor(frameRate()), 10, 20);
}