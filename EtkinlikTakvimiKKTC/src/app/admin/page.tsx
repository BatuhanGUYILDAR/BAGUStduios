import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { venues } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Admin Preview",
  description:
    "KKTC Events admin dashboard for approving, rejecting, editing and deleting submitted events."
};

export default function AdminPreviewPage() {
  const verifiedVenues = venues.filter((venue) => venue.verified).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-electric-purple">
          Frontend-only admin
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
          Admin Preview
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slatecopy">
          Pending, approved ve rejected etkinlikler backend API&apos;den gelir. Bu ekrandan etkinlik
          onaylayabilir, reddedebilir, düzenleyebilir veya silebilirsin.
        </p>
      </section>

      <AdminDashboard verifiedVenues={verifiedVenues} />
    </div>
  );
}
