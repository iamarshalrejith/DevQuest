import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      organizer,
      agenda,
      tags,
    } = body;

    // Validate required fields
    const missing = [
      "title",
      "description",
      "overview",
      "image",
      "venue",
      "location",
      "date",
      "time",
      "mode",
      "audience",
      "organizer",
    ].filter((f) => !body[f]?.toString().trim());

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    if (!["online", "offline", "hybrid"].includes(mode)) {
      return NextResponse.json(
        { error: "Mode must be online, offline, or hybrid." },
        { status: 400 }
      );
    }

    if (!Array.isArray(agenda) || agenda.filter((a: string) => a.trim()).length === 0) {
      return NextResponse.json(
        { error: "At least one agenda item is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(tags) || tags.filter((t: string) => t.trim()).length === 0) {
      return NextResponse.json(
        { error: "At least one tag is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      overview: overview.trim(),
      image: image.trim(),
      venue: venue.trim(),
      location: location.trim(),
      date: date.trim(),
      time: time.trim(),
      mode,
      audience: audience.trim(),
      organizer: organizer.trim(),
      agenda: agenda.map((a: string) => a.trim()).filter(Boolean),
      tags: tags.map((t: string) => t.trim()).filter(Boolean),
    });

    return NextResponse.json(
      { message: "Event created successfully!", slug: event.slug, id: event._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/events] Error:", error);

    // Mongoose duplicate slug
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "An event with this title already exists." },
        { status: 409 }
      );
    }

    // Mongoose validation error
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "ValidationError"
    ) {
      const messages = Object.values(
        (error as { errors: Record<string, { message: string }> }).errors
      )
        .map((e) => e.message)
        .join(", ");
      return NextResponse.json({ error: messages }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ date: 1 }).select("-__v");
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/events] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events." },
      { status: 500 }
    );
  }
}