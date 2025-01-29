import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import logo from "@/assets/Energy ID.png";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Schema Builder",
  description: "A visual tool to build JSON schemas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex justify-between px-10 py-2 border border-b-1 items-center">
          <Image src={logo} alt="Energy ID" height={24} />
          <h1 className="text-lg font-bold">Schema Builder</h1>
        </div>
        <div className="bg-neutral-100">{children}</div>
      </body>
    </html>
  );
}
