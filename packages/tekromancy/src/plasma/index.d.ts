export interface PlasmaArcOptions {
  theme?: 'magenta' | 'cyan' | 'violet' | 'solar';
  frequency?: number;
  amplitude?: number;
  decay?: number;
  segments?: number;
}

export declare class PlasmaArc {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  theme: string;
  life: number;
  decay: number;
  constructor(x1: number, y1: number, x2: number, y2: number, options?: PlasmaArcOptions);
  update(): boolean;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface PlasmaGeneratorOptions {
  canvasId?: string;
  theme?: 'magenta' | 'cyan' | 'violet' | 'solar';
  maxArcs?: number;
  autoResize?: boolean;
  autoInjectStyles?: boolean;
}

export interface PlasmaOrbOptions {
  radius?: number;
  tendrilCount?: number;
  theme?: 'magenta' | 'cyan' | 'violet' | 'solar';
  intensity?: number;
}

export interface PlasmaEncircleOptions {
  duration?: number;
  intensity?: number;
  theme?: 'magenta' | 'cyan' | 'violet' | 'solar';
}

export declare class PlasmaGenerator {
  canvasId: string;
  theme: string;
  maxArcs: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  constructor(options?: PlasmaGeneratorOptions);
  strikeOrb(x: number, y: number, options?: PlasmaOrbOptions): void;
  encircle(elementOrSelector: HTMLElement | string, options?: PlasmaEncircleOptions): void;
  startTempest(duration?: number, amount?: number, theme?: string | null): void;
  clear(): void;
  destroy(): void;
}

export declare function createPlasma(options?: PlasmaGeneratorOptions): PlasmaGenerator;
