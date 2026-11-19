// The header's menu (D15: at most Catalog, Guides, Tools, Quests, named the
// same in every game): each item its index page and the pages in its
// dropdown, with the sentence its index gives each page. The sitemap and the
// index pages read it too.
export type MenuPage = { href: string; id: string; line: string };
export type MenuItem = { id: string; href: string; pages: MenuPage[] };

export const MENU: MenuItem[] = [
  {
    id: "archive.catalog",
    href: "/catalog",
    pages: [
      {
        href: "/catalog/geysers",
        id: "archive.geysers",
        line: "pages.catalog.geysers",
      },
    ],
  },
  {
    id: "archive.guides",
    href: "/guides",
    pages: [
      {
        href: "/guides/first-cycles",
        id: "archive.firstCycles",
        line: "pages.guides.firstCycles",
      },
      {
        href: "/guides/geysers",
        id: "archive.geysersGuide",
        line: "pages.guides.geysers",
      },
      {
        href: "/guides/choosing-a-seed",
        id: "archive.choosingASeed",
        line: "pages.guides.choosingASeed",
      },
    ],
  },
  {
    id: "archive.tools",
    href: "/tools",
    pages: [{ href: "/tools/map", id: "archive.map", line: "pages.tools.map" }],
  },
  {
    id: "archive.quests",
    href: "/quests",
    pages: [
      {
        href: "/quests/story-traits",
        id: "archive.storyTraits",
        line: "pages.quests.storyTraits",
      },
    ],
  },
];
