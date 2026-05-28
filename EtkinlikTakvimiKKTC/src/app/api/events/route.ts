import { NextResponse } from "next/server";
import { createPendingEvent, EventStoreError, getApprovedEvents } from "@/lib/server/eventStore";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof EventStoreError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
}

export async function GET() {
  try {
    const events = await getApprovedEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json();
    const event = await createPendingEvent(payload);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
