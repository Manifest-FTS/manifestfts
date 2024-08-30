/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../../components/layout/Layout";

function Blog2() {
  return (
    <>
      <Layout>
        <div>
          <section className="section-box">
            <div className="banner-hero banner-breadcrums bg-gray-100">
              <div className="container text-center">
                <div className="row">
                  <div className="col-lg-12">
                    <h1 className="text-display-3 color-gray-900 mb-20">
                      Ahead with FTS
                    </h1>
                    <p className="text-heading-6 mb-20 box-mw-610 mx-auto">
                      Explore &lsquo;Ahead with FTS&rsquo;, our insights blog
                      offering deep insights into emerging technology trends,
                      digital marketing strategies, and forward-thinking
                      solutions to empower businesses for future growth. Keep up
                      with our latest articles and be at the forefront of
                      innovation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box">
            <div className="container mt-70">
              <div className="row">
                <div className="col-lg-1 col-sm-1 col-12" />
                <div className="col-lg-10 col-sm-10 col-12 text-center">
                  <h2 className="text-heading-1 color-gray-900">
                    Featured Articles
                  </h2>
                </div>
                <div className="col-lg-1 col-sm-1 col-12" />
              </div>
            </div>

            <div className="container mt-40">
              <div className="row border-bottom">
                {/* article 1 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link
                        href="/ahead-with-fts/upgrading-to-google-analytics-4-the-time-is-now"
                        passHref
                      >
                        <img
                          src="/assets/imgs/blog/thumb-google-dash.webp"
                          alt="Google Analytics Dashboard Overview"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link
                        href="/ahead-with-fts/upgrading-to-google-analytics-4-the-time-is-now"
                        passHref
                      >
                        Upgrading to Google Analytics 4: Why the Time is Now!
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      On July 1, 2023, Google Universal Analytics 3 (GA3), the
                      analytics tool that marketers and businesses worldwide
                      have come to rely on, is heading into the sunset.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-kevinw.jpg"
                          alt="Kevin Williams, author of Upgrading to Google Analytics 4 article"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Kevin Williams
                      </h4>
                      <p className="text-body-small color-gray-500">
                        July 7, 2023
                      </p>
                    </div>
                  </div>
                </div>

                {/* article 2 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link
                        href="/ahead-with-fts/leveraging-ai-unleashing-the-future-today"
                        passHref
                      >
                        <img
                          src="/assets/imgs/blog/thumb-ai-touch.webp"
                          alt="Leveraging Artificial Intelligence"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link
                        href="/ahead-with-fts/leveraging-ai-unleashing-the-future-today"
                        passHref
                      >
                        Leveraging AI: Unleashing the Future Today
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      Explore how artificial intelligence can revolutionize
                      processes, boost productivity, and offer unique customer
                      experiences. Stay Ahead with FTS.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-kevinw.jpg"
                          alt="Kevin Williams, author of Leveraging AI"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Kevin Williams
                      </h4>
                      <p className="text-body-small color-gray-500">
                        May 11, 2023
                      </p>
                    </div>
                  </div>
                </div>

                {/* article 3 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link
                        href="/ahead-with-fts/the-future-of-work-preparing-for-a-hybrid-workplace"
                        passHref
                      >
                        <img
                          src="/assets/imgs/blog/thumb-future-office.webp"
                          alt="Hybrid Workplace"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link
                        href="/ahead-with-fts/the-future-of-work-preparing-for-a-hybrid-workplace"
                        passHref
                      >
                        The Future of Work: Preparing for a Hybrid Workplace
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      Unpack the potential of a hybrid workplace model in
                      fostering productivity and employee satisfaction.
                      Future-proof your workspace with FTS.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-kevinw.jpg"
                          alt="Kevin Williams, author of The Future Hybrid Workplace"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Kevin Williams
                      </h4>
                      <p className="text-body-small color-gray-500">
                        May 4, 2023
                      </p>
                    </div>
                  </div>
                </div>

                {/* article 4 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link
                        href="/ahead-with-fts/boost-your-sales-and-leads-with-the-power-of-effective-ui-ux-design"
                        passHref
                      >
                        <img
                          src="/assets/imgs/blog/ui-ux-1.jpg"
                          alt="UI/UX Design Concepts"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link
                        href="/ahead-with-fts/boost-your-sales-and-leads-with-the-power-of-effective-ui-ux-design"
                        passHref
                      >
                        Boost Your Sales and Leads with the Power of Effective UI/UX Design
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      In today&rsquo;s digital age, your website or application is
                      often the first interaction, potential customers have with
                      your brand.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-bashark.jpg"
                          alt="Kevin Williams, author of UI/UX design article"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Bashar Khan
                      </h4>
                      <p className="text-body-small color-gray-500">
                        June 5, 2024
                      </p>
                    </div>
                  </div>
                </div>

                {/* article 5 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link href="/ahead-with-fts/ai-revolution-transforming-business" passHref>
                        <img
                          src="/assets/imgs/blog/ai.png"
                          alt="AI Revolution in Business"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link href="/ahead-with-fts/ai-revolution-transforming-business" passHref>
                        The AI Revolution: Transforming Business in the 21st
                        Century
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      Artificial Intelligence (AI) is no longer a futuristic
                      concept; it is a present reality that is fundamentally
                      transforming the business landscape.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-bashark.jpg"
                          alt="Kevin Williams, author of UI/UX design article"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Bashar Khan
                      </h4>
                      <p className="text-body-small color-gray-500">
                        June 6, 2024
                      </p>
                    </div>
                  </div>
                </div>

                {/* article 6 */}
                <div className="col-lg-4 col-sm-6 pr-30 mb-50">
                  <div className="card-grid-style-4">
                    <div className="grid-4-img mb-20">
                      <Link href="/ahead-with-fts/transform-business-with-cutting-edge-web-app" passHref>
                        <img
                          src="/assets/imgs/blog/web-development.png"
                          alt="Web App Development"
                        />
                      </Link>
                    </div>
                    <h2 className="text-heading-4">
                      <Link href="/ahead-with-fts/transform-business-with-cutting-edge-web-app" passHref>
                        Transform Your Business with Cutting-Edge Web App
                        Development
                      </Link>
                    </h2>

                    <p className="text-body-text color-gray-500 mt-5">
                      In today&rsquo;s digital age, Web
                      applications (web apps) play a crucial role in connecting
                      businesses with their customers, streamlining operations,
                      and driving growth.
                    </p>
                    <div className="blog-img-user">
                      <div className="img-user img-user-round">
                        <img
                          src="/assets/imgs/blog/author-bashark.jpg"
                          alt="Bashar Khan, author of web app development article"
                        />
                      </div>
                      <h4 className="text-heading-6 color-gray-900">
                        Kevin Williams
                      </h4>
                      <p className="text-body-small color-gray-500">
                        June 10, 2024
                      </p>
                    </div>
                  </div>
                </div>
                {/* articles  */}
                {/* <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-list-style-1">
                                        <Link href="/blog-single"><a className="text-heading-6">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="blog-img-user">
                                            <div className="img-user img-user-round"><img src="/assets/imgs/page/blog/2/user-3.png" alt="Agon" /></div>
                                            <h4 className="text-body-lead color-gray-500">Jane Cooper</h4>
                                            <p className="text-body-small color-gray-500">August 25, 2022</p>
                                        </div>
                                        <div className="style-1-img color-bg-10">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/blog/2/img-news-1.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                    <div className="card-list-style-1">
                                        <Link href="/blog-single"><a className="text-heading-6">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="blog-img-user">
                                            <div className="img-user img-user-round"><img src="/assets/imgs/page/blog/2/user-4.png" alt="Agon" /></div>
                                            <h4 className="text-body-lead color-gray-500">Wade Warren</h4>
                                            <p className="text-body-small color-gray-500">August 25, 2022</p>
                                        </div>
                                        <div className="style-1-img color-bg-2">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/blog/2/img-news-1.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                    <div className="card-list-style-1">
                                        <Link href="/blog-single"><a className="text-heading-6">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="blog-img-user">
                                            <div className="img-user img-user-round"><img src="/assets/imgs/page/blog/2/user-5.png" alt="Agon" /></div>
                                            <h4 className="text-body-lead color-gray-500">Jenny Wilson</h4>
                                            <p className="text-body-small color-gray-500">August 25, 2022</p>
                                        </div>
                                        <div className="style-1-img color-bg-5">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/blog/2/img-news-1.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                    <div className="card-list-style-1">
                                        <Link href="/blog-single"><a className="text-heading-6">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="blog-img-user">
                                            <div className="img-user img-user-round"><img src="/assets/imgs/page/blog/2/user-6.png" alt="Agon" /></div>
                                            <h4 className="text-body-lead color-gray-500">Robert Fox</h4>
                                            <p className="text-body-small color-gray-500">August 25, 2022</p>
                                        </div>
                                        <div className="style-1-img color-bg-9">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/blog/2/img-news-1.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>*/}
              </div>
            </div>
          </section>

          {/* <section className="section-box">
                        <div className="container mt-100">
                            <div className="row">
                                <div className="col-lg-1 col-sm-1 col-12" />
                                <div className="col-lg-10 col-sm-10 col-12 text-center">
                                    <h2 className="text-heading-1 color-gray-900 mb-10">Latest News</h2>
                                    <p className="text-body-lead-large color-gray-600 mt-20">From Our blog and Event fanpage</p>
                                </div>
                                <div className="col-lg-1 col-sm-1 col-12" />
                            </div>
                        </div>
                        <div className="container mt-90">
                            <div className="row">
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Company</span>
                                        <Link href="/blog-single"><a className="text-heading-4">We can blend colors multiple ways, the most common
                                        </a></Link>

                                        <div className="grid-4-img color-bg-9">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-1.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Marketing Event</span>
                                        <Link href="/blog-single"><a className="text-heading-4">How To Blow Through Capital At An Incredible Rate
                                        </a></Link>

                                        <div className="grid-4-img color-bg-6">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-2.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Customer Services</span>
                                        <Link href="/blog-single"><a className="text-heading-4">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="grid-4-img color-bg-4">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-3.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Company</span>
                                        <Link href="/blog-single"><a className="text-heading-4">We can blend colors multiple ways, the most common
                                        </a></Link>

                                        <div className="grid-4-img color-bg-2">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-4.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Marketing Event</span>
                                        <Link href="/blog-single"><a className="text-heading-4">How To Blow Through Capital At An Incredible Rate
                                        </a></Link>

                                        <div className="grid-4-img color-bg-8">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-5.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Customer Services</span>
                                        <Link href="/blog-single"><a className="text-heading-4">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="grid-4-img color-bg-1">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-6.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Company</span>
                                        <Link href="/blog-single"><a className="text-heading-4">We can blend colors multiple ways, the most common
                                        </a></Link>

                                        <div className="grid-4-img color-bg-2">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-7.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Marketing Event</span>
                                        <Link href="/blog-single"><a className="text-heading-4">How To Blow Through Capital At An Incredible Rate
                                        </a></Link>

                                        <div className="grid-4-img color-bg-8">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-8.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4"><span className="tag-dot">Customer Services</span>
                                        <Link href="/blog-single"><a className="text-heading-4">Design Studios That Everyone Should Know About?
                                        </a></Link>

                                        <div className="grid-4-img color-bg-1">
                                            <Link href="/blog-single"><a><img src="/assets/imgs/page/homepage1/img-news-9.png" alt="Agon" />
                                            </a></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20 mb-30 text-center">
                                <Link href="/blog-1"><a className="btn btn-black icon-arrow-right-white">Load more posts
                                </a></Link>
                            </div>
                        </div>
                    </section>
                    <section className="section-box overflow-visible mb-100">
                        <div className="container mt-100">
                            <div className="row">
                                <div className="col-lg-10 mx-auto">
                                    <div className="bg-2 box-newsletter position-relative">
                                        <div className="row">
                                            <div className="col-lg-5 col-md-7"><span className="text-body-capitalized color-gray-500 text-uppercase">newsletter</span>
                                                <h4 className="text-heading-2 mb-10 mt-10">Subscribe our newsletter</h4>
                                                <p className="text-body-text color-gray-500">By clicking the button, you are agreeing with our</p>
                                                <Link href="/page-terms"><a>Term &amp; Conditions
                                                </a></Link>

                                                <div className="box-form-newsletter mt-30">
                                                    <form className="form-newsletter"><input className="input-newsletter"  placeholder="Enter you mail .." /><button className="btn btn-send" /></form>
                                                </div>
                                            </div>
                                            <div className="col-lg-7 col-md-5 mt-30 mt-lg-0 mt-md-30 mt-sm-30 position-relative text-end">
                                                <div className="block-chart shape-1"><img src="/assets/imgs/template/chart.png" alt="Agon" /></div><img className="img-responsive img-newsletter" src="/assets/imgs/template/img-newsletter.png" alt="Agon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> */}
        </div>
      </Layout>
    </>
  );
}

export default Blog2;
