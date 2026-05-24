import Image from "next/image";
import { notFound } from "next/navigation";
import { events } from "@/lib/constants";
import BookEventForm from "@/components/BookEventForm";

interface Props {
  params: Promise<{ slug: string }>;
}

// Extended event data keyed by slug — enriches the base constants with full detail-page fields
const eventDetails: Record<
  string,
  {
    description: string;
    overview: string;
    venue: string;
    mode: "online" | "offline" | "hybrid";
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    image: string;
  }
> = {
  "react-conf-2024": {
    description:
      "React Conf 2024 is the official React conference where the core team and community share the latest updates, best practices, and the future of React.",
    overview:
      "Join thousands of React developers for two days of talks, workshops, and networking in San Francisco.",
    venue: "Moscone Center, San Francisco",
    mode: "offline",
    audience: "React developers, frontend engineers, UI/UX designers",
    agenda: [
      "9:00 AM – Keynote: The State of React in 2024",
      "10:30 AM – Deep Dive: React Server Components",
      "12:00 PM – Lunch & Networking",
      "1:30 PM – Workshop: React 19 New Hooks",
      "3:00 PM – Panel: The Future of Rendering",
      "5:00 PM – Community Mixer",
    ],
    organizer: "Meta Open Source",
    tags: ["React", "Frontend", "JavaScript", "UI"],
    image: "/images/event1.png",
  },
  "nextjs-summit": {
    description:
      "The Next.js Summit brings together builders using Next.js to explore the latest features, App Router patterns, and production deployment strategies.",
    overview:
      "A full day of Next.js content ranging from beginner-friendly sessions to advanced architecture talks.",
    venue: "Austin Convention Center, Austin TX",
    mode: "hybrid",
    audience: "Full-stack developers, Next.js users, startup founders",
    agenda: [
      "10:00 AM – Welcome & Vercel Announcements",
      "11:00 AM – App Router Deep Dive",
      "12:30 PM – Lunch Break",
      "1:30 PM – Scaling Next.js at Enterprise",
      "3:00 PM – Live Coding: Edge Functions",
      "5:00 PM – Closing Q&A",
    ],
    organizer: "Vercel",
    tags: ["Next.js", "React", "Vercel", "Full-Stack"],
    image: "/images/event2.png",
  },
  "javascript-world": {
    description:
      "JavaScript World Conference is one of the largest annual JS gatherings, covering everything from vanilla JS to modern frameworks and tooling.",
    overview:
      "Three stages, 40+ talks, and hundreds of developers exploring the JavaScript ecosystem.",
    venue: "Javits Center, New York NY",
    mode: "offline",
    audience: "JavaScript developers of all levels",
    agenda: [
      "8:30 AM – Registration & Coffee",
      "9:30 AM – Keynote: JS in 2024 and Beyond",
      "11:00 AM – TypeScript Best Practices",
      "12:30 PM – Lunch",
      "2:00 PM – Tooling & Bundlers Roundtable",
      "4:00 PM – Lightning Talks",
      "7:00 PM – Evening Networking Party",
    ],
    organizer: "JSWorld Foundation",
    tags: ["JavaScript", "TypeScript", "Tooling", "Open Source"],
    image: "/images/event3.png",
  },
  "ai-hackathon-2024": {
    description:
      "A 48-hour hackathon challenging developers to build AI-powered applications that solve real-world problems.",
    overview:
      "Teams of 2–4 compete for $50,000 in prizes by shipping innovative AI products powered by the latest APIs.",
    venue: "Amazon HQ, Seattle WA",
    mode: "offline",
    audience: "Developers, data scientists, product designers",
    agenda: [
      "Friday 6:00 PM – Opening Ceremony & Team Formation",
      "Friday 8:00 PM – Hacking Begins",
      "Saturday 12:00 PM – Mentor Office Hours",
      "Saturday 6:00 PM – Mid-point Check-in",
      "Sunday 6:00 PM – Submissions Close",
      "Sunday 7:00 PM – Demo Day & Awards",
    ],
    organizer: "AWS Startups",
    tags: ["AI", "Hackathon", "Machine Learning", "LLMs"],
    image: "/images/event4.png",
  },
  "web3-developer-meetup": {
    description:
      "A casual but highly technical meetup for Web3 developers to share projects, discuss protocols, and connect with the decentralised community.",
    overview:
      "Three hours of lightning talks and open discussions on smart contracts, DeFi, and the decentralised web.",
    venue: "Wynwood Art District, Miami FL",
    mode: "offline",
    audience: "Blockchain developers, DeFi builders, NFT creators",
    agenda: [
      "6:00 PM – Doors Open & Drinks",
      "6:30 PM – Lightning Talk: Solidity Tips & Tricks",
      "7:00 PM – Demo: Cross-Chain Bridges",
      "7:30 PM – Open Discussion: Web3 UX",
      "8:30 PM – Networking",
    ],
    organizer: "Web3 Miami Community",
    tags: ["Web3", "Blockchain", "Solidity", "DeFi"],
    image: "/images/event5.png",
  },
  "fullstack-conference": {
    description:
      "Full Stack Conference covers the entire development lifecycle — from database design to deployment — with hands-on workshops and expert speakers.",
    overview:
      "A day-long deep dive into modern full-stack development practices for professional engineers.",
    venue: "Colorado Convention Center, Denver CO",
    mode: "offline",
    audience: "Full-stack developers, backend engineers, DevOps professionals",
    agenda: [
      "9:00 AM – Keynote: Modern Full-Stack Architecture",
      "10:30 AM – Workshop: tRPC + Next.js",
      "12:00 PM – Lunch",
      "1:30 PM – Database Design for Scale",
      "3:00 PM – CI/CD in Practice",
      "5:00 PM – Happy Hour",
    ],
    organizer: "FullStack Denver",
    tags: ["Full-Stack", "Backend", "DevOps", "Databases"],
    image: "/images/event6.png",
  },
  "devops-unleashed": {
    description:
      "DevOps Unleashed is a practitioner-led conference focused on continuous delivery, infrastructure as code, and platform engineering.",
    overview:
      "Hands-on labs and expert talks designed to help teams ship faster and more reliably.",
    venue: "McCormick Place, Chicago IL",
    mode: "hybrid",
    audience: "DevOps engineers, SREs, platform teams",
    agenda: [
      "8:00 AM – Registration",
      "9:00 AM – Keynote: Platform Engineering in 2024",
      "10:30 AM – Workshop: Kubernetes Best Practices",
      "12:00 PM – Lunch",
      "1:30 PM – GitOps with ArgoCD",
      "3:00 PM – Observability at Scale",
      "5:30 PM – Closing Remarks",
    ],
    organizer: "Chicago DevOps Guild",
    tags: ["DevOps", "Kubernetes", "CI/CD", "SRE"],
    image: "/images/event1.png",
  },
  "mobile-dev-summit": {
    description:
      "Mobile Development Summit brings together iOS, Android, and cross-platform developers to share the latest techniques and tools.",
    overview:
      "A comprehensive day covering native and cross-platform mobile development for modern engineers.",
    venue: "LA Convention Center, Los Angeles CA",
    mode: "offline",
    audience: "Mobile developers, iOS/Android engineers, UX designers",
    agenda: [
      "9:30 AM – Welcome & Keynote",
      "10:30 AM – SwiftUI in Production",
      "12:00 PM – Lunch",
      "1:30 PM – React Native vs Flutter Debate",
      "3:00 PM – Cross-Platform Performance Tips",
      "5:00 PM – Networking",
    ],
    organizer: "Mobile Dev LA",
    tags: ["iOS", "Android", "React Native", "Flutter"],
    image: "/images/event2.png",
  },
  "cybersecurity-conference": {
    description:
      "A technical security conference covering offensive and defensive security, threat intelligence, and secure software development practices.",
    overview:
      "One of the East Coast's premier security events, bringing together researchers, practitioners, and hackers.",
    venue: "Hynes Convention Center, Boston MA",
    mode: "offline",
    audience: "Security researchers, developers, IT professionals",
    agenda: [
      "8:00 AM – Registration",
      "9:00 AM – Keynote: The Threat Landscape 2024",
      "10:30 AM – Secure Coding Practices",
      "12:00 PM – Lunch",
      "1:30 PM – Red Team vs Blue Team Live Exercise",
      "3:30 PM – Zero-Day Disclosure Panel",
      "7:00 PM – CTF Awards Ceremony",
    ],
    organizer: "Boston InfoSec Group",
    tags: ["Security", "Cybersecurity", "Hacking", "DevSecOps"],
    image: "/images/event3.png",
  },
  "data-science-hackathon": {
    description:
      "A 72-hour data science hackathon where teams tackle real datasets from industry partners to surface meaningful insights and build predictive models.",
    overview:
      "Compete, collaborate, and learn alongside the best data scientists on the West Coast.",
    venue: "UC San Diego Campus, San Diego CA",
    mode: "offline",
    audience: "Data scientists, ML engineers, statisticians",
    agenda: [
      "Saturday 9:00 AM – Opening & Dataset Release",
      "Saturday 10:00 AM – Hacking Begins",
      "Sunday 12:00 PM – Mentor Check-ins",
      "Monday 9:00 AM – Submissions Due",
      "Monday 10:00 AM – Finalist Presentations",
      "Monday 12:00 PM – Awards Ceremony",
    ],
    organizer: "UCSD Data Science Club",
    tags: ["Data Science", "Machine Learning", "Python", "Hackathon"],
    image: "/images/event4.png",
  },
  "cloud-native-meetup": {
    description:
      "A monthly Cloud Native Computing Foundation (CNCF) community meetup covering cloud-native tools, patterns, and real-world deployments.",
    overview:
      "Casual evening event with two talks and open networking for cloud practitioners.",
    venue: "Cloudflare Portland Office, Portland OR",
    mode: "offline",
    audience: "Cloud architects, platform engineers, startup CTOs",
    agenda: [
      "6:30 PM – Doors Open & Pizza",
      "7:00 PM – Talk 1: Service Mesh Patterns with Istio",
      "7:45 PM – Talk 2: Serverless on Kubernetes",
      "8:30 PM – Open Q&A & Networking",
    ],
    organizer: "CNCF Portland Chapter",
    tags: ["Cloud", "Kubernetes", "CNCF", "Serverless"],
    image: "/images/event5.png",
  },
  "frontend-masters": {
    description:
      "Frontend Masters Conference is a curated single-track event showcasing elite frontend engineering practices, performance, and design systems.",
    overview:
      "A focused, single-track day designed for senior frontend engineers who want depth, not breadth.",
    venue: "Nashville Music City Center, Nashville TN",
    mode: "offline",
    audience: "Senior frontend engineers, design system leads, tech leads",
    agenda: [
      "9:00 AM – Keynote: The Art of Frontend Architecture",
      "10:30 AM – Design Systems at Scale",
      "12:00 PM – Lunch",
      "1:30 PM – Web Performance Deep Dive",
      "3:00 PM – Accessibility: Beyond the Basics",
      "4:30 PM – Panel Discussion",
      "5:00 PM – Networking Reception",
    ],
    organizer: "Frontend Masters Community",
    tags: ["Frontend", "CSS", "Performance", "Accessibility"],
    image: "/images/event6.png",
  },
};

export async function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const base = events.find((e) => e.slug === slug);
  if (!base) return { title: "Event Not Found" };
  return { title: `${base.title} | DevQuest` };
}

const EventPage = async ({ params }: Props) => {
  const { slug } = await params;

  const base = events.find((e) => e.slug === slug);
  const detail = eventDetails[slug];

  if (!base || !detail) notFound();

  const event = { ...base, ...detail };

  const modeIcon = {
    online: "/icons/mode.svg",
    offline: "/icons/pin.svg",
    hybrid: "/icons/mode.svg",
  }[event.mode];

  return (
    <section id="event">
      {/* Header */}
      <div className="header">
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="!text-left text-4xl max-sm:text-2xl">{event.title}</h1>
        <p>{event.description}</p>
      </div>

      {/* Details */}
      <div className="details">
        {/* Left column — content */}
        <div className="content">
          <Image
            src={event.image}
            alt={event.title}
            width={900}
            height={457}
            className="banner"
            priority
          />

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 text-light-200 text-sm">
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/calendar.svg" alt="date" width={16} height={16} />
              <p>{event.date}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/clock.svg" alt="time" width={16} height={16} />
              <p>{event.time}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/pin.svg" alt="location" width={16} height={16} />
              <p>{event.venue}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src={modeIcon} alt="mode" width={16} height={16} />
              <p className="capitalize">{event.mode}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/audience.svg" alt="audience" width={16} height={16} />
              <p>{event.audience}</p>
            </div>
          </div>

          {/* Overview */}
          <div className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </div>

          {/* Agenda */}
          <div className="agenda">
            <h2>Agenda</h2>
            <ul>
              {event.agenda.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Organizer */}
          <div className="flex-col-gap-2">
            <h2>Organizer</h2>
            <p>{event.organizer}</p>
          </div>
        </div>

        {/* Right column — booking */}
        <div className="booking">
          <BookEventForm eventSlug={event.slug} eventTitle={event.title} />
        </div>
      </div>
    </section>
  );
};

export default EventPage;