export interface FireParticleOptions {
  theme?: 'amber' | 'blue' | 'green' | 'purple';
  isEmber?: boolean;
  spread?: number;
  speedScale?: number;
  sizeScale?: number;
}

export declare class FireParticle {
  x: number;
  y: number;
  theme: string;
  isEmber: boolean;
  size: number;
  life: number;
  decay: number;
  constructor(x: number, y: number, options?: FireParticleOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface FireGeneratorOptions {
  canvasId?: string;
  theme?: 'amber' | 'blue' | 'green' | 'purple';
  maxParticles?: number;
  autoResize?: boolean;
  autoInjectStyles?: boolean;
}

export interface FireBurstOptions {
  count?: number;
  theme?: 'amber' | 'blue' | 'green' | 'purple';
  intensity?: number;
}

export interface FireEncircleOptions {
  duration?: number;
  intensity?: number;
  theme?: 'amber' | 'blue' | 'green' | 'purple';
}

export declare class FireGenerator {
  canvasId: string;
  theme: string;
  maxParticles: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  constructor(options?: FireGeneratorOptions);
  burst(x: number, y: number, options?: FireBurstOptions): void;
  encircle(elementOrSelector: HTMLElement | string, options?: FireEncircleOptions): void;
  startInferno(duration?: number, amount?: number, theme?: string | null): void;
  clear(): void;
  destroy(): void;
}

export declare function createFire(options?: FireGeneratorOptions): FireGenerator;
