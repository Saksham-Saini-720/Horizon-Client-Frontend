
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";
import PropertyDetailPage from "./PropertyDetailPage";

const HomePage = () => {

  const location = useLocation()
  
  return !location.pathname.startsWith("/property") ? (
    <>
      {/* Top navigation */}
      <Navbar />
      
      {/* Nested routes render here */}
      <Outlet />
      
      {/* Bottom navigation */}
      <Footer />
    </>
  ) : (
    <PropertyDetailPage/>
  );
};

export default HomePage;
