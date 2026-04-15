import { ClerkProvider } from "@clerk/nextjs";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasValidClerkKey =
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("replace_me");

  if (!hasValidClerkKey) {
    return (
      <html lang="en">
        <body className={`${inter.variable} ${jetbrainsMono.variable} font-[var(--font-inter)]`}>
          <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-24 sm:px-6">
            <h1 className="text-2xl font-bold">Clerk configuration needed</h1>
            <p className="text-[#9B99B8]">
              Set valid Clerk keys in <code>frontend/.env.local</code> and restart <code>npm run dev</code>.
            </p>
            <p className="text-[#9B99B8]">
              Required: <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>.
            </p>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-[var(--font-inter)]`}>
        <ClerkProvider>
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
        </ClerkProvider>
      </body>
    </html>
  );
}
