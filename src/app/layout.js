import MainLayout from "@/components/MainLayout";
import "./globals.css";
import ReduxLayout from "@/components/layout/ReduxLayout";
import { ReduxProvider } from "@/components/layout/redux-provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "EwShopping",
  icons: {
    icon: "/favicon.png", // or '/favicon.ico'
  },
  description:
    "Welcome to EwShopping, your destination for stylish fashion and cutting-edge electronics. Discover quality clothing for all, plus the latest gadgets and tech accessories. Enjoy a seamless, personalized shopping experience and elevate your lifestyle. Shop now!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <ReduxProvider>
          <ReduxLayout>
            <MainLayout>{children}</MainLayout>
          </ReduxLayout>
        </ReduxProvider>
        {/* <Toaster position="top-left" reverseOrder={false} /> */}
        <Toaster
          position="top-left"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636', color: '#fff'
            },
            success: { duration: 3000 },
            error: { duration: 2000 },
          }}
        />
      </body>
    </html>
  );
}
