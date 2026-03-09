<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevQuest Next.js App Router application. The following changes were made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side using the `instrumentation-client` pattern for Next.js 15.3+, with EU cloud host, reverse proxy ingestion, exception capture, and debug mode in development.
- **`next.config.ts`** (updated) — Added reverse proxy rewrites routing `/ingest/*` to the PostHog EU ingestion endpoint, and `skipTrailingSlashRedirect: true` to support PostHog's API format.
- **`.env.local`** (new) — Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. Covered by `.gitignore`.
- **`components/ExploreBtn.tsx`** (updated) — Added `posthog.capture('explore_events_clicked')` inside the existing `onClick` handler.
- **`components/EventCard.tsx`** (updated) — Added `"use client"` directive and `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` on the Link click.

## Events

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the home page | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to navigate to the event detail page | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/137980/dashboard/558570
  - **CTA & Event Card Clicks (Daily)**: https://eu.posthog.com/project/137980/insights/79b6RwGB
  - **CTA to Event Card Conversion Funnel**: https://eu.posthog.com/project/137980/insights/5Ll0iD2G
  - **Most Clicked Events (by Title)**: https://eu.posthog.com/project/137980/insights/LK5O0B2o

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
