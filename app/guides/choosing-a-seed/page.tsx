import type { Metadata } from "next";

import { Html, PageFrame } from "@/components/archive/PageFrame";
import { readPage } from "@/lib/content";
import { MENU } from "@/lib/menu";

const page = () => readPage("guides", "choosing-a-seed");

export async function generateMetadata(): Promise<Metadata> {
  const { fact } = await page();
  return {
    title: "Choosing a seed in Oxygen Not Included — Seed Archive",
    description: fact,
    alternates: { canonical: "/guides/choosing-a-seed" },
  };
}

export default async function ChoosingASeedPage() {
  const { title, html } = await page();
  return (
    <PageFrame section={MENU[1]} crumb="archive.choosingASeed" title={title}>
      <Html html={html} />
    </PageFrame>
  );
}
