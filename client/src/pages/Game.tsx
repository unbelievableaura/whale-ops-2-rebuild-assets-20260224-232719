import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { EntityManager } from "../lib/game/ecs/EntityManager";
import { GameLoop } from "../lib/game/GameLoop";
import { 
  createTransform, 
  createVelocity, 
  createSprite, 
  createPlayerControl,
  createCollider,
  createWeapon,
  createHealth,
  Health
} from "../lib/game/components";
import { MovementSystem } from "../lib/game/systems/MovementSystem";
import { RenderSystem } from "../lib/game/systems/RenderSystem";
import { PlayerControlSystem } from "../lib/game/systems/PlayerControlSystem";
import { ShootingSystem } from "../lib/game/systems/ShootingSystem";
import { CollisionSystem } from "../lib/game/systems/CollisionSystem";
import { LifetimeSystem } from "../lib/game/systems/LifetimeSystem";
import { Camera } from "../lib/game/systems/CameraSystem";
import { AISystem } from "../lib/game/systems/AISystem";
import { WaveManager } from "../lib/game/systems/WaveSystem";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const cameraRef = useRef<Camera>(new Camera());
  const waveManagerRef = useRef<WaveManager | null>(null);
  const [playerHealth, setPlayerHealth] = useState(100);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize ECS
    const entityManager = new EntityManager();

    // Create Player - Ensure we use current canvas dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const player = entityManager.createEntity();
    entityManager.addComponent(player, createTransform(centerX, centerY));
    entityManager.addComponent(player, createVelocity(0, 0, 0.1));
    entityManager.addComponent(player, createSprite("#00ff00", 64, 64, 10, "/images/whale_soldier.png"));
    entityManager.addComponent(player, createPlayerControl(300)); // 300 speed
    entityManager.addComponent(player, createCollider(32, 32, "player"));
    entityManager.addComponent(player, createWeapon(0.1, 10, 800)); // 0.1s cooldown, 10 damage, 800 speed
    entityManager.addComponent(player, createHealth(100));

    // Initialize Wave Manager with correct dimensions
    const waveManager = new WaveManager(entityManager, canvas.width, canvas.height);
    waveManagerRef.current = waveManager;
    waveManager.startNextWave();

    // Initialize Game Loop
    const gameLoop = new GameLoop(
      entityManager,
      (dt) => {
        // Update Systems
        PlayerControlSystem(entityManager, gameLoop.inputState, canvas);
        ShootingSystem(entityManager, gameLoop.inputState, performance.now() / 1000);
        MovementSystem(entityManager, dt);
        AISystem(entityManager, performance.now() / 1000);
        CollisionSystem(entityManager);
        LifetimeSystem(entityManager, dt);
        waveManagerRef.current?.update();
        entityManager.flushDestroyedEntities();
        
        // Update Camera
        cameraRef.current.update(dt);
        if (gameLoop.inputState.shoot) {
           // Add subtle shake when shooting
           cameraRef.current.addShake(0.05);
        }

        // Sync Health UI
        const playerHealthComp = entityManager.getComponent<Health>(player, "Health");
        if (playerHealthComp) {
          setPlayerHealth(playerHealthComp.current);
        }
      },
      () => {
        // Render System
        const offset = cameraRef.current.getOffset();
        ctx.save();
        ctx.translate(offset.x, offset.y);
        RenderSystem(entityManager, ctx, canvas.width, canvas.height);
        ctx.restore();
      }
    );

    gameLoop.start();
    gameLoopRef.current = gameLoop;

    return () => {
      gameLoop.stop();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-rajdhani">
      {/* Game Canvas */}
      <canvas 
        ref={canvasRef}
        className="block w-full h-full image-pixelated"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black font-black-ops text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
              WHALE OPS: MINI GAME
            </h1>
            <div className="text-cod-green font-bold tracking-widest">WAVE 1</div>
            
            {/* Health Bar */}
            <div className="mt-4 w-64 h-4 bg-gray-800 border border-white/20 relative">
              <div 
                className="h-full bg-cod-green transition-all duration-200"
                style={{ width: `${Math.max(0, Math.min(100, playerHealth))}%` }}
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] tracking-widest text-white/80 font-bold">
                HP: {Math.max(0, Math.round(playerHealth))}%
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">SCORE: 000000</div>
            <div className="text-cod-orange font-bold tracking-widest">HIGH SCORE: 000000</div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-white/50 text-sm tracking-widest">
            WASD to Move • Mouse to Aim • Click to Shoot
          </div>
          <Link href="/">
            <button className="pointer-events-auto px-6 py-2 bg-cod-red/20 border border-cod-red/50 text-cod-red font-bold hover:bg-cod-red/40 transition-colors">
              EXIT MISSION
            </button>
          </Link>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />
    </div>
  );
}
