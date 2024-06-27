import { Outfit } from "next/font/google";
import "./globals.css";
// import { GoogleTagManager } from '@next/third-parties/google'
import { GoogleAnalytics } from '@next/third-parties/google'


const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://priapunyaselera.ai'),
  title: "AI Photo EURO 2024 - Pria Punya Selera",
  description: "Giveaway Jersey EURO Original",
  openGraph: {
    title: "AI Photo EURO 2024 - Pria Punya Selera",
    description: "Giveaway Jersey EURO Original",
    url: 'https://priapunyaselera.ai',
    siteName: 'AI Pria Punya Selera',
    images: ['/og.jpg']
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
      {/* <GoogleTagManager gtmId="G-3YWLPQZ3JQ" /> */}
      <GoogleAnalytics gaId="G-EGYM4VTX6X" />
    </html>
  );
}
