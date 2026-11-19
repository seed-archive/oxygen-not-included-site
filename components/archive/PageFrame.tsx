import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { PageTrail } from "@seed-archive/ui/page-trail";

import { ArchiveBar } from "@/components/archive/ArchiveBar";
import { ArchiveFooter } from "@/components/archive/ArchiveFooter";
import { serverFormat } from "@/lib/i18n/server";

// A page of a menu section: the header, Home › section › page, the h1, the
// body, the footer. The body's look follows the theme: h2 as section headings,
// links in the theme's colour, tables framed.
export function PageFrame(props: {
  section: { id: string; href: string };
  crumb?: string;
  title: string;
  children: ReactNode;
}) {
  const steps = [
    { name: serverFormat("archive.home"), href: "/" },
    props.crumb
      ? { name: serverFormat(props.section.id), href: props.section.href }
      : { name: serverFormat(props.section.id) },
    ...(props.crumb ? [{ name: serverFormat(props.crumb) }] : []),
  ];
  return (
    <>
      <ArchiveBar />
      <Container
        component="main"
        maxWidth="md"
        sx={{ py: 6, minHeight: "70vh" }}
      >
        <PageTrail steps={steps} />
        <Typography variant="h3" component="h1" gutterBottom>
          {props.title}
        </Typography>
        <Box
          sx={{
            typography: "body1",
            "& h2": { typography: "h5", mt: 5, mb: 1 },
            "& p, & ul, & ol": { mb: 2, mt: 0 },
            "& li": { mb: 0.5 },
            "& a": { color: "primary.main" },
            "& table": { borderCollapse: "collapse", width: "100%", mb: 2 },
            "& th, & td": {
              borderBottom: 1,
              borderColor: "divider",
              textAlign: "left",
              py: 0.75,
              pr: 2,
              verticalAlign: "top",
            },
          }}
        >
          {props.children}
        </Box>
      </Container>
      <ArchiveFooter />
    </>
  );
}

// A Markdown page's body.
export function Html(props: { html: string }) {
  return <Box dangerouslySetInnerHTML={{ __html: props.html }} />;
}
