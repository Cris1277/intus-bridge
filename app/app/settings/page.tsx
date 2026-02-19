"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { exportUserData } from "@/lib/stubs";
import {
  User,
  Shield,
  Download,
  Trash2,
  Bell,
  Info,
  AlertTriangle,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const user = session?.user as
    | { id?: string; name?: string | null; email?: string | null }
    | undefined;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteOk, setDeleteOk] = useState<string | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileOk, setProfileOk] = useState<string | null>(null);

  // Preference toggles (UI only)
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [warmTone, setWarmTone] = useState(true);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.name, user?.email]);

  const profileDirty = useMemo(() => {
    const currentName = user?.name ?? "";
    const currentEmail = user?.email ?? "";
    return name !== currentName || email !== currentEmail;
  }, [name, email, user?.name, user?.email]);

  async function handleExport() {
    setExporting(true);
    try {
      await exportUserData();
    } finally {
      setExporting(false);
    }
    alert("Datos exportados correctamente (mock)");
  }

  async function handleDelete() {
    if (deleteConfirm !== "BORRAR") return;

    setDeleting(true);
    setDeleteError(null);
    setDeleteOk(null);

    try {
      const res = await fetch("/api/user/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirm: "BORRAR",
          wipeDataOnly: true, // no borra cuenta
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.error ??
          (res.status === 401 ? "No autorizado" : `HTTP ${res.status}`);
        throw new Error(msg);
      }

      // UI feedback
      setDeleteOk("Datos borrados correctamente ✅");
      setShowDeleteDialog(false);
      setDeleteConfirm("");

      // (Opcional) refresca cualquier UI que dependa de datos (listados, charts)
      // En nuestro, los listados cargan por fetch en cliente, así que al volver a esas pantallas ya verán vacío.
    } catch (e: any) {
      setDeleteError(e?.message ?? "No se pudieron borrar los datos");
    } finally {
      setDeleting(false);
      setTimeout(() => setDeleteOk(null), 2500);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileOk(null);

    try {
      const nextName = name.trim();
      const nextEmail = email.trim().toLowerCase();

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nextName,
          email: nextEmail,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.error ??
          (res.status === 409
            ? "Ese email ya está en uso"
            : res.status === 401
              ? "No autorizado"
              : `HTTP ${res.status}`);
        throw new Error(msg);
      }

      // IMPORTANT: update session so Topbar updates immediately
      await update({
        name: data?.name ?? "",
        email: data?.email ?? "",
      });

      setProfileOk("Perfil actualizado ✅");
    } catch (e: any) {
      setProfileError(e?.message ?? "No se pudo actualizar el perfil");
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileOk(null), 2500);
    }
  }

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-sm text-muted-foreground">Cargando ajustes…</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Necesitas iniciar sesión para ver los ajustes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          Ajustes
        </h1>
        <p className="mt-1 text-muted-foreground">
          Personaliza tu experiencia y controla tu información.
        </p>
      </div>

      {/* ✅ Feedback global (p.ej. tras purgar) */}
      {deleteError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {deleteError}
        </div>
      )}
      {deleteOk && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {deleteOk}
        </div>
      )}

      {/* Profile */}
      <section className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">Perfil</h2>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tu nombre"
              maxLength={100}
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-3">
            {profileError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {profileError}
              </div>
            )}

            {profileOk && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {profileOk}
              </div>
            )}

            <button
              type="submit"
              disabled={!profileDirty || savingProfile}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              {savingProfile ? "Guardando..." : "Guardar cambios"}
            </button>

            <p className="text-xs text-muted-foreground">
              El email debe ser único. El nombre es opcional.
            </p>
          </div>
        </form>
      </section>

      {/* Privacy */}
      <section className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Privacidad
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Exportar mis datos
              </p>
              <p className="text-xs text-muted-foreground">
                Descarga toda tu información en un archivo
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exportando..." : "Exportar"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">
                Borrar todos mis datos
              </p>
              <p className="text-xs text-muted-foreground">
                Esta acción no se puede deshacer
              </p>
            </div>
            <button
              onClick={() => {
                setDeleteError(null);
                setDeleteOk(null);
                setShowDeleteDialog(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" />
              Borrar
            </button>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Preferencias
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              label: "Tono cálido",
              desc: "Mensajes con tono protector y cercano",
              value: warmTone,
              set: setWarmTone,
            },
            {
              label: "Recordatorios",
              desc: "Check-in diario y sugerencias",
              value: reminders,
              set: setReminders,
            },
            {
              label: "Notificaciones",
              desc: "Alertas y mensajes del sistema",
              value: notifications,
              set: setNotifications,
            },
          ].map((pref) => (
            <label
              key={pref.label}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {pref.label}
                </p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => pref.set(!pref.value)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  pref.value ? "bg-primary" : "bg-muted"
                }`}
                role="switch"
                aria-checked={pref.value}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                    pref.value ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mb-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Acerca de
          </h2>
        </div>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">IntusBridge</span>{" "}
            v0.1.0
          </p>
          <p>Apoyo emocional ante estrés, ansiedad y bullying.</p>
          <p>No es terapia. No diagnóstica. No sustituye a profesionales.</p>
        </div>
      </section>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-card-foreground">
                Borrar todos los datos
              </h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta acción eliminará permanentemente todas tus entradas de
              diario, check-ins y conversaciones. No se puede deshacer.
            </p>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {'Escribe "BORRAR" para confirmar'}
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirm("");
                }}
                disabled={deleting}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "BORRAR" || deleting}
                className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-bold text-destructive-foreground hover:opacity-90 disabled:opacity-40"
              >
                {deleting ? "Borrando..." : "Borrar todo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
