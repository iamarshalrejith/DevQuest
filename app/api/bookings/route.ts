import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Booking, Event } from "@/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, eventSlug } = body;

    // Basic validation
    if (!email || !eventSlug) {
      return NextResponse.json(
        { error: "Email and event slug are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the event by slug
    const event = await Event.findOne({ slug: eventSlug }).select("_id title");

    if (!event) {
      return NextResponse.json(
        { error: "Event not found." },
        { status: 404 }
      );
    }

    // Check for duplicate booking
    const existing = await Booking.findOne({
      eventId: event._id,
      email: email.toLowerCase().trim(),
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already registered for this event." },
        { status: 409 }
      );
    }

    // Create the booking
    const booking = await Booking.create({
      eventId: event._id,
      email: email.toLowerCase().trim(),
    });

    return NextResponse.json(
      {
        message: `Successfully registered for ${event.title}! We'll see you there.`,
        bookingId: booking._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/bookings] Error:", error);

    // Handle Mongoose duplicate key error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "You have already registered for this event." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("eventSlug");

    if (!eventSlug) {
      return NextResponse.json(
        { error: "eventSlug query parameter is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const event = await Event.findOne({ slug: eventSlug }).select("_id title");

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    const count = await Booking.countDocuments({ eventId: event._id });

    return NextResponse.json({ eventSlug, count }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/bookings] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}