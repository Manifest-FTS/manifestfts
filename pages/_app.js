import '../public/assets/css/style.css'
import "../public/assets/css/swiper-custom.css";
import React, { useEffect, useState } from "react";
import 'react-modal-video/css/modal-video.css';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
    return (
    <>
        <Script id="FreshCRM" src='//fw-cdn.com/2297861/2939382.js' chat='true'></Script>
        <Script id="GTM1" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtm.js?id=GTM-NPL69N2`}/>

        <Script id="GTM2" strategy='lazyOnload'>
            {`
                window.datalayer = window.dataLayer || [];
                
                function gtag(){dataLayer.push(arguments);}
                
                gtag('js', new Date());
                gtag('config', 'GTM-NPL69N2');
            `}
        </Script>

        <Component {...pageProps} />
    </>
)}

export default MyApp
