
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import PropertyDetailPage from "./PropertyDetailPage";

const HomePage = () => {
  const location = useLocation();

  const isPropertyDetail = location.pathname.startsWith("/property");

  // Hide footer on individual conversation page (has its own input bar)
  const hideFooter = location.pathname.match(/^\/chat\/.+/) || location.pathname.startsWith("/terms") || location.pathname.startsWith("/privacy") || location.pathname.startsWith("/map");

  if (isPropertyDetail) {
    return (
      <>
        <PropertyDetailPage />
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};

export default HomePage;

