import { useEffect, useState } from "react";
import { LogOut, Pencil, Eye, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "./AdminContext";
import { useSiteContent } from "./SiteContentContext";

export function AdminToolbar() {
  const { isAdmin, editMode, setEditMode, signOut, isLoading, session } = useAdmin();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Skrytý spouštěč: Ctrl+Shift+L (žádný viditelný odkaz, žádná /auth routa)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault();
        if (!session) setLoginOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [session]);

  if (isLoading) return null;

  return (
    <>
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border shadow-lg">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              editMode ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            {editMode ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {editMode ? "Edituji" : "Edit mód"}
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Nastavení"
            title="Nastavení"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={signOut}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Odhlásit"
            title="Odhlásit"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
      {loginOpen && !session && (
        <LoginModal onClose={() => setLoginOpen(false)} />
      )}
      {settingsOpen && isAdmin && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Přihlášení selhalo");
      return;
    }
    toast.success("Přihlášeno");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Zavřít"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-semibold">Přihlášení</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            autoFocus
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-60 text-sm"
          >
            {loading ? "Pracuji…" : "Přihlásit se"}
          </button>
        </form>
      </div>
    </div>
  );
}
