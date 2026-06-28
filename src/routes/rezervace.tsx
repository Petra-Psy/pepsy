import { createFileRoute } from "@tanstack/react-router";
import { Header, Reservation, Contact, Footer } from "@/components/site/SiteSections";

export const Route = createFileRoute("/rezervace")({
  head: () => ({
    meta: [
      { title: "Rezervace — Petra Svobodová, MSc." },
      { name: "description", content: "Objednejte se online na konzultaci. Vyberte si volný termín přímo zde." },
      { property: "og:title", content: "Rezervace — Petra Svobodová, MSc." },
      { property: "og:description", content: "Objednejte se online na konzultaci." },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Reservation />
      <Contact />
      <Footer />
    </div>
  );
}
