import type { Metadata } from "next";

import { SectionIndex } from "@/components/archive/SectionIndex";
import { MENU } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Quests in Oxygen Not Included — Seed Archive",
  description: "The stories an Oxygen Not Included world can hold.",
  alternates: { canonical: "/quests" },
};

export default function QuestsPage() {
  return <SectionIndex item={MENU[3]} />;
}
