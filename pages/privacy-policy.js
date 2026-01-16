/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../components/layout/Layout";


function Terms() {
    return (
        <>
            <Layout>
                <section className="section-box mt-50 mb-50">
                    <div className="container text-center">
                        <h1 className="text-heading-1">Policy</h1>
                    </div>
                </section>
                <section className="section-box mt-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mx-auto">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div className="table-of-content">
                                            <h6 className="mb-15">Table of content</h6>
                                            <ul>
                                                <li>
                                                    <Link href="#section-1"><a>Your Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-2"><a>Your Personal Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-3"><a>Your Non-Personal Data</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-4"><a>Cookies</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-5"><a>Mobile Apps</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-6"><a>Data Deletion &amp; Your Rights</a></Link>
                                                </li>
                                                <li>
                                                    <Link href="#section-7"><a>Consent</a></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="single-detail">
                                            <h1 className="">Privacy Policy</h1>
                                            <h6 className="mt-50">- Last Updated January 16, 2026 -</h6>
                                            <p>This is the Privacy Policy of Super Distros LLC dba Manifest FTS (&ldquo;Manifest&rdquo;). If you have any concerns about privacy and personal data you may contact dp@manifestfts.com.</p>
                                            <p>This Privacy Policy applies to all Manifest services, including our website, mobile applications (such as MADE IT and future apps), and any other digital products or services we provide.</p>
                                            <p>This Privacy Policy is part of our Terms of Service: <Link href="/terms"><a>https://manifestfts.com/terms</a></Link>.</p>
                                            
                                            <h6 className="mt-35 mb-25" id="section-1">Your data</h6>
                                            <p>Manifest collects personal and non-personal information such as name, address, contact phone number, email, browser type, operating system, device type, referring website or app, and the date and time of each website or app visit. We may also collect personal information that you volunteer when you subscribe to our newsletter, fill out a form, create an account, or engage in services with us.</p>

                                            <h6 className="mt-35 mb-25" id="section-2">How We Use Your Personal Data?</h6>
                                            <p>Manifest&rsquo;s primary purpose in collecting personal information is to communicate with you, personalize your user experience, and to send you relevant information. We will never sell, lease, or share your data with third-parties without your notice.</p>

                                            <h6 className="mt-35 mb-25" id="section-3">How We Use Your Non-Personal Data?</h6>
                                            <p>Non-Personal data or data provided for use in The Customer&rsquo;s paid services are used to fulfill paid services. This data may be used by the software solutions used in said services according to the software solution&rsquo;s own privacy policies.</p>
                                            
                                            <h6 className="mt-35 mb-25" id="section-4">Cookies</h6>
                                            <p>Cookies are small data stores used by websites that are stored on a visitor&rsquo;s computer and that the visitor&rsquo;s browser provides to the website each time the visitor returns. Manifest uses cookies to identify visitors, improve their user experience and to track their usage of our website. Visitors who do not wish to have cookies placed on their computer can disable cookies within their browser before accessing our website.</p>

                                            <h6 className="mt-35 mb-25" id="section-5">Mobile Apps</h6>
                                            <p>Manifest develops and publishes mobile applications for iOS and Android platforms, including but not limited to MADE IT (kitchen recipe assistant and grocery list manager) and other productivity and utility apps.</p>
                                            <p><strong>Data Collection in Mobile Apps:</strong> Our mobile apps may collect the following types of information:</p>
                                            <ul>
                                                <li><strong>Account Information:</strong> Email address, name, and profile information when you create an account</li>
                                                <li><strong>Usage Data:</strong> Information about how you use the app, including features accessed, recipes saved, lists created, and interaction patterns</li>
                                                <li><strong>Device Information:</strong> Device type, operating system version, unique device identifiers, and mobile network information</li>
                                                <li><strong>User-Generated Content:</strong> Recipes, grocery lists, notes, photos, and other content you create or upload within the app</li>
                                                <li><strong>Location Data:</strong> With your permission, some apps may access your location to provide location-based features</li>
                                            </ul>
                                            <p><strong>How We Use Mobile App Data:</strong> Data collected through our mobile apps is used to:</p>
                                            <ul>
                                                <li>Provide and improve app functionality and user experience</li>
                                                <li>Sync your data across devices when you use the same account</li>
                                                <li>Send you app-related notifications and updates (which you can opt out of in app settings)</li>
                                                <li>Analyze app performance and identify bugs or issues</li>
                                                <li>Personalize content and recommendations within the app</li>
                                            </ul>
                                            <p><strong>Data Storage:</strong> User-generated content and account information may be stored on secure cloud servers to enable synchronization across devices. You maintain ownership of all content you create in our apps.</p>
                                            <p><strong>Third-Party Services:</strong> Our mobile apps may integrate with third-party services (such as authentication providers, analytics services, or cloud storage). These services operate under their own privacy policies, which we encourage you to review.</p>
                                            <p><strong>Permissions:</strong> Our apps will request only the permissions necessary for their functionality. You can manage app permissions through your device settings at any time.</p>

                                            <h6 className="mt-35 mb-25" id="section-6">Data Deletion &amp; Your Rights</h6>
                                            <p><strong>Your Right to Delete Your Data:</strong> You have the right to request deletion of your personal data and account at any time. We provide multiple ways to exercise this right:</p>
                                            <p><strong>In-App Account Deletion:</strong> For mobile apps that require account creation (such as MADE IT), you can delete your account and all associated data directly from within the app:</p>
                                            <ul>
                                                <li>Navigate to Account Settings or Profile within the app</li>
                                                <li>Select &ldquo;Delete Account&rdquo; or &ldquo;Delete My Data&rdquo;</li>
                                                <li>Confirm your deletion request</li>
                                            </ul>
                                            <p><strong>What Gets Deleted:</strong> When you delete your account, the following data is permanently removed from our systems:</p>
                                            <ul>
                                                <li>Your account information (email, profile, preferences)</li>
                                                <li>All user-generated content (recipes, grocery lists, notes, photos, and any other content you created)</li>
                                                <li>All stored files and images associated with your account</li>
                                                <li>Your authentication credentials and login access</li>
                                            </ul>
                                            <p><strong>Important Distinction:</strong> Please note that uninstalling or deleting the app from your device does NOT delete your account or data from our servers. To permanently delete your data, you must use the in-app &ldquo;Delete Account&rdquo; feature or contact us directly.</p>
                                            <p><strong>Email-Based Deletion Request:</strong> If you prefer, or if you no longer have access to the app, you can request account deletion by emailing us at dp@manifestfts.com with the subject line &ldquo;Account Deletion Request.&rdquo; Please include:</p>
                                            <ul>
                                                <li>The email address associated with your account</li>
                                                <li>The name of the app (e.g., MADE IT)</li>
                                                <li>Any additional identifying information to help us locate your account</li>
                                            </ul>
                                            <p>We will process your deletion request within 30 days and send you confirmation once completed.</p>
                                            <p><strong>Data Retention After Deletion:</strong> Once your account is deleted, all personal data is permanently removed from our active systems. Some anonymized usage data may be retained for analytics purposes, but this data cannot be linked back to you personally. Backup copies may persist in our backup systems for up to 90 days before being permanently purged.</p>
                                            <p><strong>Other Rights:</strong> In addition to deletion rights, you may also request to:</p>
                                            <ul>
                                                <li>Access a copy of your personal data</li>
                                                <li>Correct inaccurate personal data</li>
                                                <li>Export your data in a portable format</li>
                                                <li>Opt-out of marketing communications</li>
                                            </ul>
                                            <p>To exercise any of these rights, contact us at dp@manifestfts.com.</p>

                                            <h6 className="mt-35 mb-25" id="section-7">Consent</h6>
                                            <p>By using the Manifest website or any of our mobile applications, you consent to this privacy policy.</p>
                                            
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-2">
                                        <h3 className="text-heading-6 color-gray-400 mb-20 mt-150">Share</h3>
                                        <Link href="https://facebook.com"><a className="share-social share-fb" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link><br />
                                        <Link href="https://twitter.com"><a className="share-social share-tw" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link><br />
                                        <Link href="https://www.pinterest.com"><a className="share-social share-pi" target="_blank" rel="noreferrer" rel="noreferrer" ></a></Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
               
            </Layout>

        </>
    )
}

export default Terms;