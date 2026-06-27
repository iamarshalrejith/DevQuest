"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Mode = "online" | "offline" | "hybrid";

interface FormState {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: Mode;
  audience: string;
  organizer: string;
  agenda: string[];
  tags: string[];
}

const INITIAL: FormState = {
  title: "",
  description: "",
  overview: "",
  image: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "offline",
  audience: "",
  organizer: "",
  agenda: [""],
  tags: [""],
};

const MODES: { value: Mode; label: string; icon: string }[] = [
  { value: "offline", label: "In-Person", icon: "/icons/pin.svg" },
  { value: "online", label: "Online", icon: "/icons/mode.svg" },
  { value: "hybrid", label: "Hybrid", icon: "/icons/mode.svg" },
];

const CreateEventPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setListItem = (field: "agenda" | "tags", idx: number, value: string) =>
    setForm((prev) => {
      const copy = [...prev[field]];
      copy[idx] = value;
      return { ...prev, [field]: copy };
    });

  const addListItem = (field: "agenda" | "tags") =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));

  const removeListItem = (field: "agenda" | "tags", idx: number) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const payload = {
      ...form,
      agenda: form.agenda.filter((a) => a.trim()),
      tags: form.tags.filter((t) => t.trim()),
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/events/${data.slug}`);
      } else {
        setError(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  const busy = status === "loading";

  return (
    <section id="create-event">
      {/* Page header */}
      <div className="ce-hero">
        <h1 className="text-left">Host Your Event</h1>
        <p className="text-light-200 text-lg mt-3">
          Fill in the details below to publish your dev event on DevQuest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="ce-form">

        {/* ── Section: Basic Info ── */}
        <div className="ce-section">
          <h3 className="ce-section-title">Basic Info</h3>

          <div className="ce-field">
            <label>Event Title</label>
            <input required maxLength={100} placeholder="e.g. React Conf 2025"
              value={form.title} onChange={(e) => set("title", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-field">
            <label>Short Description</label>
            <textarea required maxLength={1000} rows={3}
              placeholder="A punchy one-liner shown on the event card"
              value={form.description} onChange={(e) => set("description", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-field">
            <label>Overview</label>
            <textarea required maxLength={500} rows={3}
              placeholder="Fuller description shown on the event detail page"
              value={form.overview} onChange={(e) => set("overview", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-field">
            <label>Cover Image URL</label>
            <input type="url" required placeholder="https://example.com/cover.png"
              value={form.image} onChange={(e) => set("image", e.target.value)} disabled={busy} />
          </div>
        </div>

        {/* ── Section: Location & Time ── */}
        <div className="ce-section">
          <h3 className="ce-section-title">Location &amp; Time</h3>

          <div className="ce-field">
            <label>Venue</label>
            <input required placeholder="e.g. Moscone Center, San Francisco"
              value={form.venue} onChange={(e) => set("venue", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-field">
            <label>City / Region</label>
            <input required placeholder="e.g. San Francisco, CA"
              value={form.location} onChange={(e) => set("location", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-row">
            <div className="ce-field">
              <label>Date</label>
              <input type="date" required value={form.date}
                onChange={(e) => set("date", e.target.value)} disabled={busy} />
            </div>
            <div className="ce-field">
              <label>Time</label>
              <input required placeholder="e.g. 9:00 AM – 6:00 PM"
                value={form.time} onChange={(e) => set("time", e.target.value)} disabled={busy} />
            </div>
          </div>

          {/* Mode toggle */}
          <div className="ce-field">
            <label>Event Mode</label>
            <div className="ce-mode-row">
              {MODES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  disabled={busy}
                  onClick={() => set("mode", value)}
                  className={`ce-mode-btn${form.mode === value ? " active" : ""}`}
                >
                  <Image src={icon} alt={label} width={15} height={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section: People ── */}
        <div className="ce-section">
          <h3 className="ce-section-title">People</h3>

          <div className="ce-field">
            <label>Organizer</label>
            <input required placeholder="e.g. Meta Open Source"
              value={form.organizer} onChange={(e) => set("organizer", e.target.value)} disabled={busy} />
          </div>

          <div className="ce-field">
            <label>Target Audience</label>
            <input required placeholder="e.g. React developers, frontend engineers"
              value={form.audience} onChange={(e) => set("audience", e.target.value)} disabled={busy} />
          </div>
        </div>

        {/* ── Section: Agenda ── */}
        <div className="ce-section">
          <h3 className="ce-section-title">Agenda</h3>
          <div className="ce-list">
            {form.agenda.map((item, idx) => (
              <div key={idx} className="ce-list-row">
                <span className="ce-list-num">{idx + 1}</span>
                <input
                  placeholder="e.g. 9:00 AM – Keynote: State of React"
                  value={item}
                  onChange={(e) => setListItem("agenda", idx, e.target.value)}
                  disabled={busy}
                />
                {form.agenda.length > 1 && (
                  <button type="button" className="ce-remove"
                    onClick={() => removeListItem("agenda", idx)} disabled={busy}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="ce-add"
              onClick={() => addListItem("agenda")} disabled={busy}>
              + Add agenda item
            </button>
          </div>
        </div>

        {/* ── Section: Tags ── */}
        <div className="ce-section">
          <h3 className="ce-section-title">Tags</h3>
          <div className="ce-list">
            <div className="ce-tags-preview">
              {form.tags.filter(t => t.trim()).map((t, i) => (
                <span key={i} className="pill">{t}</span>
              ))}
            </div>
            {form.tags.map((tag, idx) => (
              <div key={idx} className="ce-list-row">
                <input
                  placeholder="e.g. React"
                  value={tag}
                  onChange={(e) => setListItem("tags", idx, e.target.value)}
                  disabled={busy}
                />
                {form.tags.length > 1 && (
                  <button type="button" className="ce-remove"
                    onClick={() => removeListItem("tags", idx)} disabled={busy}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="ce-add"
              onClick={() => addListItem("tags")} disabled={busy}>
              + Add tag
            </button>
          </div>
        </div>

        {/* Error + Submit */}
        {status === "error" && (
          <p className="ce-error">{error}</p>
        )}

        <button type="submit" disabled={busy} className="ce-submit">
          {busy ? "Publishing…" : "Publish Event →"}
        </button>
      </form>
    </section>
  );
};

export default CreateEventPage;