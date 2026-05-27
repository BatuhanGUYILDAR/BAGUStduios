import type { Event } from "@/types/event";
import { EventCard } from "./EventCard";

type EventListProps = {
  events: Event[];
};

export function EventList({ events }: EventListProps) {
  return (
    <div className="grid gap-5">
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  );
}
