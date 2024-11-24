import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import WPLanding from "../components/layout/WPLanding";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

// Function to handle form submission
const WordPressLandingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: any = {};
    Array.from(e.currentTarget.elements as HTMLCollectionOf<HTMLElement>).forEach((field) => {
      // Ensure field is an HTMLInputElement or similar
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
        if (!field.name) return;
        formData[field.name] = field.value;
      }
    });

    try {
      const res = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Close the form modal
        setIsFormVisible(false);
        // Show success toast notification
        toast.success("Thank you for your submission! We'll get back to you soon.", {
          duration: 30000 // 30 seconds
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          duration: 30000 // 30 seconds
        });
        setStatus(false);
      }
    } catch (error) {
      toast.error("Error submitting the form.");
    }
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsFormVisible(true); // Show the form in lightbox
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Close the form
  };

  return (
    <>
      <Head>
        <title>WordPress Hosting Solutions - Fast & Reliable | ManifestFTS</title>
        <meta name="description" content="Discover managed WordPress hosting services. WordPress hosting for seamless performance, security, and uptime. Let our expert engineers optimize your website." />
        <meta name="keywords" content="WordPress hosting, managed WordPress hosting, WordPress support, fast hosting, reliable hosting, WordPress security, performance optimization" />
        <meta property="og:title" content="Premium WordPress Hosting | ManifestFTS" />
        <meta property="og:description" content="Experience top-tier WordPress hosting with expert management and fast, secure, and reliable hosting services tailored to your needs." />
        <meta property="og:image" content="URL_to_image.jpg" />
        <meta property="og:url" content="https://yourdomain.com/wp-hosting" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium WordPress Hosting | ManifestFTS" />
        <meta name="twitter:description" content="Optimized WordPress hosting for businesses and hobbyists. Scalable, secure, and managed by experts to ensure your website performs at its best." />
        <meta name="twitter:image" content="URL_to_image.jpg" />
        <link rel="canonical" href="https://yourdomain.com/wp-hosting" />
      </Head>
      <WPLanding>
        {/* Hero Section with Animated Ethereal Background */}
        <section className="relative bg-gradient-to-r from-pink-300 via-indigo-300 to-blue-300 text-white py-24 flex flex-col items-center justify-center mb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-0"></div>
          <motion.div
            className="relative z-10 text-center mx-3 md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
              Don&rsquo;t Just Host Your WordPress Site, <br /> Let Experts Manage It
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="mt-4 text-xl">
                With our expert WordPress engineers, your site will grow with you.
                From seamless migrations to performance optimization, we&rsquo;re here to
                handle the technical aspects so you can focus on your business.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Hosting Plan Selection */}
        <section className="w-full px-3 my-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center text-dark mb-8">Choose Your WordPress Hosting Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-semibold text-dark">Starter</h4>
                <p className="mt-2 text-gray-600 text-base font-bold">$39/month</p>
                <ul className="mt-4 text-gray-600">
                  <li>1 WordPress Install</li>
                  <li>25,000 Monthly Visits</li>
                  <li>10GB Storage</li>
                  <li>50GB Bandwidth</li>
                  <li>Daily Backups</li>
                  <li>Free SSL</li>
                  <li>Quarterly WordPress Maintenance</li>
                </ul>
                <button
                  onClick={() => handleSelectPlan("starter")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "starter" ? "bg-blue-600" : "bg-gray-500"} transition-colors duration-300`}
                >
                  {selectedPlan === "starter" ? "Selected" : "Select Plan"}
                </button>
              </motion.div>

              {/* Growth Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-semibold text-dark">Growth</h4>
                <p className="mt-2 text-gray-600 text-base font-bold">$149/month</p>
                <ul className="mt-4 text-gray-600">
                  <li>Everything in <em>Starter</em> +</li>
                  <li>100,000 Monthly Visits</li>
                  <li>20GB Storage</li>
                  <li>200GB Bandwidth</li>
                  <li>Performance Insights</li>
                  <li>Quarterly WordPress Maintenance & Security Analysis</li>
                </ul>
                <button
                  onClick={() => handleSelectPlan("growth")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "growth" ? "bg-blue-600" : "bg-gray-500"}`}
                >
                  {selectedPlan === "growth" ? "Selected" : "Select Plan"}
                </button>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h4 className="text-xl font-semibold text-dark">Enterprise</h4>
                <p className="mt-2 text-gray-600 text-base font-bold">Custom Pricing</p>
                <ul className="mt-4 text-gray-600">
                  <li>Everything in <em>Growth</em> +</li>
                  <li>100k+ Monthly Visits</li>
                  <li>50GB+ Storage</li>
                  <li>500GB+ Bandwidth</li>
                  <li>Dedicated DevOps Support</li>
                  <li>Custom Performance Insights/Reports</li>
                  <li>Custom Add-ons & Integrations</li>
                </ul>
                <button
                  onClick={() => handleSelectPlan("enterprise")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "enterprise" ? "bg-blue-600" : "bg-gray-500"}`}
                >
                  {selectedPlan === "enterprise" ? "Selected" : "Select Plan"}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="w-full px-3 my-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center text-dark mb-8">Why Choose ManifestFTS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-pink-200 hover:to-yellow-200 transform transition duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-dark">Professional WordPress Engineers</h3>
                <p className="mt-2 text-gray-600">
                  Our professional engineers don&apos;t just host your site. We stay on top of maintenance, security, and performance so that your website is always secure and running smoothly.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-indigo-200 hover:to-blue-300 transform transition duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-dark">Proactive Maintenance</h3>
                <p className="mt-2 text-gray-600">
                  Stay ahead of security risks and performance issues with ongoing monitoring, updates, and optimizations. We ensure your site is always ready for what comes next.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-green-300 hover:to-teal-400 transform transition duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-dark">One Stop Shop</h3>
                <p className="mt-2 text-gray-600">
                  We are always ready with tailored WordPress solutions, whether you&apos;re scaling your website, adding custom features, or need help with design and development.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enter to Win Section */}
        <section className="w-full px-3 my-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-12 py-24 rounded-lg shadow-xl text-center">
              <div className="mx-auto max-w-5xl">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">Enter to Win 20 Free Development Hours</h2>
                <p className="mb-4 text-lg text-gray-900">
                  Sign up or migrate your WordPress site today and you&rsquo;re automatically entered to win 10 development hours for site migration, redesign/redevelopment, or improvements. ($800 value).
                </p>
                <p className="text-xs text-gray-900">
                  *Winners announced on our <Link href="/ahead-with-fts"><span className="text-blue-600">Ahead with FTS</span></Link> blog starting the first month of each quarter.<br/>Promo starts 11/11/2023. Winners announced at the beginning of each quarter: January (for Q1), April (for Q2), July (for Q3), and October (for Q4).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Do More With WordPress Section */}
        <section className="w-full px-3 my-16 mb-32">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center text-dark mb-8">Do More With WordPress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/hobbyist-podcaster.jpg" 
                    alt="Hobbyists" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">For Hobbyists</h3>
                <p className="mt-4 text-gray-600">Create your blog, portfolio, or creative website with ease. Affordable, fast, and fully supported, we&apos;ve got you covered.</p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/business.jpg" 
                    alt="Business Websites" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">For Businesses</h3>
                <p className="mt-4 text-gray-600">Take your business online with a scalable WordPress solution that ensures speed, security, and ongoing support.</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/enterprise.jpg" 
                    alt="Enterprises" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">For Enterprises</h3>
                <p className="mt-4 text-gray-600">Leverage WordPress for your large-scale site with custom features, security, performance optimization, and more.</p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/tech-code.jpg" 
                    alt="Advanced REST API Integration" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Advanced REST API Integration</h3>
                <p className="mt-4 text-gray-600">Integrate powerful third-party tools with the WordPress REST API to enhance your site&apos;s functionality and performance.</p>
              </motion.div>

              {/* Card 5 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/wordpress.jpg" 
                    alt="Headless WordPress with React/Next.js" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Headless WordPress with React/Next.js</h3>
                <p className="mt-4 text-gray-600">Unlock faster performance and more flexibility with a headless WordPress setup using React/Next.js for frontend rendering.</p>
              </motion.div>

              {/* Card 6 */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image 
                    src="/assets/imgs/marketing/bespoke.jpg" 
                    alt="Bespoke Solutions" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Bespoke Solutions Tailored to You</h3>
                <p className="mt-4 text-gray-600">From bespoke design to custom development, we create tailored solutions that help your business thrive.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Form Lightbox (hidden initially) */}
        <motion.div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${isFormVisible ? "block" : "hidden"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFormVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white p-4 md:p-8 max-w-[90%] md:max-w-6xl mx-auto max-h-[90%] rounded-lg shadow-lg relative overflow-hidden">
            {/* Close Icon */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-600 text-3xl"
            >
              &times;
            </button>
            <h2 className="text-3xl mb-4">Tell Us About Your Site</h2>
            
            {/* Form container */}
            <form className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 overflow-y-auto max-h-[80vh] pr-8 pb-6 form-scrollbar">
              <input type="hidden" name="selectedPlan" value={selectedPlan} />
              
              {/* Full Name */}
              <div className="flex flex-col">
                <label htmlFor="name" className="block text-lg text-gray-600">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="block text-lg text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="phone" className="block text-lg text-gray-600">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>
              
              {/* Website URL */}
              <div className="flex flex-col">
                <label htmlFor="websiteUrl" className="block text-lg text-gray-600">Website URL (Optional)</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your website URL"
                />
              </div>
              
              {/* Services */}
              <div className="flex flex-col">
                <label htmlFor="services" className="block text-lg text-gray-600">Do you need any non-hosting services?</label>
                <select
                  id="services"
                  name="services"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              
              {/* Multiple Sites */}
              <div className="flex flex-col">
                <label htmlFor="multipleSites" className="block text-lg text-gray-600">Do you have multiple WordPress sites?</label>
                <select
                  id="multipleSites"
                  name="multipleSites"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              
              {/* Message */}
              <div className="col-span-2 flex flex-col">
                <label htmlFor="message" className="block text-lg text-gray-600">Tell us about your goals and needs. What brought you here today?</label>
                <textarea
                  name="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="What would you like us to do for you?"
                  required
                />
              </div>
              
              {/* Submit Button */}
              <button type="submit" className="w-full py-3 bg-black text-white rounded-lg my-2 md:my-5 hover:bg-gradient-to-r hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500">
                Start My Migration
              </button>
            </form>
          </div>
        </motion.div>
      </WPLanding>
    </>
  );
};

export default WordPressLandingPage;
