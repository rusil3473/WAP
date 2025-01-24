import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"
import Wrapper from "@/app/components/Wrapper"
import "react-datepicker/dist/react-datepicker.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-geist-sans": geistSans.variable,
          "--font-geist-mono": geistMono.variable,
        } as React.CSSProperties
      }
    >

      <body className="antialiased">
        <Toaster position="top-center"/>
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
