import { EntityManager } from "../ecs/EntityManager";
import { createTransform, createVelocity, createSprite, createCollider, createAIControl, createScore, createWeapon, AIControl } from "../components";

export class WaveManager {
  currentWave: number = 0;
  waveInProgress: boolean = false;
  entityManager: EntityManager;
  canvasWidth: number;
  canvasHeight: number;

  constructor(entityManager: EntityManager, width: number, height: number) {
    this.entityManager = entityManager;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  update() {
    const enemies = this.entityManager.getEntitiesWithComponents(["AIControl"]);
    
    if (enemies.length === 0 && !this.waveInProgress) {
      this.startNextWave();
    }
  }

  startNextWave() {
    this.currentWave++;
    this.waveInProgress = true;
    
    const enemyCount = 3 + this.currentWave * 2; // Increase enemies per wave
    const airplaneCount = this.currentWave >= 2 ? Math.floor(this.currentWave / 2) : 0; // Start spawning planes from wave 2
    
    console.log(`Starting Wave ${this.currentWave} with ${enemyCount} enemies and ${airplaneCount} airplanes`);

    for (let i = 0; i < enemyCount; i++) {
      this.spawnEnemy(i, enemyCount);
    }

    for (let i = 0; i < airplaneCount; i++) {
      this.spawnAirplane(i, airplaneCount);
    }

    // Small delay before allowing next wave check (to ensure entities are created)
    setTimeout(() => {
      this.waveInProgress = false;
    }, 1000);
  }

  spawnEnemy(index: number, total: number) {
    const enemy = this.entityManager.createEntity();
    
    // Circular Spawn Logic
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const radius = Math.max(this.canvasWidth, this.canvasHeight) * 0.6; // Spawn just outside visible area
    
    const angle = (index / total) * Math.PI * 2; // Evenly distributed angles
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    this.entityManager.addComponent(enemy, createTransform(x, y, angle + Math.PI)); // Face center
    this.entityManager.addComponent(enemy, createVelocity(0, 0, 0.05));
    // Use same sprite but maybe we can tint it later or use a different one. For now, same whale soldier.
    // We'll use a slightly smaller size for enemies to distinguish them, or same size.
    this.entityManager.addComponent(enemy, createSprite("#ff0000", 64, 64, 5, "/images/whale_soldier.png"));
    this.entityManager.addComponent(enemy, createCollider(48, 48, "enemy")); // Slightly smaller collider than sprite
    this.entityManager.addComponent(enemy, createAIControl(1000)); // High detection range to ensure they chase immediately
    this.entityManager.addComponent(enemy, createScore(100));
    this.entityManager.addComponent(enemy, createWeapon(2.0, 10, 300)); // Slower fire rate
  }

  spawnAirplane(index: number, total: number) {
    const airplane = this.entityManager.createEntity();
    
    // Spawn airplanes further out
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const radius = Math.max(this.canvasWidth, this.canvasHeight) * 0.8;
    
    // Offset angle from ground troops to mix them up
    const angle = (index / total) * Math.PI * 2 + (Math.PI / 4); 
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    this.entityManager.addComponent(airplane, createTransform(x, y, angle + Math.PI, 1.5)); // Larger scale
    this.entityManager.addComponent(airplane, createVelocity(0, 0, 0)); // No friction for planes
    this.entityManager.addComponent(airplane, createSprite("#ffff00", 64, 64, 15, "/images/airplane.png"));
    this.entityManager.addComponent(airplane, createCollider(48, 48, "air_enemy"));
    this.entityManager.addComponent(airplane, createAIControl(2000, "air")); // Very high detection range, air type
    this.entityManager.addComponent(airplane, createScore(300)); // Higher score for planes
    
    // Airplanes have rapid fire but lower damage per shot
    const weapon = createWeapon(0.15, 5, 600); 
    this.entityManager.addComponent(airplane, weapon);
    
    // Set initial state to strafe
    const ai = this.entityManager.getComponent<AIControl>(airplane, "AIControl");
    if (ai) ai.state = "strafe";
  }
}
