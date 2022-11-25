import FormProject from "../../components/form-project/FormProject";
import Layout from "../../components/layout/Layout";


function Contact() {
    return (
        <>
            <Layout>
                <section className="section-box">
                    <div className="banner-hero bg-8 banner-breadcrums">
                        <div className="container text-center">
                            <h1 className="text-heading-2 color-gray-1000 mb-20">Contact Us</h1>
                            {/* <p className="text-body-text color-gray-500">Connect with us regarding an upcoming project or for a consultation.</p> */}
                        </div>
                    </div>
                </section>
                
                
                <section className="section-box mt-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-sm-10 col-12 mt-40">
                                <h2 className="text-heading-1 color-gray-900 mb-20">Virtually or In-Person</h2>
                                <p className="text-body-lead-large color-gray-600 mt-20">Manifest is a distributed digital consultancy and software development agency that empowers forward-thinking brands through digital manifestations.</p><p className="text-body-lead-large color-gray-600 mt-20">Our expertise spans brand and digital strategy, user experience design, software development, implementation, and data systems. We are a value-driven agency working with some of the most talented professionals to drive results.</p>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-100">
                        <div className="row">
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="list-icons hover-up">
                                    <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/SVG/usa.svg" alt="NC, USA" /></span>
                                        <h4 className="text-heading-4">Haw Creek Commons</h4>
                                        <p className="text-body-text color-gray-1100 mt-15">315 Old Haw Creek Rd,<br />Asheville, NC 28805, US<br />Phone: (828) 229-2450<br/>Email: partner@manifestfts.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="list-icons hover-up">
                                    <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/SVG/usa.svg" alt="NC, USA" /></span>
                                        <h4 className="text-heading-4">Büro Hollywood</h4>
                                        <p className="text-body-text color-gray-1100 mt-15">2031 Harrison St, <br />Hollywood, FL 33020, US<br />Phone: (828) 229-2450<br/>Email: partner@manifestfts.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 col-sm-12">
                                <div className="list-icons hover-up">
                                    <div className="item-icon"><span className="icon-left"><img src="/assets/imgs/mexico.png" alt="NC, USA" /></span>
                                        <h4 className="text-heading-4">The Co-Op Baja</h4>
                                        <p className="text-body-text color-gray-1100 mt-15">Camino Las Playitas y esquina,<br />Telmex, Las Tunas, 23300 <br/>Todos Santos, B.C.S., MX<br />Email: partner@manifestfts.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <FormProject />

            </Layout>

        </>
    )
}

export default Contact;