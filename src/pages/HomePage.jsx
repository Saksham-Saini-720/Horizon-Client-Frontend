
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import PropertyDetailPage from "./PropertyDetailPage";

const HomePage = () => {
  const location = useLocation();

  const isPropertyDetail = location.pathname.startsWith("/property");
  // Hide navbar on these pages (they have their own headers)
  const hideNavbar =
    location.pathname.startsWith("/inquiries") ||
    location.pathname.startsWith("/map") ||
    location.pathname.startsWith("/chat/") ||// Individual conversation has its own header
    location.pathname.startsWith("/terms") ||
    location.pathname.startsWith("/privacy"); 

  // Hide footer on individual conversation page (has its own input bar)
  const hideFooter = location.pathname.match(/^\/chat\/.+/) || location.pathname.startsWith("/terms") || location.pathname.startsWith("/privacy") || location.pathname.startsWith("/map");

  if (isPropertyDetail) {
    return <PropertyDetailPage />;
  }

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};

export default HomePage;

