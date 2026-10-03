/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";

function BackToTop() {
    const [hasScrolled, setHasScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setHasScrolled(window.scrollY > 100);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            {hasScrolled && (
                <a id="scrollUp" href="#navbar" aria-label="Back to top" style={{ position: 'fixed', zIndex: 2147483647 }}>
                    <i className="fi-rr-arrow-small-up" />
                </a>


            )}
        </>
    );
}
export default BackToTop;