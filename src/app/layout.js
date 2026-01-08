// app/layout.js
import MainLayout from "../components/MainLayout";
import "./globals.css";
import ReduxLayout from "../components/layout/ReduxLayout";
import { ReduxProvider } from "../components/layout/redux-provider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import CartHydrationProvider from "../components/layout/CartHydrationProvider";
import ScrollToTopEffect from "../components/ScrollToTopEffect";
import { Poppins, Manrope } from "next/font/google";

/* =====================
   SITE URL (LOCAL ONLY)
   ===================== */
const SITE_URL = "https://ewshopping.com";

/* Fonts */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

/* =====================
   METADATA (SEO + SOCIAL)
   ===================== */
export const metadata = {
  title: "EwShopping",
  description:
    "Welcome to EwShopping, your destination for stylish fashion and cutting-edge electronics.",

  keywords:
    "fashion, electronics, shopping, clothing, gadgets, tech accessories",

  authors: [{ name: "EwShopping" }],

  robots: {
    index: true,
    follow: true,
  },

  /* OPEN GRAPH – WhatsApp / FB / LinkedIn / Telegram */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "EwShopping",
    description:
      "Your destination for stylish fashion and cutting-edge electronics.",
    siteName: "EwShopping",
    images: [
      {
        url: `https://cdn.ewshopping.com/uploads/images/ewshopping-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "EwShopping – Online Shopping Platform",
      },
    ],
  },

  /* TWITTER (X) */
  twitter: {
    card: "summary_large_image",
    title: "EwShopping",
    description:
      "Your destination for stylish fashion and cutting-edge electronics.",
    images: "https://cdn.ewshopping.com/uploads/images/ewshopping-og-image.jpg",
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cfebfe",
};

/* =====================
   ROOT LAYOUT
   ===================== */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
      </head>

      <body suppressHydrationWarning>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','YOUR_PIXEL_ID');
            fbq('track','PageView');
          `}
        </Script>

        {/* Layout */}
        <ReduxProvider>
          <ReduxLayout>
            <MainLayout>
              <ScrollToTopEffect />
              <CartHydrationProvider>{children}</CartHydrationProvider>
            </MainLayout>
          </ReduxLayout>
        </ReduxProvider>

        <Toaster position="top-left" />

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EwShopping",
              url: SITE_URL,
            }),
          }}
        />
      </body>
    </html>
  );
}
