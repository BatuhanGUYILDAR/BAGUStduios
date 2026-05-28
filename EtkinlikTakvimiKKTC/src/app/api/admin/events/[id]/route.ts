import { NextResponse } from "next/server";
import {
  deleteEvent,
  EventStoreError,
  parseAdminPatch,
  updateEvent
} from "@/lib/server/eventStore";

export const runtime = "nodejs";

type AdminEventRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function errorResponse(error: unknown) {
  if (error instanceof EventStoreError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
}

export async function PATCH(request: Request, context: AdminEventRouteContext) {
  try {
    const { id } = await context.params;
    const payload: unknown = await request.json();
    const patch = parseAdminPatch(payload);
    const event = await updateEvent(id, patch);

    return NextResponse.json({ event });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: AdminEventRouteContext) {
  try {
    const { id } = await context.params;
    await deleteEvent(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
