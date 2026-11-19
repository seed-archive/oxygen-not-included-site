import type { Metadata } from "next";

import { Html, PageFrame } from "@/components/archive/PageFrame";
import { readPage } from "@/lib/content";
import { MENU } from "@/lib/menu";

const page = () => readPage("guides", "geysers");

export async function generateMetadata(): Promise<Metadata> {
  const { fact } = await page();
  return {
    title: "Geysers in Oxygen Not Included — Seed Archive",
    description: fact,
    alternates: { canonical: "/guides/geysers" },
  };
}

export default async function GeysersGuidePage() {
  const { title, html } = await page();
  return (
    <PageFrame section={MENU[1]} crumb="archive.geysersGuide" title={title}>
      <Html html={html} />
    </PageFrame>
  );
}
