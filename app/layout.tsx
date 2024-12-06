import AppProvider from "@/components/AppProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynamic | Pimlico - Demo",
  description: "App using Dynamic and Pimlico paymaster",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        {children}
      </AppProvider>
    </html>
  );
}
