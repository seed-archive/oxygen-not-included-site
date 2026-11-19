import { readFile } from "node:fs/promises";
import path from "node:path";

import { marked } from "marked";

import { TEXT_VALUES } from "@/lib/oni/constants";
import { BASE_PATH } from "@/lib/site";

// Long text lives in content/<locale>/<section>/<name>.md (site-code.md: long
// texts in Markdown), in the other games' way. The first line is the page's
// h1 (`# Title`), the next its bold question with the answer.

export type Page = { title: string; html: string; fact: string };

// The archive's own pages, served by the portal at the domain's root: a link
// to one keeps its path as written.
const ARCHIVE_PAGES = ["privacy", "terms", "release-notes", "credits"];

// A path of this site written into the HTML gets the section's prefix, since
// Next.js prefixes only its own links.
const withBase = (html: string) =>
  html.replace(
    new RegExp(
      `(href|src)="\\/(?!\\/|(?:${ARCHIVE_PAGES.join("|")})(?:["#?]))`,
      "g",
    ),
    `$1="${BASE_PATH}/`,
  );

// A section heading gets an id from its words, so a page can link to it.
function anchorHeadings(html: string) {
  return html.replace(
    /<h([2-4])>(.*?)<\/h\1>/g,
    (_, level: string, inner: string) => {
      const id = inner
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );
}

// A page: its title (the h1), its body as HTML, and its fact, the meta
// description (the lead after the bold question, without the markup).
export async function readPage(
  section: string,
  slug: string,
  locale = "en",
): Promise<Page> {
  const file = path.join(
    process.cwd(),
    "content",
    locale,
    section,
    `${slug}.md`,
  );
  // A number of the text is `{{name}}`, filled from the game's values, so no
  // number is typed; a name with no value stays visible, to be caught in review.
  const text = (await readFile(file, "utf8")).replace(
    /\{\{(\w+)\}\}/g,
    (hole, name: string) => TEXT_VALUES[name] ?? hole,
  );
  const [first, ...rest] = text.split("\n");
  const body = rest.join("\n");
  const lead = body.trim().split("\n")[0] ?? "";
  const fact = lead
    .replace(/\*\*[^*]*\*\*/, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim();
  return {
    title: first.replace(/^#\s*/, ""),
    html: withBase(anchorHeadings(await marked.parse(body))),
    fact,
  };
}
