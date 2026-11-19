import type { Metadata } from "next";

import { SectionIndex } from "@/components/archive/SectionIndex";
import { MENU } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Catalog of Oxygen Not Included — Seed Archive",
  description: "What the worlds of Oxygen Not Included hold, type by type.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  return <SectionIndex item={MENU[0]} />;
}
