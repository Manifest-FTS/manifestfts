import { useState } from 'react';
import BackToTop from "../elements/BackToTop";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children, headerStyle }) => {
  const [openClass, setOpenClass] = useState('');

  const handleOpen = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.add("mobile-menu-active");
      setOpenClass("sidebar-visible");
    }
  };

  const handleRemove = () => {
    if (openClass === "sidebar-visible" && typeof document !== 'undefined') {
      setOpenClass("");
      document.body.classList.remove("mobile-menu-active");
    }
  };

  const isMobileMenuOpen = openClass === "sidebar-visible";

  return (
    <>
      <div className={openClass && "body-overlay-1"} onClick={handleRemove} />

      <Header handleOpen={handleOpen} headerStyle={headerStyle} isMobileMenuOpen={isMobileMenuOpen} />
      <Sidebar openClass={openClass} onClose={handleRemove} />
      <main className="main">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Layout;