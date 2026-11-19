import type { Metadata } from "next";
import Typography from "@mui/material/Typography";

import { PageFrame } from "@/components/archive/PageFrame";
import { serverFormat, serverMessages } from "@/lib/i18n/server";
import { MENU } from "@/lib/menu";
import generator from "@/lib/oni/generator.json";

const CATALOG = MENU[0];
// Seconds in a cycle (the game's).
const CYCLE_SECONDS = 600;

// A name from the dictionary, else the game's id split into words.
const named = (key: string, id: string) =>
  serverMessages[key] ??
  id.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2");

const n = (v: number) => v.toLocaleString("en", { maximumFractionDigits: 1 });
const range = ([a, b]: number[], scale = 1) =>
  a === b ? n(a * scale) : `${n(a * scale)}–${n(b * scale)}`;

export const metadata: Metadata = {
  title: "Geysers in Oxygen Not Included — Seed Archive",
  description:
    "Every geyser, vent and volcano: what it emits, how hot, how much per cycle, and how often it erupts and rests.",
  alternates: { canonical: "/catalog/geysers" },
};

// The catalogue's first page: every geyser type with the ranges its rolls can
// take, from the Oxygen Not Included generator's table.
export default function GeysersPage() {
  const [lead, rest] = serverFormat("pages.catalog.geyserTable.lead")
    .replace("<b>", "")
    .split("</b>");
  const head = (id: string) => serverFormat(`pages.catalog.geyserTable.${id}`);
  return (
    <PageFrame
      section={CATALOG}
      crumb="archive.geysers"
      title={serverFormat("archive.geysers")}
    >
      <Typography gutterBottom>
        <b>{lead}</b>
        {rest}
      </Typography>
      <table>
        <thead>
          <tr>
            {[
              "name",
              "element",
              "temperature",
              "rate",
              "eruption",
              "active",
              "random",
            ].map((h) => (
              <th key={h}>{head(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generator.geyserTypes.map((g) => (
            <tr key={g.id}>
              <td>{named(`pages.map.places.${g.id}`, g.id)}</td>
              <td>{named(`pages.map.elements.${g.element}`, g.element)}</td>
              <td>{n(g.celsius)}</td>
              <td>{range(g.rate)}</td>
              <td>
                {range(g.iterationShare, 100)}% of {range(g.iteration)} s
              </td>
              <td>
                {range(
                  g.yearShare.map((s, i) => (s * g.year[i]) / CYCLE_SECONDS),
                )}
              </td>
              <td>{g.random ? "✓" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
