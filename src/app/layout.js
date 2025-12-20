// app/layout.js
import MainLayout from "@/components/MainLayout";
import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ReduxLayout from "@/components/layout/ReduxLayout";
import { ReduxProvider } from "@/components/layout/redux-provider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import CartHydrationProvider from "@/components/layout/CartHydrationProvider";
import ScrollToTopEffect from "@/components/ScrollToTopEffect";
import { Poppins, Manrope } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: "EwShopping",
  description: "Welcome to EwShopping, your destination for stylish fashion and cutting-edge electronics. Discover quality clothing for all, plus the latest gadgets and tech accessories.",
  keywords: "fashion, electronics, shopping, clothing, gadgets, tech accessories",
  authors: [{ name: "EwShopping" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ewshopping.com',
    title: 'EwShopping',
    description: 'Your destination for stylish fashion and cutting-edge electronics.',
    siteName: 'EwShopping',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EwShopping',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EwShopping',
    description: 'Your destination for stylish fashion and cutting-edge electronics.',
    images: ['/twitter-image.png'],
    creator: '@ewshopping',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: "/manifest.json",
  other: {
    'msapplication-TileColor': '#cfebfe',
  },
};

export const viewport = {
  themeColor: "#cfebfe",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        
        {/* Preload first font only */}
        <link
          rel="preload"
          href="/fonts/Poppins-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Google Tag Manager - Lazy loaded */}
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

        {/* Google Analytics - Lazy loaded */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-P107735Y77"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P107735Y77', {
                page_path: window.location.pathname,
                send_page_view: false
              });
            `,
          }}
        />

        {/* Meta Pixel - Lazy loaded */}
        <Script
          id="meta-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;
                n=f.fbq=function(){
                  n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)
                };
                if(!f._fbq)f._fbq=n;
                n.push=n;
                n.loaded=!0;
                n.version='2.0';
                n.queue=[];
                t=b.createElement(e);
                t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)
              }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '891839062956188');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* NoScript Fallbacks */}
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
            src="https://www.facebook.com/tr?id=891839062956188&ev=PageView&noscript=1"
            alt="Facebook Pixel Fallback"
          />
        </noscript>

        <ReduxProvider>
          <ReduxLayout>
            <MainLayout>
              <ScrollToTopEffect />
              <CartHydrationProvider>{children}</CartHydrationProvider>
            </MainLayout>
          </ReduxLayout>
        </ReduxProvider>

        <Toaster
          position="top-left"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: { 
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              }
            },
            error: { 
              duration: 2000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              }
            },
          }}
        />
        
        {/* Add structured data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "EwShopping",
              "url": "https://ewshopping.com",
              "description": "Your destination for stylish fashion and cutting-edge electronics.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ewshopping.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}