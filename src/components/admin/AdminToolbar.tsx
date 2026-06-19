import { Link } from "@tanstack/react-router";
import { LogOut, Pencil, Eye, LogIn } from "lucide-react";
import { useAdmin } from "./AdminContext";

export function AdminToolbar() {
  const { isAdmin, editMode, setEditMode, signOut, isLoading } = useAdmin();

  if (isLoading) return null;

  if (!isAdmin) {
    return (
      <Link
        to="/auth"
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-muted/60 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors backdrop-blur"
        aria-label="Admin přihlášení"
      >
        <LogIn className="w-4 h-4" />
      </Link>
    );
  }

  return (
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
        onClick={signOut}
        className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        aria-label="Odhlásit"
        title="Odhlásit"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
