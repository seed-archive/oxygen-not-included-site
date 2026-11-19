import type { MetadataRoute } from "next";

import { MENU } from "@/lib/menu";
import { BASE_PATH } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:5030${BASE_PATH}`;
  const paths = [
    "",
    ...MENU.flatMap((m) => [m.href, ...m.pages.map((p) => p.href)]),
  ];
  return paths.map((path) => ({ url: `${base}${path}` }));
}
