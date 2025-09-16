import "./../styles/globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AOSClient from "@/components/AOSClient";

export const metadata: Metadata = {
  title: "awesometraveltours — Singapore Tours",
  description: "Curated Singapore tours with realtime availability and booking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
          <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        {/* Init AOS on the client */}
        <AOSClient />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
