import { Outlet } from "react-router-dom";
import Footer from "../../components/layouts/Footer";
import Navbar from "../../components/layouts/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default HomePage;
