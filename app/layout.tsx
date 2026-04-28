import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/app/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Aung Kyaw Thu — Full Stack Developer",
  description:
    "Full-Stack Developer with 4+ years building scalable web applications. Skilled in React, Next.js, Laravel, and DevOps tools.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "Laravel",
    "PHP",
    "Aung Kyaw Thu",
  ],
  openGraph: {
    title: "Aung Kyaw Thu — Full Stack Developer",
    description:
      "Portfolio of Aung Kyaw Thu — Full Stack Developer specializing in React, Next.js, and Laravel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

