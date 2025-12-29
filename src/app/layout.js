// app/layout.js
import MainLayout from "@/components/MainLayout";
import "./globals.css";
import ReduxLayout from "@/components/layout/ReduxLayout";
import { ReduxProvider } from "@/components/layout/redux-provider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import CartHydrationProvider from "@/components/layout/CartHydrationProvider";
import ScrollToTopEffect from "@/components/ScrollToTopEffect";
import { Poppins, Manrope } from "next/font/google";

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

/* Metadata */
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ewshopping.com",
    title: "EwShopping",
    description:
      "Your destination for stylish fashion and cutting-edge electronics.",
    siteName: "EwShopping",
  },
  twitter: {
    card: "summary_large_image",
    title: "EwShopping",
    description:
      "Your destination for stylish fashion and cutting-edge electronics.",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cfebfe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable}`}>
      <head>
        {/* Preconnect for analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
      </head>

      <body suppressHydrationWarning>
        {/* ✅ Google Tag Manager (ONLY THIS – GA IS INSIDE GTM) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
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

        {/* ✅ Facebook Pixel – lazy (non-blocking) */}
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

        {/* NoScript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* App Layout */}
        <ReduxProvider>
          <ReduxLayout>
            <MainLayout>
              <ScrollToTopEffect />
              <CartHydrationProvider>{children}</CartHydrationProvider>
            </MainLayout>
          </ReduxLayout>
        </ReduxProvider>

        {/* Toast */}
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
              url: "https://ewshopping.com",
            }),
          }}
        />
      </body>
    </html>
  );
}
