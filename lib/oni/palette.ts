import generator from "./generator.json";

// A built class the table lacks is grey.
const UNKNOWN: [number, number, number] = [128, 128, 128];

// Beyond the asteroid: space.
export const SPACE = "#14141e";

export const BIOMES: string[] = generator.biomes;
export const STRUCTURES: string[] = generator.structures;
// The elements of the map's cells, in the tile's order, and each one's colour
// as the game's overlays draw it (its RGBA, read from the game's assets).
export const ELEMENTS: string[] = generator.elements;
const ELEMENT_COLOUR: number[][] = generator.colours;

// The colour of each built class: our own choice, greys and metals that stand
// out from every biome.
const STRUCTURE_COLOUR: Record<string, [number, number, number]> = {
  wall: [235, 235, 225],
  tile: [160, 160, 170],
  window: [150, 220, 240],
  door: [255, 200, 60],
  ladder: [200, 140, 70],
  wire: [255, 120, 40],
  pipe: [120, 200, 120],
};

// 256 RGBA entries for the tile's bytes: 0 is vacuum or space (transparent, so
// the background shows), n is element n − 1, then the built classes. Every
// entry is opaque: a canvas would zero the colour of a transparent pixel.
export function mapPalette(): Uint8ClampedArray {
  const p = new Uint8ClampedArray(256 * 4);
  ELEMENT_COLOUR.forEach(([r, g, b], i) => {
    p.set([r, g, b, 255], (i + 1) * 4);
  });
  STRUCTURES.forEach((key, i) => {
    p.set(
      [...(STRUCTURE_COLOUR[key] ?? UNKNOWN), 255],
      (ELEMENTS.length + 1 + i) * 4,
    );
  });
  return p;
}
