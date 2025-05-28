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
      <body className="min-w-screen min-h-screen flex justify-center items-center m-0 p-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="h-16 absolute top-0 right-4 flex shrink-0 items-center z-10">
            <NavBar />
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
