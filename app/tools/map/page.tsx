import { Suspense } from "react";
import type { Metadata } from "next";

import { MapScreen } from "@/components/oni/MapScreen";

export const metadata: Metadata = {
  title: "Oxygen Not Included seed map — Seed Archive",
  description:
    "The map of any Oxygen Not Included seed: its asteroids, their biomes and geysers.",
  alternates: { canonical: "/tools/map" },
};

export default function MapPage() {
  // The map reads its seed from the address, which is known only in the
  // browser.
  return (
    <Suspense>
      <MapScreen />
    </Suspense>
  );
}
