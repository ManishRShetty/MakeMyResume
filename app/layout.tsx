import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MakeMyResume - AI-Powered LaTeX Placement Resume Tailor",
  description:
    "Tailor your Master LaTeX resume for placement drives, internships, and full-time jobs with automated ATS scoring, STAR bullet point optimization, and instant PDF compilation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] antialiased selection:bg-apple-blue selection:text-white transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
