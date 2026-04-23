"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="container px-4 py-24 md:px-6 md:py-32 lg:py-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
            <Sparkles className="size-4 text-primary" />
            <span>AI-Powered Development</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Code faster with
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              AI assistance
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            flux_code is a next-generation AI code editor that understands your
            codebase, suggests intelligent completions, and helps you write
            better code in less time.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            {session?.user ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/auth/sign-in">
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Zap className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Instant AI completions as you type
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Context Aware</h3>
              <p className="text-sm text-muted-foreground">
                Understands your entire codebase
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="size-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure by Default</h3>
              <p className="text-sm text-muted-foreground">
                Your code stays private and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
