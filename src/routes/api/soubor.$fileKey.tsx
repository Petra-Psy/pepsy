import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "site-images";

export const Route = createFileRoute("/api/soubor/$fileKey")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !publishableKey) {
          return new Response("Soubor se nepodařilo načíst.", { status: 500 });
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

        if (fileError || !fileRow?.storage_path) {
          return new Response("Soubor nebyl nalezen.", { status: 404 });
        }

        const { data: fileData, error: downloadError } = await supabase.storage
          .from(BUCKET)
          .download(fileRow.storage_path);

        if (downloadError || !fileData) {
          return new Response("Soubor se nepodařilo načíst.", { status: 404 });
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