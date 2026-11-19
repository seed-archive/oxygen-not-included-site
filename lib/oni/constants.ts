// The game's values the pages compute with, each read from the game's own
// buildings and tuning by the Oxygen Not Included generator's notes.

// Seconds in a cycle.
export const CYCLE_SECONDS = 600;
// A duplicant breathes this much oxygen, kg/s, and eats this many kcal a cycle.
export const DUPLICANT_OXYGEN = 0.1;
export const DUPLICANT_KCAL = 1000;
// An electrolyzer takes 1 kg/s of water and gives 0.888 kg/s of oxygen, at 120 W.
export const ELECTROLYZER_WATER = 1;
export const ELECTROLYZER_OXYGEN = 0.888;
export const ELECTROLYZER_WATTS = 120;
// An oxygen diffuser turns 0.55 kg/s of algae into 0.5 kg/s of oxygen.
export const DIFFUSER_ALGAE = 0.55;
export const DIFFUSER_OXYGEN = 0.5;
// Mealwood: 600 kcal a harvest, every 3 cycles, eating 10 kg of dirt a cycle.
export const MEALWOOD_KCAL = 600;
export const MEALWOOD_CYCLES = 3;
export const MEALWOOD_DIRT = 10;
// Generators burning a geyser's gas: kg/s for 800 W.
export const GAS_GENERATOR = { burn: 0.09, watts: 800 };
export const HYDROGEN_GENERATOR = { burn: 0.1, watts: 800 };

const n = (v: number) => v.toLocaleString("en", { maximumFractionDigits: 2 });

// The numbers a page's text may name, `{{name}}` in its Markdown.
export const TEXT_VALUES: Record<string, string> = {
  duplicantOxygen: n(DUPLICANT_OXYGEN),
  duplicantKcal: n(DUPLICANT_KCAL),
  electrolyzerWater: n(ELECTROLYZER_WATER),
  electrolyzerOxygen: n(ELECTROLYZER_OXYGEN),
  electrolyzerWatts: n(ELECTROLYZER_WATTS),
  electrolyzerDuplicants: n(ELECTROLYZER_OXYGEN / DUPLICANT_OXYGEN),
  diffuserAlgae: n(DIFFUSER_ALGAE),
  diffuserOxygen: n(DIFFUSER_OXYGEN),
  diffuserDuplicants: n(DIFFUSER_OXYGEN / DUPLICANT_OXYGEN),
  mealwoodKcal: n(MEALWOOD_KCAL),
  mealwoodCycles: n(MEALWOOD_CYCLES),
  mealwoodDirt: n(MEALWOOD_DIRT),
  mealwoodPerDuplicant: n(DUPLICANT_KCAL / (MEALWOOD_KCAL / MEALWOOD_CYCLES)),
  gasBurn: n(GAS_GENERATOR.burn),
  gasWatts: n(GAS_GENERATOR.watts),
  hydrogenBurn: n(HYDROGEN_GENERATOR.burn),
  hydrogenWatts: n(HYDROGEN_GENERATOR.watts),
  cycleSeconds: n(CYCLE_SECONDS),
};
