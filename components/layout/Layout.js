import BackToTop from "../elements/BackToTop";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <a className="mf-skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" className="main">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Layout;