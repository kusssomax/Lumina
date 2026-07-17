import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ClerkNavAuth from "@/components/ClerkNavAuth";
import { Toaster } from "sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina",
  description: "Lumina is a platform where you can speak about your book with AI Assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} dark relative font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        <ClerkProvider>
          <NavBar>
            <ClerkNavAuth />
          </NavBar>
          <main className="pt-[64px]">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
