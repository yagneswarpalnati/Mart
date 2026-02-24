import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientLayout from "@/components/layout/ClientLayout";
import { Outfit, Inter } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <ClientLayout>
          <div className="mobile-container overflow-x-hidden">
            <Navbar />
            <main className="app-main">{children}</main>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
