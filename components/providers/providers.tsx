"use client";

import { PropsWithChildren } from "react";
import { Providers as ArchiveProviders } from "@seed-archive/ui/providers";

import { getBrowserSupabase } from "@/lib/db/supabase.browser";
import { EnabledLanguages, i18n } from "@/lib/i18n";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ArchiveProviders
      i18n={i18n}
      defaultLanguage={EnabledLanguages.EN}
      getSupabase={getBrowserSupabase}
      googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    >
      {children}
    </ArchiveProviders>
  );
};
