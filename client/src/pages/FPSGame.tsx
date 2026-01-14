import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RGBELoader, TDSLoader } from "three-stdlib";

// --- Game Constants ---
const PLAYER_SPEED = 7.0;
const SPRINT_MULTIPLIER = 1.6;
const JUMP_FORCE = 7;
const GRAVITY = 20;
const GROUND_Y = 2.5;

export default function FPSGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Game
    class Game {
      private scene!: THREE.Scene;
      private camera!: THREE.PerspectiveCamera;
      private renderer!: THREE.WebGLRenderer;
      private yaw: number = 0;
      private pitch: number = 0;
      private lastTime: number = 0;
      private isMoving: boolean = false;
      private isSprinting: boolean = false;
      private isJumping: boolean = false;
      private verticalVelocity: number = 0;
      private lastWKeyPressTime: number = 0;
      private doubleTapDelay: number = 300;
      private keys: { [key: string]: boolean } = {};
      private animationId: number = 0;

      constructor(container: HTMLElement) {
        this.init(container);
        this.createScene();
        this.setupControls();
        this.animate();
      }

      private init(container: HTMLElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x87ceeb);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.45;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        container.appendChild(this.renderer.domElement);
      }

      private createScene() {
        // Skybox
        const skyboxGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyboxMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
        const hdrLoader = new RGBELoader();
        hdrLoader.load("/assets/textures/skyboxes/skybox.hdr", (texture: THREE.Texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          this.scene.environment = envMap;
          this.scene.background = envMap;
          pmremGenerator.dispose();
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffa500, 2.0);
        sunLight.position.set(50, 15, 30);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.1;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        this.scene.add(sunLight);

        // Load Town Model
        const loader = new TDSLoader();
        loader.setResourcePath("/assets/textures/environment/");
        loader.load("/assets/models/environment/Town.3ds", (object: THREE.Group) => {
          object.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Material adjustments
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat: any, index: number) => {
                if (mat) {
                  const matName = mat.name ? mat.name.toLowerCase() : "";
                  const isWindow = matName.includes("window");
                  const newMat = new THREE.MeshStandardMaterial({
                    map: mat.map || null,
                    color: mat.color || 0xffffff,
                    roughness: isWindow ? 0.1 : 0.95,
                    metalness: isWindow ? 0.8 : 0.0,
                  });
                  
                  if (newMat.map) {
                    if (matName.includes("floor") || matName.includes("ground") || matName.includes("road")) {
                      newMat.map.repeat.set(20, 20);
                    } else if (!matName.includes("door") && !isWindow) {
                      newMat.map.repeat.set(3, 3);
                    }
                    newMat.map.wrapS = THREE.RepeatWrapping;
                    newMat.map.wrapT = THREE.RepeatWrapping;
                  }
                  
                  if (Array.isArray(child.material)) {
                    child.material[index] = newMat;
                  } else {
                    child.material = newMat;
                  }
                }
              });
            }
          });
          object.scale.set(0.1, 0.1, 0.1);
          object.rotation.x = -Math.PI / 2;
          this.scene.add(object);
        });

        this.camera.position.set(0, 2.5, 5);
      }

      private setupControls() {
        document.addEventListener("click", () => {
          if (document.pointerLockElement !== this.renderer.domElement) {
            this.renderer.domElement.requestPointerLock();
          }
        });

        document.addEventListener("mousemove", (event) => {
          if (document.pointerLockElement === this.renderer.domElement) {
            const sensitivity = 0.002;
            this.yaw -= event.movementX * sensitivity;
            this.pitch -= event.movementY * sensitivity;
            this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            this.camera.quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, "YXZ"));
          }
        });

        document.addEventListener("keydown", (event) => {
          const wasPressed = this.keys[event.code];
          this.keys[event.code] = true;

          if (event.code === "KeyW" && !wasPressed) {
            const currentTime = Date.now();
            if (currentTime - this.lastWKeyPressTime < this.doubleTapDelay) {
              this.isSprinting = true;
            }
            this.lastWKeyPressTime = currentTime;
          }

          if (event.code === "Space" && !this.isJumping) {
            this.isJumping = true;
            this.verticalVelocity = JUMP_FORCE;
          }
        });

        document.addEventListener("keyup", (event) => {
          this.keys[event.code] = false;
          if (event.code === "KeyW") this.isSprinting = false;
        });
      }

      private handleMovement(deltaTime: number) {
        const speed = this.isSprinting ? PLAYER_SPEED * SPRINT_MULTIPLIER : PLAYER_SPEED;
        const direction = new THREE.Vector3();

        if (this.keys["KeyW"]) direction.z -= speed * deltaTime;
        if (this.keys["KeyS"]) direction.z += speed * deltaTime;
        if (this.keys["KeyA"]) direction.x -= speed * deltaTime;
        if (this.keys["KeyD"]) direction.x += speed * deltaTime;

        this.isMoving = direction.length() > 0;

        if (this.isMoving) {
          direction.applyQuaternion(this.camera.quaternion);
          direction.y = 0;
          this.camera.position.add(direction);
        }
      }

      private handleJump(deltaTime: number) {
        if (this.isJumping || this.camera.position.y > GROUND_Y) {
          this.verticalVelocity -= GRAVITY * deltaTime;
          this.camera.position.y += this.verticalVelocity * deltaTime;

          if (this.camera.position.y <= GROUND_Y) {
            this.camera.position.y = GROUND_Y;
            this.verticalVelocity = 0;
            this.isJumping = false;
          }
        }
      }

      private animate(currentTime: number = 0) {
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        const deltaTime = this.lastTime === 0 ? 0 : (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.handleMovement(deltaTime);
        this.handleJump(deltaTime);
        this.renderer.render(this.scene, this.camera);
      }

      public cleanup() {
        cancelAnimationFrame(this.animationId);
        this.renderer.dispose();
        // Remove event listeners if needed
      }
    }

    gameRef.current = new Game(containerRef.current);

    return () => {
      if (gameRef.current) {
        gameRef.current.cleanup();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference" />
      <div className="absolute top-4 left-4 text-white font-mono text-sm pointer-events-none bg-black/50 p-2 rounded">
        WASD to Move | SPACE to Jump | SHIFT to Sprint | CLICK to Lock Mouse
      </div>
      <a href="/" className="absolute top-4 right-4 text-white font-mono text-sm border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors z-50 bg-black/50">
        EXIT MISSION
      </a>
    </div>
  );
}
