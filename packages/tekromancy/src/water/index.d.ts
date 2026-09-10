export interface WaterRippleOptions {
  theme?: 'cyan' | 'deep' | 'emerald' | 'mercury';
  initialRadius?: number;
  maxRadius?: number;
  speed?: number;
  speedScale?: number;
  decay?: number;
  ringCount?: number;
  scale?: number;
}

export declare class WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  constructor(x: number, y: number, options?: WaterRippleOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface WaterDropletOptions {
  theme?: string;
  angle?: number;
  speed?: number;
  speedScale?: number;
  scale?: number;
  targetY?: number;
}

export declare class WaterDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  constructor(x: number, y: number, options?: WaterDropletOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface WaterGeneratorOptions {
  canvasId?: string;
  theme?: 'cyan' | 'deep' | 'emerald' | 'mercury';
  maxRipples?: number;
  maxDroplets?: number;
  autoResize?: boolean;
  autoInjectStyles?: boolean;
}

export interface WaterSplashOptions {
  scale?: number;
  theme?: 'cyan' | 'deep' | 'emerald' | 'mercury';
  dropletCount?: number;
}

export interface WaterEncircleOptions {
  duration?: number;
  intensity?: number;
  theme?: 'cyan' | 'deep' | 'emerald' | 'mercury';
}

export declare class WaterGenerator {
  canvasId: string;
  theme: string;
  maxRipples: number;
  maxDroplets: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  constructor(options?: WaterGeneratorOptions);
  splash(x: number, y: number, options?: WaterSplashOptions): void;
  encircle(elementOrSelector: HTMLElement | string, options?: WaterEncircleOptions): void;
  startRain(duration?: number, amount?: number, theme?: string | null): void;
  clear(): void;
  destroy(): void;
}

export declare function createWater(options?: WaterGeneratorOptions): WaterGenerator;
