import '../public/assets/css/style.css'
import "../public/assets/css/swiper-custom.css";
import React, { useEffect, useState } from "react";
import 'react-modal-video/css/modal-video.css';
function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
            <title>Manifest FTS | Branding, Design and Software Development</title>
            <meta name="description" content="We help our partners acquire new customers, get more traffic, sell more stuff and create better user experiences. Get started with a free Consultation." />
            </Head>
            <Script id="GTM" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
            `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
            `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
            `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
            `})(window,document,'script','dataLayer','GTM-NPL69N2');`}
            </Script>

            <Component {...pageProps} />
        </>
    )
}

export default MyApp
