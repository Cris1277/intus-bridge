"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  BookOpen,
  Heart,
  Wind,
  Shield,
  MessageCircle,
  LifeBuoy,
  Settings,
  Menu,
  X,
  Phone,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/app", label: "Inicio", icon: Home },
  { href: "/app/check-in", label: "Check-in", icon: ClipboardCheck },
  { href: "/app/journal", label: "Diario", icon: BookOpen },
  { href: "/app/tools", label: "Herramientas", icon: Wind },
  { href: "/app/scenarios", label: "Guías", icon: Shield },
  { href: "/app/chat", label: "Chat", icon: MessageCircle },
  { href: "/app/resources", label: "Recursos", icon: LifeBuoy },
  { href: "/app/settings", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, status } = useSession();
  const userName =
    session?.user?.name?.trim() || session?.user?.email?.trim() || "—";

  function handleLogout() {
    setSidebarOpen(false);
    // Cierra sesión real (NextAuth) y vuelve al inicio
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link href="/app" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-sidebar-foreground font-serif">
              IntusBridge
            </span>
          </Link>
          <button
            className="lg:hidden text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menu"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/app" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout + Emergency */}
        <div className="border-t border-sidebar-border p-3 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            Cerrar sesión
          </button>

          <a
            href="tel:112"
            className="flex items-center gap-2 rounded-lg bg-emergency px-3 py-2.5 text-sm font-bold text-emergency-foreground transition-colors hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            Ayuda urgente: 112 / 024
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Hola,{" "}
              <span className="font-semibold text-foreground">
                {status === "loading" ? "…" : userName}
              </span>
            </p>
          </div>

          <a
            href="tel:112"
            className="flex items-center gap-1.5 rounded-lg bg-emergency px-3 py-1.5 text-xs font-bold text-emergency-foreground transition-colors hover:opacity-90 lg:hidden"
          >
            <Phone className="h-3.5 w-3.5" />
            Ayuda
          </a>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
