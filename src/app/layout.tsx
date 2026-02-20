import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ClientLayout from "@/components/layout/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen overflow-x-hidden">
        <ClientLayout>
          <Navbar />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
