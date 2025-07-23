/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import eCommerce from '../../public/assets/anim/ecommerce-product.json';
import chartUp from '../../public/assets/anim/chart-up.json';
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function Service2() {
  return (
    <>

      <Layout>
        <section className="section-box">
          <div className="banner-hero bg-service-2">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h1 className="text-display-2">Barclay Rex: eCommerce After over <span className="color-green-900">111 Years of
                    History</span> In New York City.</h1>
                  <p className="text-body-lead-large color-gray-500 mt-40 pr-40">In 1910, an Italian immigrant, Vincent Nastri, opened a cigar store in New York City. Now, over 111 years later, his grandchildren continue that legacy as they work to implement eCommerce. In 2020 Barclay Rex Celebrated its 110th anniversary and enjoys the title of the oldest cigar shop in New York City. </p>
                  <div className="mt-40 text-center">
                    <Link href="#case-study" ><a rel="noreferrer" className="btn btn-black icon-arrow-down-white">Continue Reading</a></Link>

                    <Link href="https://barclayrex.com" ><a target="_blank" className="btn btn-link icon-arrow-right color-gray-900 ml-10">Visit barclayrex.com</a></Link>
                  </div>
                </div>
                <div className="col-lg-12 d-none d-lg-block">
                  <div className="row">
                    <div className="col-lg-2" />
                    <div className="col-lg-8" id="case-study">
                      <div className="banner-imgs">
                        <img src="/assets/imgs/work/rex-f1.webp" alt="Barclay Rex Responsive Website" />
                      </div>
                    </div>
                    <div className="col-lg-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-box">
          <div className="container mt-70 re-order">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-12 mb-30 first">
                <h3 className="text-heading-1 mt-30">Over <span className="color-violet-600">5 years</span><br />of partnership</h3>
                <p className="text-body-lead-large color-gray-600 mt-30">In 2018, ManifestFTS was hired to create a one-page marketing site for Barclay Rex and a separate site for the cigar club. In June 2018, Manifest started working with Vanessa Nastri to create a WordPress website that could be managed internally. We have been partnering with Barclay Rex to implement eCommerce to complement the physical storefronts ever since.</p>
                <div className="row">
                  <div className="col-12 mt-50">
                    <h2 className="text-heading-7 text-center color-gray-900 mb-10">Services And Software Used in 2018:</h2>
                    <ul className="list-partners border-0">
                      <li>
                        <Link href="/#"><a className="item-logo box-hover-shadow hover-up"><img alt="WordPress" src="/assets/imgs/logos/wordpress.svg" />
                        </a></Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12 second">
                <div className="inner-image"><img className="bdrd-16 img-responsive" src="/assets/imgs/case-studies/rex-01.webp" alt="Olver versions of the Barclay Rex website." />
                  {/* <div className="block-image-bottom"><img className="bdrd-16 img-responsive" src="/assets/imgs/page/homepage2/img-built-2.png" alt="Agon" /></div> */}
                </div>
              </div>
            </div>
          </div>

          <div className="container mt-70">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-12">
                <div className="block px-0 w-full mx-auto mobAnim">
                  <Lottie animationData={eCommerce} />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12 mb-30">
                <h3 className="text-heading-1 mt-30">Expanding <br /><span className="color-violet-600">the Reach</span></h3>
                <p className="text-body-lead-large color-gray-600 mt-30">Before 2018, Barclay Rex was limited to selling in NYC only, out of physical locations. The challenge of moving into eCommerce included finding an online payment service built for the added tax requirements for tobacco sales. The WordPress web application built in 2018 was a marketing landing page and, eventually, a blog and online reservations platform.</p>
                <p className="text-body-lead-large color-gray-600 mt-30">2022 saw an evolution in the web platform as ManifestFTS rebuilt the website on the Strapi API-First CMS with integrated SnipCart eCommerce. This allowed Barclay Rex to add and manage inventory internally, including local pickup or shipping options. Barclay Rex could reach and engage with patrons across the continental United States for the first time.</p>
                <p className="text-body-lead-large color-gray-600 mt-30">We succeeded in creating a space where Barclay Rex could bring together 100 years of loyal customers and convey the brand&rsquo;s history to a new digital audience.</p>
              </div>
            </div>
          </div>

          <div className="container mt-70 re-order">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-12 mb-30 first">
                <h3 className="text-heading-1 mt-30">Quantifying Results.<br /><span className="color-violet-600">Data-Driven Success.</span></h3>
                <p className="text-body-lead-large color-gray-600 mt-30">Barclay Rex is continuing to expand their eCommerce product lists. Vanessa Nastri confirmed that they had seen a <span className="color-violet-600 font-bold">10% increase in sales</span> since the opening of their eCommerce store. She is confident that with continued marketing efforts, the transition into eCommerce will continue to build on the success of the past 111 years. </p>
              </div>
              <div className="col-lg-6 col-sm-12 second">
                <div className="block px-0 w-full mx-auto mobAnim">
                  <Lottie animationData={chartUp} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-box pt-40 pb-40 mt-60 bg-dark">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="text-center">
                  <p className="text-body-lead-large color-white mt-10 mb-20">If you&rsquo;re ready to work with us on your next venture, click the button below.<br />For those interested in the technical details of this project, <Link href="#continue" className="color-white">continue reading below</Link>.
                  </p>
                  <Link href="/#get-started"><a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-10">Get Started</a></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-box" id="continue">
          <div className="container mt-90">
            <div className="text-center">
              <span className="tag-1 bg-6 color-green-900 mr-20 px-4 py-2 rounded-md">
                Forward Thinking Solutions
              </span>
              <h3 className="text-heading-1 mt-30">Technology Stack and Implementations</h3>
            </div>
            <div className="row">
              <div className="col-12 mt-50">
                <h2 className="text-heading-7 text-center color-gray-900 mb-10">
                  Powered by
                </h2>
                <ul className="list-partners border-0">
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Adobe"
                          src="/assets/imgs/logos/adobe.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Bootstrap"
                          src="/assets/imgs/logos/tailwindcss.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Strapi CMS"
                          src="/assets/imgs/logos/strapi.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Next.js"
                          src="/assets/imgs/logos/nextjs.svg"
                        />
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/#">
                      <a className="item-logo box-hover-shadow hover-up">
                        <img
                          alt="Vercel"
                          src="/assets/imgs/logos/vercel.svg"
                        />
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-body-lead-large color-gray-600 mt-10">
              Creating a seamless and effective eCommerce platform for Barclay Rex required an ensemble of cutting-edge technological tools, carefully curated for maximum efficiency.</p>

            <h4 className="text-heading-2 mt-30">Data & Design</h4>
            <p className="text-body-lead-large color-gray-600 mt-10">Our collaboration with Barclay Rex allowed us to use the power of <span className="color-violet-600 font-bold">Strapi</span>, an open-source headless CMS. This became the heart of Barclay Rex&rsquo;s content management system, enabling them to swiftly make edits and manage their content with ease and precision. Strapi ensured information was secure yet accessible, revolutionizing their ability to manage website copy changes.</p>
            <p className="text-body-lead-large color-gray-600 mt-30">In synergy with Strapi, <span className="color-violet-600 font-bold">SnipCart&rsquo;</span> capabilities streamlined Barclays&rsquo; online sales, making purchasing their signature tobacco products a breeze. From a simple click, customers could now order products and even reserve lounge spots through <span className="color-violet-600 font-bold">OpenTable</span>, offering a truly integrated and dynamic shopping experience.</p>
            <p className="text-body-lead-large color-gray-600 mt-30">For design and conceptualization, we employed <span className="color-violet-600 font-bold">Adobe Creative Suite</span>, leveraging its wide array of tools to shape a visually appealing and user-friendly digital interface.</p>

            <h4 className="text-heading-2 mt-30">Development & Hosting</h4>
            <p className="text-body-lead-large color-gray-600 mt-10">Our team utilized the potent combination of <span className="color-violet-600 font-bold">React, Next.js,</span> and <span className="color-violet-600 font-bold">TailwindCSS</span> for the frontend development, bringing together responsiveness, scalability, and aesthetics. These powerful frameworks helped us create a robust, future-proof online presence that not only serves current needs but is also geared for growth.</p>
            <p className="text-body-lead-large color-gray-600 mt-30">Hosting is crucial in ensuring a smooth user experience, and that&rsquo;s where <span className="color-violet-600 font-bold">Vercel</span> and <span className="color-violet-600 font-bold">Heroku</span> stepped in. These platforms deliver a seamless and reliable hosting solution, ensuring the Barclay Rex website is always accessible and performs optimally, regardless of traffic volume.</p>
            <p className="text-body-lead-large color-gray-600 mt-30">Overall, our technological stack was a meticulously chosen assortment of powerful tools, each playing a crucial role in transforming Barclay Rex&rsquo;s digital presence and eCommerce capabilities.
            </p>
          </div>
        </section>

        <section className="section-box pt-40 pb-40 mt-60 bg-dark">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="text-center">
                  <p className="text-body-lead-large color-white mt-10 mb-20">Ready to supercharge your own project?<br />Tap that button below and let&rsquo;s let&rsquo;s manifest it.
                  </p>
                  <Link href="/#get-started"><a className="btn btn-default icon-arrow-right color-gray-900 ml-20 btn-mb mb-10">Get Started</a></Link>
                </div>
              </div>
            </div>
          </div>
        </section>


      </Layout>

    </>
  )
}

export default Service2;