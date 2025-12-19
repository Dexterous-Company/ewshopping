// app/layout.js
import MainLayout from "@/components/MainLayout";
import "./globals.css";
import "../main_pages/HomeScreen/InfiniteScroll.css"
import "../main_pages/HomeScreen/HoverCss.css"
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
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

export const metadata = {
  title: "EwShopping",
  description:
    "Welcome to EwShopping, your destination for stylish fashion and cutting-edge electronics. Discover quality clothing for all, plus the latest gadgets and tech accessories.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  
  manifest: "/manifest.json",
};
export const viewport = {
  themeColor: "#cfebfe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  className={`${poppins.variable} ${manrope.variable}`}>
      <body cz-shortcut-listen="true">
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXX');
            `,
          }}
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-P107735Y77"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P107735Y77');
            `,
          }}
        />

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
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
            },
            success: { duration: 3000 },
            error: { duration: 2000 },
          }}
        />
      </body>
    </html>
  );
}
