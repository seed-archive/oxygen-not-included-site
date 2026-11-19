import type { MetadataRoute } from "next";

import { BASE_PATH } from "@/lib/site";

// Served at /oxygen-not-included/robots.txt; the domain's own /robots.txt is the portal's.
export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:5030${BASE_PATH}`;

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
