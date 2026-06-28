import { createFileRoute } from "@tanstack/react-router";
import { Onepager } from "./index";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title: "Petra Svobodová, MSc. — Psychological counselling Prague" },
      {
        name: "description",
        content: "Psychological counselling in Prague. I help adults navigate anxiety, stress, burnout and relationship difficulties.",
      },
      { property: "og:title", content: "Petra Svobodová, MSc. — Psychological counselling Prague" },
      { property: "og:description", content: "Psychological counselling in Prague." },
      { property: "og:url", content: "https://pepsy.lovable.app/en" },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: "https://pepsy.lovable.app/en" },
      { rel: "alternate", hrefLang: "cs", href: "https://pepsy.lovable.app/" },
      { rel: "alternate", hrefLang: "en", href: "https://pepsy.lovable.app/en" },
      { rel: "alternate", hrefLang: "x-default", href: "https://pepsy.lovable.app/" },
    ],
  }),
  component: () => <Onepager />,
});
