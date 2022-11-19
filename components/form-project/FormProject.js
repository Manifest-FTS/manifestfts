import React, { useState } from 'react';
const FormProject = () => {
    return (
        <section className="section-box">
            <div className="container mb-50 mt-70">
                <div className="bdrd-58 box-gray-100 icon-wave">
                    <div className="row">
                        <div className="col-lg-12 mb-60"><span className="text-body-capitalized text-uppercase">Let&#x2019;s work together</span>
                            <h2 className="text-heading-3 color-gray-900 mt-10">Have a project in mind?</h2>
                            <p className="text-body-text color-gray-600 mt-20">Let us help Manifest your next project. Contact us with us regarding an upcoming project or for a consultation.</p>
                        </div>
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group"><input className="form-control"  placeholder="Enter your name" /></div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group"><input className="form-control"  placeholder="Company (optioanl)" /></div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group"><input className="form-control"  placeholder="Your email" /></div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group"><input className="form-control"  placeholder="Phone number" /></div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group"><textarea className="form-control" placeholder="Your message or proejct description" /></div>
                                </div>
                                <div className="col-lg-12 mt-15"><button className="btn btn-black icon-arrow-right-white mr-40 mb-20" type="submit">Send Message</button><br className="d-lg-none d-block" /><span className="text-body-text-md color-gray-500 mb-20">By sending a message, you agree to our <a href="/terms">terms</a> and <a href="/policy">policy</a>,</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormProject;