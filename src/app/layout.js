import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chanfle – Funny Videos",
  description: "The internet's funniest video collection. Laugh until it hurts.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
        <body className="flex min-h-full flex-col bg-[#0f0f13] text-[#f0f0f5]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#2a2a3a] py-6 text-center text-xs text-[#6b6b80]">
            <p>
              Made with 😂 by Chanfle ·{" "}
              <span className="text-[#ff3b5c]">No refunds for lost productivity</span>
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
