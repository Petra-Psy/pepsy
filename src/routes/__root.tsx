import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";

import appCss from "../styles.css?url";
import faviconAsset from "../assets/favicon.jpg.asset.json";
import ogImageAsset from "../assets/og-image.jpg.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AdminProvider } from "@/components/admin/AdminContext";
import { SiteContentProvider } from "@/components/admin/SiteContentContext";
import { FaqProvider } from "@/components/admin/FaqContext";
import { AboutEducationProvider } from "@/components/admin/AboutEducationContext";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { LanguageProvider } from "@/components/i18n/LanguageContext";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Stránka nenalezena</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Stránka, kterou hledáte, neexistuje nebo byla přesunuta.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Něco se nepovedlo</h1>
        <p className="mt-2 text-sm text-muted-foreground">Zkuste to znovu nebo se vraťte na úvod.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Zkusit znovu
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent"
          >
            Zpět na úvod
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { httpEquiv: "Content-Security-Policy", content: "upgrade-insecure-requests" },
      { title: "Petrapsy" },
      {
        name: "description",
        content:
          "Psychologické poradenství v Praze. Pomáhám lidem zvládat úzkosti, stres a krizové situace. Bezpečný prostor pro terapii a osobní rozvoj.",
      },
      { name: "author", content: "Petra Svobodová, MSc." },
      { property: "og:title", content: "Petrapsy" },
      {
        property: "og:description",
        content: "Pomáhám lidem zvládat úzkosti, stres a krizové situace. Praha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Petrapsy" },
      { name: "twitter:description", content: "Pomáhám lidem zvládat úzkosti, stres a krizové situace. Praha." },
      { property: "og:image", content: `https://pepsy.lovable.app${ogImageAsset.url}` },
      { name: "twitter:image", content: `https://pepsy.lovable.app${ogImageAsset.url}` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: faviconAsset.url },
      { rel: "apple-touch-icon", href: faviconAsset.url },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(typeof location!=='undefined'&&location.protocol==='http:'&&location.hostname!=='localhost'&&!/^127\\./.test(location.hostname)){location.replace('https:'+location.href.substring(location.protocol.length));}",
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminProvider>
          <SiteContentProvider>
            <FaqProvider>
              <AboutEducationProvider>
                <HtmlLangSync />
                <Outlet />
                <AdminToolbar />
                <Toaster position="top-center" />
              </AboutEducationProvider>
            </FaqProvider>
          </SiteContentProvider>
        </AdminProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

/** Keeps <html lang> in sync with the active locale on the client. */
function HtmlLangSync() {
  const { useLang } = require("@/components/i18n/LanguageContext") as typeof import("@/components/i18n/LanguageContext");
  const { lang } = useLang();
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return null;
}
