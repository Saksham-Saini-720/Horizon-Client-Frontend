
import { Outlet } from "react-router-dom";
import Footer from "../components/layouts/Footer";
import Navbar from "../components/layouts/Navbar";

/**
 * HomePage - Base layout wrapper
 * All routes render inside via <Outlet />
 * Navbar and Footer persist across all pages
 */
const HomePage = () => {
  return (
    <>
      {/* Top navigation */}
      <Navbar />
      
      {/* Nested routes render here */}
      <Outlet />
      
      {/* Bottom navigation */}
      <Footer />
    </>
  );
};

export default HomePage;
