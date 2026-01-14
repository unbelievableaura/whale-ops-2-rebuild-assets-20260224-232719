import { Component } from "./ecs/EntityManager";

export interface Transform extends Component {
  _type: "Transform";
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface Velocity extends Component {
  _type: "Velocity";
  vx: number;
  vy: number;
  friction: number;
}

export interface Sprite extends Component {
  _type: "Sprite";
  color: string;
  image?: string; // Optional image path
  width: number;
  height: number;
  layer: number;
}

export interface PlayerControl extends Component {
  _type: "PlayerControl";
  speed: number;
}

export interface Collider extends Component {
  _type: "Collider";
  width: number;
  height: number;
  tag: "player" | "enemy" | "projectile" | "enemy_projectile" | "wall" | "air_enemy";
}

export interface Health extends Component {
  _type: "Health";
  current: number;
  max: number;
}

export interface Weapon extends Component {
  _type: "Weapon";
  cooldown: number;
  lastFired: number;
  damage: number;
  projectileSpeed: number;
}

export interface Lifetime extends Component {
  _type: "Lifetime";
  remaining: number; // in seconds
}

// Component Factories
export const createTransform = (x = 0, y = 0, rotation = 0, scale = 1): Transform => ({
  _type: "Transform", x, y, rotation, scale
});

export const createVelocity = (vx = 0, vy = 0, friction = 0): Velocity => ({
  _type: "Velocity", vx, vy, friction
});

export const createSprite = (color: string, width: number, height: number, layer = 0, image?: string): Sprite => ({
  _type: "Sprite", color, width, height, layer, image
});

export const createPlayerControl = (speed: number): PlayerControl => ({
  _type: "PlayerControl", speed
});

export const createCollider = (width: number, height: number, tag: Collider["tag"]): Collider => ({
  _type: "Collider", width, height, tag
});

export const createHealth = (max: number): Health => ({
  _type: "Health", current: max, max
});

export const createWeapon = (cooldown: number, damage: number, projectileSpeed: number): Weapon => ({
  _type: "Weapon", cooldown, lastFired: 0, damage, projectileSpeed
});

export const createLifetime = (seconds: number): Lifetime => ({
  _type: "Lifetime", remaining: seconds
});

export interface AIControl extends Component {
  _type: "AIControl";
  state: "idle" | "chase" | "strafe" | "circle";
  aiType: "ground" | "air";
  detectionRange: number;
}

export interface Score extends Component {
  _type: "Score";
  value: number;
}

export const createAIControl = (detectionRange: number = 300, aiType: "ground" | "air" = "ground"): AIControl => ({
  _type: "AIControl", state: "idle", detectionRange, aiType
});

export const createScore = (value: number): Score => ({
  _type: "Score", value
});
