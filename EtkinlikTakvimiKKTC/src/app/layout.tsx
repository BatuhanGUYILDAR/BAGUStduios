import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "KKTC Events | Kuzey Kıbrıs Etkinlik Takvimi",
    template: "%s | KKTC Events"
  },
  description:
    "KKTC'deki konserleri, DJ gecelerini, beach party'leri, pub etkinliklerini ve festival aktivitelerini keşfet.",
  keywords: [
    "KKTC etkinlik",
    "Kuzey Kıbrıs konser",
    "Girne gece hayatı",
    "Mağusa etkinlik",
    "Lefkoşa festival"
  ],
  openGraph: {
    title: "KKTC Events",
    description:
      "Konserler, DJ geceleri, beach party'ler ve sosyal aktiviteler tek takvimde.",
    type: "website",
    locale: "tr_CY"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
