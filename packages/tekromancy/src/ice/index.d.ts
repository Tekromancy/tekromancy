export interface IceCrystalOptions {
  theme?: 'frost' | 'glacial' | 'rime' | 'void';
  depth?: number;
  maxDepth?: number;
  length?: number;
  scale?: number;
  growthSpeed?: number;
  speedScale?: number;
  decay?: number;
}

export declare class IceCrystal {
  x: number;
  y: number;
  angle: number;
  theme: string;
  depth: number;
  life: number;
  fade: boolean;
  constructor(x: number, y: number, angle: number, options?: IceCrystalOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export declare class IceShard {
  x: number;
  y: number;
  size: number;
  life: number;
  constructor(x: number, y: number, options?: { theme?: string; speedScale?: number; scale?: number });
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface IceGeneratorOptions {
  canvasId?: string;
  theme?: 'frost' | 'glacial' | 'rime' | 'void';
  maxCrystals?: number;
  maxShards?: number;
  autoResize?: boolean;
  autoInjectStyles?: boolean;
}

export interface IceShatterOptions {
  count?: number;
  theme?: 'frost' | 'glacial' | 'rime' | 'void';
  intensity?: number;
}

export interface IceFreezeOptions {
  duration?: number;
  intensity?: number;
  theme?: 'frost' | 'glacial' | 'rime' | 'void';
}

export declare class IceGenerator {
  canvasId: string;
  theme: string;
  maxCrystals: number;
  maxShards: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  constructor(options?: IceGeneratorOptions);
  shatter(x: number, y: number, options?: IceShatterOptions): void;
  freeze(elementOrSelector: HTMLElement | string, options?: IceFreezeOptions): void;
  encircle(elementOrSelector: HTMLElement | string, options?: IceFreezeOptions): void;
  startBlizzard(duration?: number, amount?: number, theme?: string | null): void;
  clear(): void;
  destroy(): void;
}

export declare function createIce(options?: IceGeneratorOptions): IceGenerator;
