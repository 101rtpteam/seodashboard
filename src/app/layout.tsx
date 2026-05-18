import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/contexts/DataContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GSC Analytics Dashboard",
  description: "Google Search Console Analytics Dashboard with Advanced Insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <DataProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </DataProvider>
      </body>
    </html>
  );
}
