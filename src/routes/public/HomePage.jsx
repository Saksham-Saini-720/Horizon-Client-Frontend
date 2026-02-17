import { Outlet, useLocation } from "react-router-dom";
import Footer from "../../components/layouts/Footer";
import Navbar from "../../components/layouts/Navbar";
// import SearchBar from "../../components/layouts/SearchBar";
import ExplorePage from "./ExplorePage";

const HomePage = () => {
    const location = useLocation()
    // console.log("Current path:", location.pathname); // Debugging line to check the current path
  return (
    <>
      <Navbar />
      {location.pathname === "/" && <ExplorePage/>}
      <Outlet />
      <Footer />
    </>
  );
};

export default HomePage;


