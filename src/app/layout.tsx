import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-heading' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Digi Grow | Creative Portfolio",
  description:
    "Dark, editorial creative portfolio by Digi Grow — B-Roll & Video Editing, Website Design, and more.",
  openGraph: {
    title: "Digi Grow | Creative Portfolio",
    description:
      "Dark, editorial creative portfolio by Digi Grow — B-Roll & Video Editing, Website Design, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
