export interface SmokeParticleOptions {
  theme?: 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple';
  spread?: number;
  speedScale?: number;
  sizeScale?: number;
  growthScale?: number;
  density?: number;
}

export declare class SmokeParticle {
  x: number;
  y: number;
  theme: string;
  size: number;
  life: number;
  decay: number;
  constructor(x: number, y: number, options?: SmokeParticleOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface SmokeGeneratorOptions {
  canvasId?: string;
  theme?: 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple';
  maxParticles?: number;
  autoResize?: boolean;
  autoInjectStyles?: boolean;
}

export interface SmokeBurstOptions {
  count?: number;
  theme?: 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple';
  intensity?: number;
}

export interface SmokeEngulfOptions {
  duration?: number;
  intensity?: number;
  theme?: 'gray' | 'dark' | 'toxic' | 'cyan' | 'purple';
}

export declare class SmokeGenerator {
  canvasId: string;
  theme: string;
  maxParticles: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  constructor(options?: SmokeGeneratorOptions);
  burst(x: number, y: number, options?: SmokeBurstOptions): void;
  engulf(elementOrSelector: HTMLElement | string, options?: SmokeEngulfOptions): void;
  startHaze(duration?: number, amount?: number, theme?: string | null): void;
  clear(): void;
  destroy(): void;
}

export declare function createSmoke(options?: SmokeGeneratorOptions): SmokeGenerator;
