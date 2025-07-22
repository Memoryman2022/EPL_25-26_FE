import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { UserProvider } from "./auth/components/Context";

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
        <UserProvider>
          <Header />
        </UserProvider>
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
