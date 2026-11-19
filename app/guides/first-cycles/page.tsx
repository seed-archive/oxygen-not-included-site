import type { Metadata } from "next";

import { Html, PageFrame } from "@/components/archive/PageFrame";
import { readPage } from "@/lib/content";
import { MENU } from "@/lib/menu";

const page = () => readPage("guides", "first-cycles");

export async function generateMetadata(): Promise<Metadata> {
  const { fact } = await page();
  return {
    title: "First cycles in Oxygen Not Included — Seed Archive",
    description: fact,
    alternates: { canonical: "/guides/first-cycles" },
  };
}

export default async function FirstCyclesPage() {
  const { title, html } = await page();
  return (
    <PageFrame section={MENU[1]} crumb="archive.firstCycles" title={title}>
      <Html html={html} />
    </PageFrame>
  );
}
