# Project notes

A few notes on the software I'm working on and contributing to. These projects are in development, and their source repositories are private.

[← Back to my profile](README.md)

## Associa

**Association operations, on the web and in the field.**

Associa combines a Next.js back office, a React Native Android app, and a Node.js worker. Shared API contracts connect the applications to a PostgreSQL database through Drizzle.

The work spans operational workflows, mobile field usage, offline protocols, and database acceptance tests.

**Stack:** TypeScript, Next.js, React Native, Node.js, PostgreSQL, Drizzle, pnpm, Turborepo.

## PeptAI

**A mobile application for tracking, inventory, and personal records.**

My product work here is collaborative. The app includes authentication, onboarding, protocol and inventory flows, and tracking interfaces. Zustand stores manage local state, while a Supabase service layer handles persistent data.

The parts I want to highlight are session handling, mobile UI, state management, and the connection between local state and backend records.

**Stack:** TypeScript, React Native, Expo, Expo Router, Zustand, TanStack Query, Supabase.

## Swarms

**An agent workspace with background and scheduled execution.**

Swarms connects a Next.js chat interface to agent configuration and a separate execution runtime. Trigger.dev handles background tasks and schedules. PostgreSQL stores run status, events, and checkpoints through Drizzle.

The implementation includes cancellation handling, ownership checks, and persisted progress, so runs can be followed beyond the initial request.

**Stack:** TypeScript, Next.js, Node.js, Trigger.dev, Drizzle, PostgreSQL/Neon, Clerk, OpenAI Codex.

## Zyllux

**A multilingual studio platform with an interactive project estimator.**

Zyllux combines English and French pages, motion, and a configurable estimator. The browser and server share typed calculation logic; versioned configuration and saved snapshots keep estimates reproducible.

The project also includes Cloudflare Workers form workflows. Production quote saving depends on the configured storage and hosting.

**Stack:** TypeScript, Next.js, next-intl, GSAP, Cloudflare Workers, D1.
