import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { UserProvider } from "./auth/components/Context";
import { FixtureProvider } from "./auth/components/FixtureContext";

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
      <body className="bg-gray-100 text-gray-900">
        <UserProvider>
          <FixtureProvider>
            <main className="pt-14">
              <Header />
              {children}
            </main>
          </FixtureProvider>
        </UserProvider>
      </body>
    </html>
  );
}
