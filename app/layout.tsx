import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MakeMyResume - AI-Powered LaTeX Placement Resume Tailor",
  description:
    "Tailor your Master LaTeX resume for placement drives, internships, and full-time jobs with automated ATS scoring, STAR bullet point optimization, and instant PDF compilation.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] antialiased selection:bg-[#0071e3] selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
