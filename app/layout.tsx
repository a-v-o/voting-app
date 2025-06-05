import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavBar } from "./components/NavBar";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "Voting App",
  description: "A voting app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-w-screen min-h-screen flex justify-center items-center">
        <NextTopLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
