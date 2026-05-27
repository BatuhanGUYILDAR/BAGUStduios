import { Check, Pencil, Trash2 } from "lucide-react";
import type { Event } from "@/types/event";
import { formatPrice } from "@/lib/eventUtils";
import { Badge } from "./Badge";
import { Button } from "./Button";

type AdminEventTableProps = {
  events: Event[];
};

export function AdminEventTable({ events }: AdminEventTableProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-ink">Admin table preview</h2>
          <p className="mt-1 text-sm font-semibold text-slatecopy">
            Mock event moderation list, no login or backend required.
          </p>
        </div>
        <p
          aria-live="polite"
          className="rounded-full bg-white/74 px-4 py-2 text-xs font-extrabold text-electric-purple"
        >
          Actions are visual-only in this frontend preview.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs font-black uppercase tracking-[0.16em] text-mutedcopy">
              <th className="px-4 py-2">Event title</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Featured</th>
              <th className="px-4 py-2">Verified</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr className="rounded-3xl bg-white/66 shadow-sm" key={event.id}>
                <td className="rounded-l-3xl px-4 py-4">
                  <p className="font-black text-ink">{event.title}</p>
                  <p className="mt-1 text-xs font-bold text-mutedcopy">{event.category}</p>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slatecopy">{event.venueName}</td>
                <td className="px-4 py-4 text-sm font-bold text-slatecopy">{event.city}</td>
                <td className="px-4 py-4 text-sm font-bold text-slatecopy">
                  {event.date} - {event.time}
                </td>
                <td className="px-4 py-4">
                  <Badge status={event.status}>{event.status}</Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge tone={event.featured ? "pink" : "slate"}>
                    {event.featured ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-4">
                  <Badge tone={event.verified ? "verified" : "slate"}>
                    {event.verified ? "Yes" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slatecopy">{formatPrice(event)}</td>
                <td className="rounded-r-3xl px-4 py-4">
                  <div className="flex gap-2">
                    <Button
                      aria-label={`${event.title} onayla`}
                      size="sm"
                      variant="outline"
                    >
                      <Check aria-hidden="true" size={15} />
                      Approve
                    </Button>
                    <Button
                      aria-label={`${event.title} düzenle`}
                      size="sm"
                      variant="secondary"
                    >
                      <Pencil aria-hidden="true" size={15} />
                      Edit
                    </Button>
                    <Button
                      aria-label={`${event.title} sil`}
                      size="sm"
                      variant="danger"
                    >
                      <Trash2 aria-hidden="true" size={15} />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
