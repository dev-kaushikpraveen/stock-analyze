import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXORA | Institutional Financial Analytics & Trading Terminal",
  description:
    "Institutional Quant, ML Predictive Intelligence, Options Greek Lab, Algorithmic Backtesting, and AI Copilot.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f172a] text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
