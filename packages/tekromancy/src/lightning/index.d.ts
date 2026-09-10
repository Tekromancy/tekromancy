/**
 * TypeScript definitions for @tekromancy/tekromancy/lightning
 */

export interface LightningGeneratorOptions {
  canvasId?: string;
  flashOverlayId?: string;
  zIndex?: number;
  autoInjectStyles?: boolean;
  autoCreateOverlay?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SkyStrikeOptions {
  intensity?: number;
  displace?: number;
  color?: string;
  branches?: number;
  life?: number;
  decay?: number;
}

export interface EncircleOptions {
  duration?: number;
  padding?: number;
  intensity?: number;
  color?: string;
  secondaryColor?: string;
}

export class LightningGenerator {
  constructor(options?: LightningGeneratorOptions);
  flash(intensity?: number, duration?: number): void;
  generateFractalPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    displace?: number,
    minSegment?: number
  ): Array<{ x: number; y: number }>;
  strikeSky(x1: number, y1: number, x2: number, y2: number, opts?: SkyStrikeOptions): void;
  strikeTarget(targetXOrEl: number | Element, targetY?: number | SkyStrikeOptions, opts?: SkyStrikeOptions): void;
  encircle(target: Element | DOMRect, options?: EncircleOptions): void;
  startStorm(durationMs?: number, amount?: number): void;
  stopStorm(): void;
  destroy(): void;
}

export interface LightningBoltOptions {
  color?: string;
  coreColor?: string;
  decay?: number;
  maxDepth?: number;
  forkChance?: number;
}

export class LightningBolt {
  constructor(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    intensity?: number,
    options?: LightningBoltOptions
  );
  update(): boolean;
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface StationLightningOptions {
  defaultAmount?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface ImpressHooks {
  onStepLeave?: (data: { event: Event; nextStep: Element; amount: number; level: number }) => void;
  onStepEnter?: (data: { event: Event; activeStep: Element; amount: number; level: number }) => void;
  onSubstepEnter?: (data: { event: Event; element: Element; amount: number; level: number }) => void;
}

export class StationLightningController {
  constructor(stationMap?: Record<string, number>, options?: StationLightningOptions);
  set(stationId: string, amount: number): void;
  get(stepElOrId: string | Element): number;
  getLevel(stepElOrId: string | Element): number;
  bindImpress(impressApi: any, lightningGenerator: LightningGenerator, hooks?: ImpressHooks): void;
}

export function createLightning(options?: LightningGeneratorOptions): LightningGenerator;
