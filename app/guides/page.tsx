import type { Metadata } from "next";

import { SectionIndex } from "@/components/archive/SectionIndex";
import { MENU } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Guides to Oxygen Not Included seeds — Seed Archive",
  description:
    "How to read an Oxygen Not Included seed and what it gives a colony.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return <SectionIndex item={MENU[1]} />;
}
