import { Html, Head, Main, NextScript } from 'next/document'
import { GTM_ID, pageview } from '../lib/gtm'

export default function Document() {
    return (
        <Html>
            <Head>
                <title>Manifest FTS | Branding, Design Strategy and Software Solutions</title>
                <meta name="description" content="We help our partners acquire new customers, increase donations and donor activity, sell more stuff and create better user experiences."/>
            </Head>
            <body>
                <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                />
                </noscript>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}