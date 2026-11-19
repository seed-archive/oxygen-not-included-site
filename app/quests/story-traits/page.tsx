import type { Metadata } from "next";

import { Html, PageFrame } from "@/components/archive/PageFrame";
import { readPage } from "@/lib/content";
import { MENU } from "@/lib/menu";

const page = () => readPage("quests", "story-traits");

export async function generateMetadata(): Promise<Metadata> {
  const { fact } = await page();
  return {
    title: "Story traits in Oxygen Not Included — Seed Archive",
    description: fact,
    alternates: { canonical: "/quests/story-traits" },
  };
}

export default async function StoryTraitsPage() {
  const { title, html } = await page();
  return (
    <PageFrame section={MENU[3]} crumb="archive.storyTraits" title={title}>
      <Html html={html} />
    </PageFrame>
  );
}
