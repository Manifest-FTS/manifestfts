import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { StarIcon } from '@heroicons/react/16/solid';
import Countdown from 'react-countdown';
import WPLanding from "../components/layout/WPLanding";
import logo from '../public/assets/anim/mfts-animated-logo.json';
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Function to handle form submission
const WordPressLandingPage = () => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [nextQuarter, setNextQuarter] = useState<Date | null>(null);
  const [status, setStatus] = useState<string>("");

  // Function to determine the next quarter's start date
  const getNextQuarterDate = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month is zero-indexed

    let nextQuarterStartMonth;
    if (currentMonth < 3) {
      nextQuarterStartMonth = 0; // Q1 (January)
    } else if (currentMonth < 6) {
      nextQuarterStartMonth = 3; // Q2 (April)
    } else if (currentMonth < 9) {
      nextQuarterStartMonth = 6; // Q3 (July)
    } else {
      nextQuarterStartMonth = 9; // Q4 (October)
    }

    // If it's past the start of the quarter, move to the next quarter
    if (currentMonth >= nextQuarterStartMonth) {
      nextQuarterStartMonth = nextQuarterStartMonth + 3;
    }

    // Set the date to the first day of the next quarter
    const nextQuarterDate = new Date(currentDate.getFullYear(), nextQuarterStartMonth, 1);
    return nextQuarterDate;
  };

  useEffect(() => {
    const nextQuarterDate = getNextQuarterDate();
    setNextQuarter(nextQuarterDate);

    const currentDate = new Date();
    if (currentDate < nextQuarterDate) {
      setStatus("Upcoming"); // Countdown until next quarter
    } else {
      setStatus("Ended"); // If the current date is after the next quarter date
    }
  }, []); // Empty dependency array means this runs once on mount

  // Countdown renderer
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      if (status === "Upcoming") {
        return <span>Drawing Time! 🎉</span>;
      } else {
        return <span>Drawing Ended!</span>;
      }
    } else {
      return (
        <div>
          <p className="font-bold text-lg">{days}d {hours}h {minutes}m {seconds}s</p>
        </div>
      );
    }
  };

  // disable scroll when modal open
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isFormVisible) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }, [isFormVisible]);

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

    if (selectedPlan === "guided_onboarding" && (!formData.preferredDate || !formData.preferredTime)) {
      toast.error("Please select your preferred date and time for guided onboarding.");
      return;
    }

    try {
      const intakePayload = {
        businessName: formData.businessName || formData.name || "",
        contactName: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        businessCategory: "",
        businessDescription: formData.message || "",
        serviceArea: "",
        websiteStatus: formData.websiteUrl ? "active_site" : "no_site",
        desiredPages: "",
        primaryGoal: "visibility",
        servicesOffered: "",
        preferredStyleTone: "",
        socialLinks: "",
        googleBusinessProfileStatus: "unsure",
        domainStatus: "unsure",
        logoStatus: "none",
        imageUploadNotes: "",
        notesSpecialRequests: `Selected Plan: ${selectedPlan || "N/A"}\nWebsite URL: ${formData.websiteUrl || "N/A"}\nMultiple Sites: ${formData.multipleSites || "N/A"}\nPreferred Onboarding Date: ${formData.preferredDate || "N/A"}\nPreferred Onboarding Time: ${formData.preferredTime || "N/A"}\nTimezone: ${formData.timezone || "N/A"}\nContact Preference: ${formData.contactPreference || "N/A"}\nMessage: ${formData.message || ""}`,
        templateAcknowledged: true,
        upgradeInterests: {
          advancedSEO: false,
          copywritingContentHelp: false,
          blogContentStrategy: false,
          domainEmailSetup: false,
          hostingMaintenance: false,
          customDesignFeatures: false,
        },
      };

      const [mailRes, intakeRes] = await Promise.all([
        fetch("/api/mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            formType: "freeWebsiteIntake",
            selectedPlan,
          }),
        }),
        fetch("/api/free-website/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(intakePayload),
        }),
      ]);

      if (mailRes.ok && intakeRes.ok) {
        // Close the form modal
        setIsFormVisible(false);
        // Show success toast notification
        console.log("Form submitted successfully!");
        toast.success("Thank you for your submission! We'll get back to you soon.", {
          duration: 30000 // 30 seconds
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          duration: 30000 // 30 seconds
        });
        setStatus("error"); // Update the status to a string
      }
    } catch (error) {
      toast.error("Error submitting the form.");
      console.error(error);
      setStatus("error"); // Update the status to a string
    }
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsFormVisible(true); // Show the form in lightbox
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Close the form
  };

  const style = {
    width: 225,
  };

  return (
    <>
      <Head>
        <meta name="description" content="Discover managed WordPress hosting services. WordPress hosting for seamless performance, security, and uptime. Let our expert engineers optimize your website." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
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
        <section className="relative bg-gradient-to-r from-blue-300 via-teal-300 to-cyan-300
 text-white py-24 flex flex-col items-center justify-center mb-24">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-0"></div>
          <motion.div
            className="relative z-10 text-center mx-3 md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="header-logo">
              <div className="mx-auto max-w-[223px]">
                <Lottie animationData={logo} loop={false} style={style} />
              </div>
            </div>
            <h1 className="max-w-2xl mx-auto text-5xl font-extrabold text-white leading-tight my-4">Free Website for Your Small Business
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="mt-4 text-lg">ManifestFTS is helping small business owners go digital — with no upfront cost for the website. You get a professional, modern site, and we manage everything for you. Just $149/month for ongoing support. Cancel anytime.*</p>

              <Link href="#plans">
                <a className="inline-block px-5 py-2 mt-12 max-w-[350px] text-base text-black text-center mx-auto rounded-md backdrop-blur-4xl
                  bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
                  animate-gradient hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600">
                  Explore Plans
                </a>
              </Link>
            </div>
            <p className="mt-4 text-sm text-white">
              *<Link href="/terms#section-13">
                <a className="underline hover:text-yellow-200" target="_blank">Terms & Conditions</a>
              </Link> apply.
            </p>
          </motion.div>
        </section>


        {/* Hosting Plan Selection */}
        <section id="plans" className="w-full px-3 my-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center text-dark mb-8">Choose Your Website Support Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h4 className="text-xl font-semibold text-dark">Basic</h4>
                  <p className="mt-2 text-gray-600 text-base font-bold">$149/month</p>
                  <ul className="mt-4 text-gray-600">
                    <li>Free Website</li>
                    <li>5 Pages + Blog</li>
                    <li>2 Hours of Monthly Support</li>
                    <li>10GB Storage</li>
                    <li>50GB Bandwidth</li>
                    <li>Daily Backups</li>
                    <li>Free SSL</li>
                    <li>Quarterly WordPress Maintenance</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan("starter")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "starter" ? "bg-blue-600" : "bg-gray-500"} transition-colors duration-300`}
                >
                  {selectedPlan === "starter" ? "Selected" : "Select Plan"}
                </button>
              </motion.div>

              {/* Growth Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h4 className="text-xl font-semibold text-dark">Professional</h4>
                  <p className="mt-2 text-gray-600 text-base font-bold">$298/month</p>
                  <ul className="mt-4 text-gray-600">
                    <li>Everything in <em>Basic</em> +</li>
                    <li>10 pages + Blog</li>
                    <li>2 Custom Feature at Setup</li>
                    <li>Total 5 Hours of Monthly Support</li>
                    <li>20GB Storage</li>
                    <li>200GB Bandwidth</li>
                    <li>Performance Insights</li>
                    <li>Quarterly WordPress Maintenance & Security Analysis</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan("growth")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "growth" ? "bg-blue-600" : "bg-gray-500"}`}
                >
                  {selectedPlan === "growth" ? "Selected" : "Select Plan"}
                </button>
              </motion.div>

              {/* Enterprise Plan */}
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:translate-y-[-10px] transition-all duration-300 flex flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h4 className="text-xl font-semibold text-dark">Guided Onboarding</h4>
                  <p className="mt-2 text-gray-600 text-base font-bold">Contact Us</p>
                  <ul className="mt-4 text-gray-600">
                    <li>• Best for advanced or unique project requirements</li>
                    <li>• Book a guided onboarding call with our team</li>
                    <li>• Share timeline, integrations, and complexity upfront</li>
                    <li>• Get a right-fit recommendation and next steps</li>
                    <li>• Includes migration and architecture discussion</li>
                    <li>• Ideal for custom functionality and scale planning</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleSelectPlan("guided_onboarding")}
                  className={`w-full mt-6 py-2 text-white ${selectedPlan === "guided_onboarding" ? "bg-blue-600" : "bg-gray-500"}`}
                >
                  {selectedPlan === "guided_onboarding" ? "Selected" : "Contact Us"}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enter to Win Section */}
        <section id="drawing" className="w-full px-3 my-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-12 py-24 rounded-lg shadow-xl text-center">
              <div className="mx-auto max-w-5xl">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">Cancel Anytime</h2>
                <p className="mb-4 text-lg text-gray-900">
                  We believe in flexibility. If our service no longer suits your business, you can cancel your subscription at any time with no penalties or hidden fees.
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
                    alt="Small Business Websites"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Small Business Websites</h3>
                <p className="mt-4 text-gray-600">Need a simple online presence? We create sleek, mobile-ready sites tailored to your brand and goals.</p>
              </motion.div>

              {/* Card 2 - Industry average placeholder (replaces Mid-Level Platforms) */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image
                    src="/assets/imgs/marketing/business.jpg"
                    alt="Mid-Level Platforms"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Online Presence Drives Growth</h3>
                <p className="mt-4 text-gray-600">Industry average: small businesses can see around <strong>XX% more inquiries</strong> after launching a clear, mobile-friendly website.</p>
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
                <p className="mt-4 text-gray-600">We build powerful ERP systems for inventory, HR, finance, and more. Tailored for growing companies.</p>
              </motion.div>

              {/* Card 4 - Industry average placeholder (replaces Custom Software Development) */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image
                    src="/assets/imgs/marketing/tech-code.jpg"
                    alt="Custom Software Development"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Customers Research Before They Call</h3>
                <p className="mt-4 text-gray-600">Industry average: around <strong>XX% of buyers</strong> check a business online before deciding to contact or book.</p>
              </motion.div>

              {/* Card 5 - Industry average placeholder (replaces Third-Party Integrations) */}
              <motion.div
                className="bg-white p-6 rounded-lg shadow-lg group overflow-hidden transform transition duration-300 hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-48 mb-4 group-hover:scale-110 transform transition duration-300">
                  <Image
                    src="/assets/imgs/marketing/bespoke.jpg"
                    alt="Third-Party Integrations"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Fast Sites Convert Better</h3>
                <p className="mt-4 text-gray-600">Industry average: improving speed and mobile experience can lift conversion rates by <strong>XX%</strong> or more for local businesses.</p>
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
                    src="/assets/imgs/marketing/wordpress.jpg"
                    alt="Ongoing Support & Strategy"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-dark">Ongoing Support & Strategy</h3>
                <p className="mt-4 text-gray-600">We don’t just build and leave. We support your system and help you adapt your tech as you grow.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="relative bg-gradient-to-r from-pink-300 via-indigo-300 to-blue-300 text-white py-24 flex flex-col items-center justify-center mb-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl text-center text-dark mb-8">Why Choose Manifest?</h2>
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
                <h3 className="text-xl font-semibold text-dark">Full-Service Provider</h3>
                <p className="mt-2 text-gray-600">
                  We are always ready with tailored WordPress solutions, whether you&apos;re scaling your website, adding custom features, or need help with design and development.
                </p>
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
          <div className="bg-white p-4 md:p-8 max-w-[90%] md:max-w-6xl mx-auto max-h-[90vh] rounded-lg shadow-lg relative overflow-auto">
            {/* Close Icon */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-600 text-3xl z-10"
            >
              &times;
            </button>
            <h2 className="text-3xl mb-4">Tell Us About Your Site</h2>

            {/* Form container - Improved for mobile scrolling */}
            <form
              className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 overflow-y-auto pb-6 form-scrollbar"
              onSubmit={handleOnSubmit}
            >
              <input type="hidden" name="formType" value="freeWebsiteIntake" />
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


              {/* Phone */}
              <div className="flex flex-col">
                <label htmlFor="businessName" className="block text-lg text-gray-600">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your business name"
                />
              </div>

              {/* Website URL */}
              <div className="flex flex-col">
                <label htmlFor="websiteUrl" className="block text-lg text-gray-600">Website URL If You Have One Already (Optional)</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your website URL"
                />
              </div>

              {/* Multiple Sites */}
              <div className="flex flex-col">
                <label htmlFor="multipleSites" className="block text-lg text-gray-600">Do you have multiple sites?</label>
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

              {selectedPlan === "guided_onboarding" && (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="preferredDate" className="block text-lg text-gray-600">Preferred Date</label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="preferredTime" className="block text-lg text-gray-600">Preferred Time</label>
                    <input
                      type="time"
                      id="preferredTime"
                      name="preferredTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="timezone" className="block text-lg text-gray-600">Timezone</label>
                    <input
                      type="text"
                      id="timezone"
                      name="timezone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. EST"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="contactPreference" className="block text-lg text-gray-600">Preferred Contact Method</label>
                    <select
                      id="contactPreference"
                      name="contactPreference"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="either">Either</option>
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button type="submit" className="w-full py-3 bg-black text-white rounded-lg my-2 md:my-5 hover:bg-gradient-to-r hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500">
                Send
              </button>
            </form>
          </div>
        </motion.div>
      </WPLanding>
    </>
  );
};

export default WordPressLandingPage;
