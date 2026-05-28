import { NextResponse } from "next/server";
import { EventStoreError, getAllEvents } from "@/lib/server/eventStore";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof EventStoreError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
}

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return errorResponse(error);
  }
}
