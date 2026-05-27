"use client";

import { useState } from "react";
import posthog from "posthog-js";

interface Props {
  eventSlug: string;
  eventTitle: string;
}

type Status = "idle" | "loading" | "success" | "error";

const BookEventForm = ({ eventSlug, eventTitle }: Props) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), eventSlug }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're registered! Check your inbox.");
        setEmail("");
        posthog.capture("event_booked", {
          event_slug: eventSlug,
          event_title: eventTitle,
        });
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div id="book-event">
      <div className="signup-card">
        <div className="flex flex-col gap-1">
          <h2 className="font-schibsted-grotesk text-xl font-bold">
            Reserve Your Spot
          </h2>
          <p className="text-light-200 text-sm">
            Enter your email to register for this event.
          </p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl">
              ✓
            </div>
            <p className="text-primary font-semibold">You&apos;re in!</p>
            <p className="text-light-200 text-sm">{message}</p>
            <button
              onClick={() => setStatus("idle")}
              className="text-light-200 hover:text-white text-xs underline"
            >
              Register another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-light-100 text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="bg-dark-200 w-full rounded-[6px] px-5 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
              />
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 w-full cursor-pointer rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black transition-colors"
            >
              {status === "loading" ? "Registering…" : "Register Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookEventForm;