import { SITE_NAME, SITE_TITLE, SITE_URL } from "@/app/site";
import { Signature } from "@/components/layout";
import { settingsKey } from "@/lib";
import type { Metadata, Viewport } from "next";
import { Kumbh_Sans, Roboto_Slab, Space_Mono } from "next/font/google";
import "./globals.css";

const restoreTheme = `try{const{font,accent}=JSON.parse(localStorage.getItem("${settingsKey}"));document.documentElement.dataset.font=font;document.documentElement.dataset.accent=accent}catch{}`;

const description =
  "A focus timer built on the Pomodoro technique. Work in timed sessions with short and long breaks, set your own lengths, and pick the font and color you like.";

const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "The name pomodoro set large on a dark navy card, above a one-line description of the timer.",
};

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description,
    images: [shareImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e213f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${kumbhSans.variable} ${robotoSlab.variable} ${spaceMono.variable} antialiased`}
    >
      <body className="relative flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />
        {children}
        <Signature />
      </body>
    </html>
  );
}
