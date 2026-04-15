import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-[var(--font-inter)]`}>
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24 sm:px-6">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#17171D",
              color: "#F1F0FF",
              border: "1px solid rgba(255,255,255,0.1)"
            }
          }}
        />
      </body>
    </html>
  );
}
