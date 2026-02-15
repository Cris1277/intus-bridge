import Link from "next/link";
import {
  Heart,
  BookOpen,
  ClipboardCheck,
  Wind,
  Shield,
  ArrowRight,
  Phone,
} from "lucide-react";
import { SafetyBanner } from "@/components/safety-banner";

const features = [
  {
    icon: BookOpen,
    title: "Diario seguro",
    description:
      "Escribe lo que sientes en un espacio privado. Sin juicios, sin presiones. Tu historia, a tu ritmo.",
  },
  {
    icon: ClipboardCheck,
    title: "Check-in diario",
    description:
      "Registra como estás cada día. Pequeños pasos para entender tus patrones y ganar claridad.",
  },
  {
    icon: Wind,
    title: "Herramientas de calma",
    description:
      "Respiración, grounding, reencuadre y diálogo compasivo. Técnicas que puedes usar en cualquier momento.",
  },
  {
    icon: Shield,
    title: "Guías para bullying",
    description:
      "Pasos concretos para protegerte y buscar apoyo ante acoso escolar o laboral. No estás solo/a.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold font-serif text-foreground">
              IntusBridge
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/40" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center md:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="h-4 w-4" />
            Un espacio seguro para ti
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground font-serif md:text-5xl lg:text-6xl">
            Un espacio seguro para momentos difíciles
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Procesa lo que sientes, gana claridad y practica herramientas de
            calma. No estás solo/a. Vamos paso a paso.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Iniciar sesión
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Por defecto, minimizamos lo que guardamos. Tu controlas tu
            información.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground font-serif">
            Herramientas que te acompañan
          </h2>
          <p className="mt-3 text-muted-foreground">
            Todo lo que necesitas para cuidar tu bienestar emocional, en un solo
            lugar.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Promise section */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <blockquote className="text-2xl font-medium text-foreground font-serif leading-relaxed md:text-3xl">
            {'"'}Un espacio seguro para procesar momentos difíciles, ganar
            claridad y practicar herramientas de calma.{'"'}
          </blockquote>
          <p className="mt-6 text-muted-foreground">
            No estámos solos. Vamos paso a paso.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-6xl px-4">
          <SafetyBanner variant="compact" />
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              <span>IntusBridge</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="tel:112"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                112
              </a>
              <a
                href="tel:024"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                024
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            IntusBridge no es terapia, no diagnóstica y no sustituye a
            profesionales de la salud mental.
          </p>
        </div>
      </footer>
    </div>
  );
}
