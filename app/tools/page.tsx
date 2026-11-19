import type { Metadata } from "next";

import { ToolsIndex } from "@/components/tools/ToolsIndex";

export const metadata: Metadata = {
  title: "Tools in Oxygen Not Included — Seed Archive",
  description: "Tools that read a Oxygen Not Included world from its seed.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsIndex />;
}
