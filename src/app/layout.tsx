import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://farmaanmalik.dev"),
  title: "Farmaan Malik — Software Developer",
  description:
    "Mobile-first software developer building large-scale React Native applications used in production. Specialized in mobile architecture, state management, and real-time UI.",
  keywords: [
    "Farmaan Malik",
    "Software Developer",
    "React Native",
    "Mobile Developer",
    "Go",
    "Kotlin",
    "Portfolio",
  ],
  authors: [{ name: "Farmaan Malik" }],
  openGraph: {
    title: "Farmaan Malik — Software Developer",
    description:
      "Mobile-first software developer building large-scale React Native applications used in production.",
    type: "website",
  },
};

// Applies the saved (or system) theme before paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
