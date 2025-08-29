
"use client";
import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

const MainLayout = ({ children }) => {
  const pathname = usePathname().toLowerCase();

  const noLayoutRoutes = [
    "/login",
    "/register",
    "/otp",
    "/searchmobile",
    // "/searchresults",
    // "/category",
    // "/account",
    // "/account/order",
    // "/cart",
    // "/accounts/orders/id",
    // "/accounts/review/id",
    // "/accounts/address/addaddress",
    // "/accounts/address/editaddress",
  ];
  // const pathdata =
  //   pathname === "/accounts" ||
  //   pathname === "/accounts/address" ||
  //   pathname === "/accounts/coupons" ||
  //   pathname === "/accounts/notifications" ||
  //   pathname === "/accounts/orders" ||
  //   pathname === "/accounts/payments" ||
  //   pathname === "/accounts/review" ||
  //   pathname === "/accounts/profile" ||
  //   pathname === "/accounts/wishlist";

  const hideHeader =
    noLayoutRoutes.includes(pathname) || pathname === "/product";
  const hideFooter = noLayoutRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
