import { BASE_PATH } from "@/lib/site";

import generator from "./generator.json";

// The generator's numbers named: the kinds of places and of worlds, and the
// recorded coordinates the map can show. Written by the Oxygen Not Included generator.
export const KINDS: string[] = generator.kinds;
export const WORLD_KINDS: string[] = generator.worlds;
export const SEEDS: string[] = generator.seeds;

// The wasm-bindgen glue beside the .wasm, as an absolute URL the worker can import.
export function moduleUrl(): string {
  return new URL(`${BASE_PATH}/wasm/map.js`, window.location.href).href;
}

// What the generator rolls for a geyser: the long-term average and emission
// while erupting (kg/s), eruption length and period (s), active and dormant
// spells (cycles), and output temperature (°C).
export type Geyser = {
  average: number;
  emit: number;
  erupt: number;
  period: number;
  active: number;
  dormant: number;
  temperature: number;
};

export type Place = { kind: string; x: number; y: number; geyser?: Geyser };

// Numbers a place in `places`: kind, x, y, then the geyser's seven (zeros for
// a place that is not a geyser). The Oxygen Not Included generator's layout.
const PLACE_STRIDE = 10;

export function decodePlaces(raw: Float32Array): Place[] {
  const out: Place[] = [];
  for (let i = 0; i + PLACE_STRIDE <= raw.length; i += PLACE_STRIDE) {
    const [average, emit, erupt, period, active, dormant, temperature] =
      raw.slice(i + 3, i + PLACE_STRIDE);
    out.push({
      kind: KINDS[raw[i]] ?? "unknown",
      x: raw[i + 1],
      y: raw[i + 2],
      geyser:
        average > 0
          ? { average, emit, erupt, period, active, dormant, temperature }
          : undefined,
    });
  }
  return out;
}

// A world's name from its game path ("dlc5::worlds/AquaticBaseGameAsteroid"): the last part split into words,
// until the game's own names are written by the generator.
export function worldName(path: string | undefined): string | undefined {
  return path
    ?.split("/")
    .pop()
    ?.replace(/([a-z])([A-Z])/g, "$1 $2");
}
export const DEVICES: string[] = generator.devices;
