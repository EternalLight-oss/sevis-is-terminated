import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F-1 Student SEVIS & Visa Status Tracker",
  description:
    "An anonymous data collection platform for international students affected by SEVIS terminations or visa revocations. View aggregated data trends and patterns to better understand the current situation.",
  openGraph: {
    title: "F-1 Student SEVIS & Visa Status Tracker",
    description:
      "Help build a clearer picture of recent F-1 visa and SEVIS issues through anonymous data sharing. View trends, patterns, and statistics from aggregated reports.",
    url: "https://sevis-is-terminated.vercel.app/",
    siteName: "SEVIS & Visa Status Tracker",
    images: [
      {
        url: "/path-to-your-image.jpg", // Replace with the actual path to your app's preview image
        width: 800,
        height: 600,
        alt: "SEVIS Tracker Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "F-1 Student SEVIS & Visa Status Tracker",
    description:
      "Explore aggregated data visualizations of F-1 visa and SEVIS issues. Share your experience anonymously to contribute to advocacy efforts.",
    images: ["/path-to-your-image.jpg"], // Replace with the actual path to your app's preview image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
