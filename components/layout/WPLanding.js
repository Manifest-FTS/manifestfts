import BackToTop from "../elements/BackToTop";
import Footer from "./Footer";

const WPLanding = ({ children }) => {
    return (
        <>
            <main className="main">
                {children}
            </main>
            <Footer />
            <BackToTop/>
        </>
    );
};

export default WPLanding;