import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import { site } from "@/lib/config";
import { CartProvider } from "@/components/cart";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Fashion Tailoring Kreation — Made-to-measure menswear", template: "%s | FTK" },
  description:
    "Senator, agbada, native two-piece, English and office wear, adire and jeans — cut to your measure by Fashion Tailoring Kreation.",
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Fashion Tailoring Kreation" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  icons: { icon: "/favicon-64.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
