import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavBar } from "./components/NavBar";

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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className="min-w-screen min-h-screen flex justify-center items-center">
          <NavBar />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}
