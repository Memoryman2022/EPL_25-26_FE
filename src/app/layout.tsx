import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "EPL Predictor Module",
  description: "Premier League Prediction Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {" "}
        {/* Padding to account for fixed header */}
        <Header />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
