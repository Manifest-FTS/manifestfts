import Link from 'next/link';

import React, { useState } from 'react';
const FtsSignin = () => {
    return (
        <div className="footer-top">
            <div className="row">
                <div className="col-md-4 col-sm-6 text-center text-md-start">
                    <Link href="/">
                        <a>
                            <Image src="/assets/imgs/manifest-logo-mark-fts.svg" alt="Manifest FTS" width={100} height={100} />
                        </a>
                    </Link>
                </div>
                <div className="col-md-8 col-sm-6 text-center text-md-end">
                    <span className="color-gray-900 text-heading-6 mr-30 text-mb-sm-20">Ready to get started?</span>
                    <Link href="/page-signup">
                        <a className="btn btn-square">Create an Account</a>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FtsSignin;