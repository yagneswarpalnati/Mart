import SpringyCursor from "@/components/ui/SpringyCursor";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen overflow-x-hidden">
        <Navbar />
        <SpringyCursor/>
        {children}
      </body>
    </html>
  );
}
