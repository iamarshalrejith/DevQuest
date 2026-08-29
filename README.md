# DevQuest

DevQuest is a platform for discovering and booking developer events — hackathons, meetups, and tech conferences. Organizers can create events; attendees can browse them and register with just an email.

## Features

- **Browse events** — landing page listing upcoming events with details (venue, date/time, mode, audience, agenda, tags)
- **Create events** — form-based event creation with slug auto-generation, date/time normalization, and validation
- **Book events** — one-click registration by email, with duplicate-booking protection (one booking per email per event)
- **Event detail pages** — dynamic per-event pages at `/events/[slug]`
- **Analytics** — PostHog integration for usage tracking

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, base-ui
- **Database:** MongoDB via Mongoose
- **Analytics:** PostHog
- **Linting:** ESLint 9

## Project Structure

```
DevQuest-main/
├── app/
│   ├── api/
│   │   ├── events/route.ts      # GET (list) / POST (create) events
│   │   └── bookings/route.ts    # GET (count) / POST (register) bookings
│   ├── events/[slug]/page.tsx   # Event detail page
│   ├── create-event/page.tsx    # Event creation form
│   ├── page.tsx                 # Landing page
│   └── layout.tsx
├── components/                  # UI components (Navbar, EventCard, BookEventForm, etc.)
├── database/
│   ├── event.model.ts           # Event Mongoose schema
│   ├── booking.model.ts         # Booking Mongoose schema
│   └── index.ts
├── lib/
│   ├── mongodb.ts               # DB connection helper (cached across hot reloads)
│   ├── constants.ts
│   └── utils.ts
└── public/                      # Static assets
```

## Data Models

**Event** — `title`, `slug` (auto-generated, unique), `description`, `overview`, `image`, `venue`, `location`, `date`, `time`, `mode` (`online` | `offline` | `hybrid`), `audience`, `agenda[]`, `organizer`, `tags[]`.

**Booking** — `eventId` (ref → Event), `email`. A compound unique index on `(eventId, email)` prevents duplicate registrations.

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
```

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other Scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## API Reference

### `GET /api/events`
Returns all events, sorted by date ascending.

### `POST /api/events`
Creates a new event. Required fields: `title`, `description`, `overview`, `image`, `venue`, `location`, `date`, `time`, `mode`, `audience`, `organizer`, `agenda[]`, `tags[]`.

### `GET /api/bookings?eventSlug=<slug>`
Returns the booking count for the given event.

### `POST /api/bookings`
Registers an email for an event. Body: `{ email, eventSlug }`. Returns `409` if already registered or event not found.

## Deployment

Deploy easily on [Vercel](https://vercel.com/new), the platform from the creators of Next.js. Make sure to set the environment variables above in your deployment settings.

## License

Not specified.
