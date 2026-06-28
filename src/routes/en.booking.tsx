import { createFileRoute } from "@tanstack/react-router";
import { Header, Reservation, Contact, Footer } from "@/components/site/SiteSections";

export const Route = createFileRoute("/en/booking")({
  head: () => ({
    meta: [
      { title: "Booking — Petra Svobodová, MSc." },
      { name: "description", content: "Book a counselling session online. Pick an available slot below." },
      { property: "og:title", content: "Booking — Petra Svobodová, MSc." },
      { property: "og:description", content: "Book a counselling session online." },
      { property: "og:url", content: "https://pepsy.lovable.app/en/booking" },
      { property: "og:locale", content: "en_GB" },
    ],
    links: [
      { rel: "canonical", href: "https://pepsy.lovable.app/en/booking" },
      { rel: "alternate", hrefLang: "cs", href: "https://pepsy.lovable.app/rezervace" },
      { rel: "alternate", hrefLang: "en", href: "https://pepsy.lovable.app/en/booking" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Reservation />
      <Contact />
      <Footer />
    </div>
  );
}
