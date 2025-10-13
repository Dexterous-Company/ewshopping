import MainLayout from "@/components/MainLayout";
import "./globals.css";
import ReduxLayout from "@/components/layout/ReduxLayout";
import { ReduxProvider } from "@/components/layout/redux-provider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import CartHydrationProvider from "@/components/layout/CartHydrationProvider";

export const metadata = {
  title: "EwShopping",
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Welcome to EwShopping, your destination for stylish fashion and cutting-edge electronics. Discover quality clothing for all, plus the latest gadgets and tech accessories. Enjoy a seamless, personalized shopping experience and elevate your lifestyle. Shop now!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="theme-color"
          content="#cfebfe"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#cfebfe"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="msapplication-navbutton-color" content="#cfebfe" />
        {/* Windows Phone */}
        {/* iOS Safari Status Bar */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* Viewport for mobile optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

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

        {/* NoScript fallbacks */}
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
