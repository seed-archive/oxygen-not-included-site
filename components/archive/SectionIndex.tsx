import Link from "next/link";
import Typography from "@mui/material/Typography";

import { PageFrame } from "@/components/archive/PageFrame";
import { serverFormat } from "@/lib/i18n/server";
import type { MenuItem } from "@/lib/menu";

// A menu item's index: every page of the section, each in one sentence with
// the page's name as its link.
export function SectionIndex(props: { item: MenuItem }) {
  return (
    <PageFrame section={props.item} title={serverFormat(props.item.id)}>
      {props.item.pages.map((p) => {
        const [before, after] = serverFormat(p.line).split("{link}");
        return (
          <Typography key={p.href} gutterBottom>
            {before}
            <Link href={p.href}>{serverFormat(p.id)}</Link>
            {after}
          </Typography>
        );
      })}
    </PageFrame>
  );
}
