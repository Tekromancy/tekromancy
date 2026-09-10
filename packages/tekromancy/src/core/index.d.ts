import { LightningGenerator, LightningGeneratorOptions } from '../lightning/index.js';
import { FireGenerator, FireGeneratorOptions } from '../fire/index.js';
import { SmokeGenerator, SmokeGeneratorOptions } from '../smoke/index.js';
import { PlasmaGenerator, PlasmaGeneratorOptions } from '../plasma/index.js';
import { WaterGenerator, WaterGeneratorOptions } from '../water/index.js';
import { IceGenerator, IceGeneratorOptions } from '../ice/index.js';

export interface TekromancyFXOptions {
  enabledEffects?: Array<'lightning' | 'fire' | 'smoke' | 'plasma' | 'water' | 'ice'>;
  lightning?: LightningGeneratorOptions;
  fire?: FireGeneratorOptions;
  smoke?: SmokeGeneratorOptions;
  plasma?: PlasmaGeneratorOptions;
  water?: WaterGeneratorOptions;
  ice?: IceGeneratorOptions;
}

export interface EffectStormLevels {
  lightning?: number;
  fire?: number;
  smoke?: number;
  plasma?: number;
  water?: number;
  ice?: number;
}

export declare class TekromancyFX {
  lightning: LightningGenerator | null;
  fire: FireGenerator | null;
  smoke: SmokeGenerator | null;
  plasma: PlasmaGenerator | null;
  water: WaterGenerator | null;
  ice: IceGenerator | null;
  highlighter: ElementHighlighter;
  constructor(options?: TekromancyFXOptions & { highlighter?: ElementHighlighterOptions });
  storm(effectLevels?: EffectStormLevels, duration?: number): void;
  encircle(elementOrSelector: HTMLElement | string, effects?: string | string[], options?: any): void;
  highlight(elementOrSelector: HTMLElement | string, effectType?: string | string[] | Record<string, number>, options?: ElementHighlightOptions): HTMLElement | null;
  attachSubsteps(options?: AttachPresentationOptions): void;
  detachSubsteps(): void;
  clear(): void;
  destroy(): void;
}

export interface ElementHighlightOptions {
  duration?: number;
  intensity?: number;
  padding?: number;
  burst?: boolean;
  flash?: boolean;
  sound?: boolean;
  theme?: string;
  className?: string;
}

export interface ElementHighlighterOptions {
  defaultEffect?: 'lightning' | 'fire' | 'smoke' | 'plasma' | 'water' | 'ice' | string;
  defaultDuration?: number;
  defaultIntensity?: number;
  autoFlash?: boolean;
  stationController?: StationFXController;
  soundHandler?: (effectType: string, intensity: number) => void;
}

export interface AttachPresentationOptions extends ElementHighlightOptions {
  impress?: boolean;
  reveal?: boolean;
  observeDOM?: boolean;
  selector?: string;
}

export declare class ElementHighlighter {
  orchestrator: any;
  defaultEffect: string;
  defaultDuration: number;
  defaultIntensity: number;
  autoFlash: boolean;
  stationController: StationFXController | null;
  soundHandler: ((effectType: string, intensity: number) => void) | null;
  constructor(orchestrator: any, options?: ElementHighlighterOptions);
  highlight(elementOrSelector: HTMLElement | string, effectType?: string | string[] | Record<string, number>, options?: ElementHighlightOptions): HTMLElement | null;
  resolveEffectType(el: HTMLElement, explicitType?: string): string | string[];
  resolveIntensity(el: HTMLElement, fx: string): number;
  attachPresentation(options?: AttachPresentationOptions): void;
  detach(): void;
}

export declare class StationFXController {
  stationMap: Record<string, Record<string, number>>;
  defaultSettings: Record<string, number>;
  constructor(stationMap?: Record<string, Record<string, number>>, options?: { defaultSettings?: Record<string, number> });
  set(stationId: string, config: Record<string, number>): void;
  get(stepElOrId: HTMLElement | string): Record<string, number>;
}
