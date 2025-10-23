import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-3xl m-auto bg-indigo-100 text-gray-800 border-2 border-gray-100">
      <Header />
      {/* Pages go here, between header and footer (homepage, live page, scheduled page) */}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
