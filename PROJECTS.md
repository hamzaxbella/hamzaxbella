# Selected engineering work

I'm Hamza Bella, a software engineer working across web, mobile, data, and agent workflows. This page introduces four projects I'm working on and contributing to. The source repositories are private. These are implementation summaries, not claims that every feature is publicly launched or production complete.

[← Back to the profile](README.md)

## Associa

<img src="assets/associa.svg" width="700" alt="Associa engineering illustration" />

**Association operations across a web back office and an Android field app.**

The repository brings together a Next.js web application, a React Native mobile application, a Node.js background worker, and shared packages. PostgreSQL and Drizzle support the data layer. API request/response contracts are separated from database internals so the web and mobile applications can work against an explicit boundary.

The interesting engineering work sits between those parts: operational workflows, shared contracts, field usage, and the background work that connects the product. The codebase includes database acceptance tests and documentation for offline protocols. Development is ongoing.

**Stack:** TypeScript, Next.js, React Native, Node.js, PostgreSQL, Drizzle, pnpm, Turborepo.

## PeptAI

<img src="assets/peptai.svg" width="700" alt="PeptAI engineering illustration" />

**Mobile product engineering for tracking and personal records.**

An Expo and React Native application with authentication, onboarding, protocol and inventory flows, and personal tracking interfaces. The application uses Zustand stores and a Supabase data-service layer to connect local UI state to persistent records.

The engineering focus includes session handling, predictable state transitions, reusable mobile interfaces, and keeping data operations separate from presentation. This is collaborative product work; this overview does not imply sole authorship or make medical efficacy claims.

**Stack:** TypeScript, React Native, Expo, Expo Router, Zustand, TanStack Query, Supabase.

## Swarms

<img src="assets/swarms.svg" width="700" alt="Swarms engineering illustration" />

**An agent workspace with execution beyond a single chat response.**

A Next.js application connects chats and agent configuration to background execution. Trigger.dev tasks dispatch agent runs and scheduled work, while a separate runtime executes the requests. Run status, events, and checkpoints are persisted through Drizzle and PostgreSQL.

The implementation includes cancellation handling, ownership checks, and scheduled dispatch. The engineering focus is coordinating UI state, job state, and a long-running execution process, with enough persisted progress to follow what happened.

**Stack:** TypeScript, Next.js, Node.js, Trigger.dev, Drizzle, PostgreSQL/Neon, Clerk, OpenAI Codex.

## Zyllux

<img src="assets/zyllux.svg" width="700" alt="Zyllux engineering illustration" />

**A studio platform where visual craft meets application logic.**

A Next.js platform with English and French content, purposeful motion, and an adaptive project estimator. Typed estimator state and shared calculation logic connect the browser experience to server-side validation. Versioned configuration and saved snapshots support reproducible estimates.

Form workflows also have a Cloudflare Workers implementation. The engineering interest is maintaining clear boundaries between presentation, content, calculation, and persistence. Production saving depends on the configured hosting and storage; this overview does not imply that every deployment dependency is provisioned.

**Stack:** TypeScript, Next.js, next-intl, GSAP, Cloudflare Workers, D1.

---

The illustrations are original conceptual diagrams, not screenshots of private applications. Public experiments and earlier learning projects remain available under [Repositories](https://github.com/hamzaxbella?tab=repositories).
