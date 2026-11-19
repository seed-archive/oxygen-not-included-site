"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormattedMessage, useIntl } from "react-intl";

import {
  readAddress,
  type Switch,
  withSeed,
  withWorld,
} from "@seed-archive/map/address";
import type { Card } from "@seed-archive/map/card";
import { MapClient, type World } from "@seed-archive/map/client";
import type { Marker, Overlay } from "@seed-archive/map/viewer";

import { ArchiveBar } from "@/components/archive/ArchiveBar";
import {
  decodePlaces,
  DEVICES,
  type Geyser,
  moduleUrl,
  SEEDS,
  WORLD_KINDS,
  worldName,
} from "@/lib/oni/generator";
import {
  BIOMES,
  ELEMENTS,
  mapPalette,
  SPACE,
  STRUCTURES,
} from "@/lib/oni/palette";
import {
  CYCLE_SECONDS,
  DUPLICANT_OXYGEN,
  ELECTROLYZER_OXYGEN,
  ELECTROLYZER_WATER,
  GAS_GENERATOR,
  HYDROGEN_GENERATOR,
} from "@/lib/oni/constants";

// Kinds that are placed devices rather than geysers.
const DEVICE = new Set(DEVICES);

// Leaflet touches `window`, so the viewer loads in the browser only.
const Viewer = dynamic(() => import("@seed-archive/map/viewer"), {
  ssr: false,
});

// An asteroid is a few hundred cells across: at zoom 4 a cell is sixteen
// pixels, at −2 a quarter of one (our own choice).
const MIN_ZOOM = -2;
const MAX_ZOOM = 4;
// A world of cells: at zoom 0 a pixel is one cell, and nothing finer is
// computed (the shared rule of the archive's maps).
const MAX_NATIVE_ZOOM = 0;
// A link to a cell opens close enough to see it: four pixels a cell (our own
// choice).
const FOCUS_ZOOM = 2;

// No overlays and no switchable layers yet. Kept as constants: the viewer
// rebuilds its tiles whenever it gets a new array or object.
const NO_OVERLAYS: Overlay[] = [];
const ALL_VISIBLE: Record<string, boolean> = {};
// No layer switches yet, so the address holds none.
const NO_SWITCHES: Switch[] = [];

// What a geyser's average feeds, by its type (only types whose output a
// building takes as it is).
function feeds(
  kind: string,
  g: Geyser,
  t: (id: string, values?: Record<string, string | number>) => string,
  n: (v: number, digits: number) => string,
): string[] {
  if (kind === "hot_water") {
    const electrolyzers = g.average / ELECTROLYZER_WATER;
    return [
      t("pages.map.geyser.oxygen", {
        electrolyzers: n(electrolyzers, 1),
        duplicants: n(
          (electrolyzers * ELECTROLYZER_OXYGEN) / DUPLICANT_OXYGEN,
          1,
        ),
      }),
    ];
  }
  const generator =
    kind === "methane"
      ? GAS_GENERATOR
      : kind === "hot_hydrogen"
        ? HYDROGEN_GENERATOR
        : null;
  return generator
    ? [
        t("pages.map.geyser.power", {
          generators: n(g.average / generator.burn, 1),
          watts: n((g.average / generator.burn) * generator.watts, 0),
        }),
      ]
    : [];
}

// A geyser's card: what it gives on average, how it erupts, how long it rests,
// and the tank that carries a steady draw of its average through a dormancy.
function geyserLines(
  kind: string,
  g: Geyser,
  t: (id: string, values?: Record<string, string | number>) => string,
): string[] {
  const n = (v: number, digits: number) =>
    v.toLocaleString("en", { maximumFractionDigits: digits });
  return [
    t("pages.map.geyser.average", {
      kgs: n(g.average, 3),
      kgCycle: n(g.average * CYCLE_SECONDS, 0),
    }),
    t("pages.map.geyser.erupts", {
      emit: n(g.emit, 2),
      erupt: n(g.erupt, 0),
      period: n(g.period, 0),
    }),
    t("pages.map.geyser.active", {
      active: n(g.active, 1),
      dormant: n(g.dormant, 1),
    }),
    t("pages.map.geyser.tank", {
      tonnes: n((g.average * g.dormant * CYCLE_SECONDS) / 1000, 1),
    }),
    t("pages.map.geyser.temperature", { degrees: n(g.temperature, 0) }),
    ...feeds(kind, g, t, n),
  ];
}

// The map page: the map fills everything under the header, its controls sit on
// it, and there is no footer, as on the other games' maps.
export function MapScreen() {
  const intl = useIntl();
  const t = useCallback(
    (id: string, values?: Record<string, string | number>) =>
      intl.formatMessage({ id }, values),
    [intl],
  );
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  // The archive's one map address: seed, asteroid, and a cell to centre on.
  const address = readAddress(params, NO_SWITCHES);
  const seed = address.seed ?? SEEDS[0] ?? null;
  const index = address.world;
  // The viewer compares the focus by content, so a new object each render is
  // fine.
  const linked = address.focus;
  const focus = linked ? { ...linked, zoom: linked.zoom ?? FOCUS_ZOOM } : null;

  const [client, setClient] = useState<MapClient | null>(null);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const palette = useMemo(() => mapPalette(), []);

  useEffect(() => {
    const c = new MapClient(moduleUrl());
    let live = true;
    // The page uses the generator once it answers.
    c.worlds("").then(() => live && setClient(c));
    return () => {
      live = false;
      c.close();
    };
  }, []);

  useEffect(() => {
    if (!client || !seed) {
      return;
    }
    let live = true;
    client.worlds(seed).then((w) => live && setWorlds(w));
    client.places(seed, index).then((raw) => {
      if (!live) {
        return;
      }
      setMarkers(
        decodePlaces(raw).map((p) => ({
          layer: "places",
          x: p.x,
          y: p.y,
          card: {
            title: t(`pages.map.places.${p.kind}`),
            meta: `x ${Math.round(p.x)}, y ${Math.round(p.y)}`,
            lines: p.geyser ? geyserLines(p.kind, p.geyser, t) : [],
          },
          // Geysers white, the placed devices gold (our own choice).
          dot: { radius: 5, fill: DEVICE.has(p.kind) ? "#ffc107" : "#ffffff" },
        })),
      );
    });
    return () => {
      live = false;
    };
  }, [client, seed, index, t]);

  const world = useMemo(
    () => (worlds[index] ? { index, bounds: worlds[index] } : null),
    [worlds, index],
  );

  const describe = useCallback(
    async (x: number, y: number): Promise<Card | null> => {
      if (!client || !seed) {
        return null;
      }
      const [element, biome, built] = await client.point(seed, index, x, y);
      if (!biome) {
        return null;
      }
      const lines = [
        t("pages.map.inBiome", {
          biome: t(`pages.map.biomes.${BIOMES[biome - 1]}`),
        }),
      ];
      if (built) {
        lines.push(
          t("pages.map.built", {
            name: t(
              `pages.map.structures.${STRUCTURES[built - ELEMENTS.length - 1]}`,
            ),
          }),
        );
      }
      return {
        title: element
          ? t(`pages.map.elements.${ELEMENTS[element - 1]}`)
          : t("pages.map.vacuum"),
        meta: `x ${Math.floor(x)}, y ${Math.floor(y)}`,
        lines,
      };
    },
    [client, seed, index, t],
  );

  const go = (query: string) =>
    router.replace(`${pathname}?${query}`, { scroll: false });

  const labels = useMemo(
    () => ({
      pin: t("pages.map.pin"),
      removePin: t("pages.map.removePin"),
      length: (units: number) => t("pages.map.length", { n: units }),
    }),
    [t],
  );

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <ArchiveBar />
      <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
        <Typography variant="h1" sx={{ position: "absolute", left: -10000 }}>
          <FormattedMessage id="pages.map.title" />
        </Typography>
        <Viewer
          client={client}
          seed={seed}
          world={world}
          palette={palette}
          background={SPACE}
          overlays={NO_OVERLAYS}
          visible={ALL_VISIBLE}
          markers={markers}
          describe={describe}
          ruler={false}
          focus={focus}
          pinsKey="oxygen-not-included-pins"
          labels={labels}
          onCursor={setCursor}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          maxNativeZoom={MAX_NATIVE_ZOOM}
          scale={false}
        />
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            p: 2,
            zIndex: 1000,
            width: 260,
          }}
        >
          <Stack spacing={1.5}>
            <TextField
              select
              size="small"
              label={t("pages.map.seed")}
              value={seed ?? ""}
              onChange={(e) => go(withSeed(params, e.target.value))}
            >
              {SEEDS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label={t("pages.map.world")}
              value={worlds.length ? index : ""}
              onChange={(e) => go(withWorld(params, Number(e.target.value)))}
            >
              {worlds.map((w, i) => (
                <MenuItem key={i} value={i}>
                  {worldName(WORLD_KINDS[w.kind]) ?? i}
                </MenuItem>
              ))}
            </TextField>
            {SEEDS.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                <FormattedMessage id="pages.map.noSeeds" />
              </Typography>
            ) : null}
          </Stack>
        </Paper>
        {cursor ? (
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              px: 1.5,
              py: 0.5,
              zIndex: 1000,
            }}
          >
            <Typography variant="body2">
              <FormattedMessage
                id="pages.map.cursor"
                values={{ x: Math.floor(cursor.x), y: Math.floor(cursor.y) }}
              />
            </Typography>
          </Paper>
        ) : null}
      </Box>
    </Box>
  );
}
