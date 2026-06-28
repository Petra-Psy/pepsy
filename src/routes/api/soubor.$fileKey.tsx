import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "site-images";

function getPublicBackendConfig() {
  return {
    url: process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    key:
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

export const Route = createFileRoute("/api/soubor/$fileKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { url: supabaseUrl, key: publishableKey } = getPublicBackendConfig();

        if (!supabaseUrl || !publishableKey) {
          console.error("PDF route: missing public backend configuration");
          return new Response("Soubor se nepodařilo načíst: chybí konfigurace.", { status: 500 });
        }

        const supabase = createClient<Database>(supabaseUrl, publishableKey, {
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        });

        const { data: fileRow, error: fileError } = await supabase
          .from("site_files")
          .select("storage_path")
          .eq("key", params.fileKey)
          .maybeSingle();

        if (fileError) {
          console.error("PDF route: site_files lookup failed", fileError);
          return new Response("Soubor se nepodařilo načíst: záznam není dostupný.", { status: 500 });
        }

        if (!fileRow?.storage_path) {
          return new Response("Soubor nebyl nalezen.", { status: 404 });
        }

        const { data: fileData, error: downloadError } = await supabase.storage
          .from(BUCKET)
          .download(fileRow.storage_path);

        if (downloadError || !fileData) {
          console.error("PDF route: storage download failed", downloadError);
          return new Response("Soubor se nepodařilo načíst: PDF není dostupné.", { status: 404 });
        }

        const fileName = fileRow.storage_path.split("/").pop() || "terapeuticka-dohoda.pdf";

        return new Response(fileData, {
          headers: {
            "Content-Type": fileData.type || "application/pdf",
            "Content-Disposition": `inline; filename="${fileName.replace(/"/g, "")}"`,
            "Cache-Control": "private, max-age=300",
          },
        });
      },
    },
  },
});