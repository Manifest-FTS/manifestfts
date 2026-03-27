import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { StarIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import WPLanding from "../components/layout/WPLanding";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import dynamic from "next/dynamic";
import logo from "../public/assets/anim/mfts-animated-logo.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type JsonLdObject = {
  "@context": string;
  "@type": string;
  [key: string]: any;
};

const SITE_URL = "https://www.manifestfts.com/free-website";
const SITE_NAME = "Manifest FTS";
const PAGE_TITLE =
  "Free Website for Small Businesses & Nonprofits | Manifest FTS";
const PAGE_DESCRIPTION =
  "Get a professional website with no upfront website build cost. Manifest FTS helps small businesses and nonprofits launch a modern website with hosting, support, maintenance, backups, and SSL included.";
const OG_IMAGE = "https://www.manifestfts.com/assets/imgs/marketing/wordpress.jpg";

const testimonialHighlights = [
  {
    quote:
      "Working with ManifestFTS has truly been a breath of fresh air. Their innovative approach and technical expertise have helped us drive our mission forward in ways we never imagined.",
    name: "Christian Fuscarino",
    role: "Executive Director, Garden State Equality",
  },
  {
    quote:
      "ManifestFTS did an amazing job transforming our online presence. Their attention to detail and commitment to our mission have been invaluable, and we’re thrilled with the results.",
    name: "Kevin Adams",
    role: "Founder, Waterfall Keepers of NC & NC Waterfalls",
  },
  {
    quote:
      "Kevin and his team are true professionals—efficient, skilled, and reliable. They consistently deliver quality work that helps us stand out in a competitive industry.",
    name: "Vanessa Nastri",
    role: "CEO, Barclay Rex Cigars",
  },
];

function WordPressLandingPage() {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const logoAnimationStyle = { width: 225 };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isFormVisible ? "hidden" : "auto";
    }

    return function cleanup() {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
      }
    };
  }, [isFormVisible]);

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  const serviceJsonLd = useMemo(function buildServiceJsonLd(): JsonLdObject {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Free Website Program",
      serviceType: "Website Design, Hosting, and Ongoing Support",
      provider: {
        "@type": "Organization",
        name: "Manifest FTS",
        url: "https://www.manifestfts.com",
      },
      areaServed: "US",
      url: SITE_URL,
      description: PAGE_DESCRIPTION,
      offers: [
        {
          "@type": "Offer",
          name: "Basic",
          price: "149",
          priceCurrency: "USD",
          url: SITE_URL + "#plans",
        },
        {
          "@type": "Offer",
          name: "Professional",
          price: "298",
          priceCurrency: "USD",
          url: SITE_URL + "#plans",
        },
      ],
    };
  }, []);

  const organizationJsonLd = useMemo(function buildOrganizationJsonLd(): JsonLdObject {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Manifest FTS",
      url: "https://www.manifestfts.com",
      logo: "https://www.manifestfts.com/favicon.ico",
      sameAs: [],
    };
  }, []);

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData: any = {};
    Array.from(
      e.currentTarget.elements as HTMLCollectionOf<HTMLElement>
    ).forEach(function collectFields(field) {
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        if (!field.name) {
          return;
        }
        formData[field.name] = field.value;
      }
    });

    try {
      setIsSubmitting(true);
      setStatus("submitting");

      const intakePayload = {
        businessName: formData.businessName || formData.name || "",
        contactName: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        businessCategory: formData.organizationType || "",
        businessDescription: formData.message || "",
        serviceArea: "",
        websiteStatus: formData.websiteUrl ? "active_site" : "no_site",
        desiredPages: "",
        primaryGoal: formData.primaryGoal || "visibility",
        servicesOffered: "",
        preferredStyleTone: "",
        socialLinks: "",
        googleBusinessProfileStatus: "unsure",
        domainStatus: "unsure",
        logoStatus: "unsure",
        imageUploadNotes: "",
        notesSpecialRequests:
          "Selected Plan: " +
          (selectedPlan || "N/A") +
          "\nWebsite URL: " +
          (formData.websiteUrl || "N/A") +
          "\nPrimary Goal: " +
          (formData.primaryGoal || "N/A") +
          "\nBest Time To Call: " +
          (formData.bestTimeToCall || "N/A") +
          "\nMessage: " +
          (formData.message || ""),
        templateAcknowledged: true,
        upgradeInterests: {
          advancedSEO: false,
          copywritingContentHelp: false,
          blogContentStrategy: false,
          domainEmailSetup: false,
          hostingMaintenance: true,
          customDesignFeatures: false,
        },
      };

      const mailRes = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formType: "freeWebsiteIntake",
          selectedPlan: selectedPlan,
        }),
      });

      const intakeRes = await fetch("/api/free-website/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(intakePayload),
      });

      if (mailRes.ok && intakeRes.ok) {
        setIsFormVisible(false);
        setStatus("success");
        toast.success(
          "Thanks for reaching out. We will review your request and get back to you soon.",
          { duration: 12000 }
        );
      } else {
        setStatus("error");
        toast.error("Something went wrong. Please try again.", {
          duration: 12000,
        });
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast.error("Error submitting the form.", { duration: 12000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSelectPlan(plan: string) {
    setSelectedPlan(plan);
    setIsFormVisible(true);
  }

  function handleCloseForm() {
    setIsFormVisible(false);
  }

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="free website, small business website, nonprofit website, managed WordPress support, website maintenance, website hosting, WordPress website plans, affordable web design"
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <link rel="canonical" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
      </Head>

      <WPLanding>
        <section className="relative overflow-hidden relative bg-gradient-to-r from-blue-300 via-teal-300 to-cyan-300 text-white flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <div className="header-logo mb-6">
                <div className="mx-auto max-w-[223px]">
                  <Lottie
                    animationData={logo}
                    loop={false}
                    style={logoAnimationStyle}
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Free Website for Small Businesses & Nonprofits
              </h1>

              <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-white/95">
                Most people check online before they decide to contact, book, or
                donate. We help you launch a modern, credible website with ongoing support starting at just
                $149/month.
              </p>

              <div className="mt-7 flex items-center justify-center">
                <Link href="#plans">
                  <a className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900 transition-colors duration-300 w-full sm:w-auto">
                    Start My Free Website
                  </a>
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-sm md:text-base">
                <div className="rounded-lg bg-white/15 backdrop-blur-sm px-4 py-4 items-center justify-center">
                  No large website design and build costs
                </div>
                <div className="rounded-lg bg-white/15 backdrop-blur-sm px-4 py-4 items-center justify-center">
                  Hosting, backups, SSL, and support included
                </div>
                <div className="rounded-lg bg-white/15 backdrop-blur-sm px-4 py-4 flex items-center justify-center">
                  Cancel anytime*
                </div>
              </div>

              <p className="mt-5 text-sm text-white/90">
                *{" "}
                <Link href="/terms#section-13">
                  <a
                    className="underline hover:text-yellow-200"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms & Conditions
                  </a>
                </Link>{" "}
                apply.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-4 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why a better website matters
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                A modern online presence helps people trust you faster, find you
                more easily, and follow through when they are ready to take
                action.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  81%
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">
                  People check online first
                </h3>
                <p className="mt-3 text-gray-600">
                  Before they contact, book, or donate, most people look up an
                  organization online. Your website often decides whether they
                  move forward.
                </p>
              </motion.div>

              <motion.div
                className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  20%+
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">
                  Better mobile experience, better conversions
                </h3>
                <p className="mt-3 text-gray-600">
                  Improving speed and mobile usability often leads to a
                  noticeable lift in inquiries, signups, or donations.
                </p>
              </motion.div>

              <motion.div
                className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  2x–10x
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">
                  More inquiries is possible
                </h3>
                <p className="mt-3 text-gray-600">
                  When a site is clear, search-friendly, and easy to use, many
                  small organizations see a meaningful increase in engagement.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-full min-h-[360px] h-[420px] rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/assets/imgs/marketing/wordpress.jpg"
                  alt="Modern website support and maintenance by Manifest FTS"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
                Built for practical growth
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What you actually get
              </h2>

              <p className="mt-4 text-lg text-gray-600">
                This is not just hosting. We help you launch a clean, credible
                site that is easier to maintain and easier for people to trust.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-10 h-10 mt-0.5 text-green-600" />
                    <div className="items-start align-text-top">
                      <h3 className="font-semibold text-gray-900 line-height-[47px]">
                        Professional launch
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        A polished template-based website that helps you look
                        credible online.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-10 h-10 mt-0.5 text-green-600" />
                    <div className="items-start align-text-top">
                      <h3 className="font-semibold text-gray-900 line-height-[47px]">
                        Hosting + security
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        SSL, backups, maintenance, and core managed essentials
                        included.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-10 h-10 mt-0.5 text-green-600" />
                    <div className="items-start align-text-top">
                      <h3 className="font-semibold text-gray-900 line-height-[47px]">
                        Better visibility
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Basic SEO setup to help people find you when they search for your services or mission online.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white border border-gray-200 p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="w-10 h-10 mt-0.5 text-green-600" />
                    <div className="items-start align-text-top">
                      <h3 className="font-semibold text-gray-900 line-height-[47px]">
                        Ongoing help
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        You receive monthly support hours for edits and updates and a trusted technology partner.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-4 py-16 bg-gradient-to-r from-slate-500 via-indigo-300 to-blue-300 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="max-w-3xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200">
                Client voices
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold">
                Trusted by organizations doing meaningful work
              </h2>
              <p className="my-3 text-white/80 text-lg">
                Highlights from teams we have supported across nonprofit,
                local business, and mission-driven projects.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialHighlights.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="relative rounded-xl border border-white/15 bg-white p-6 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45 + index * 0.1 }}
                >
                  <div className="absolute -top-3 right-4 text-5xl leading-none text-slate-950">
                    “
                  </div>
                  <p className="text-black leading-relaxed">{item.quote}</p>
                  <div className="mt-5 pt-4 border-t border-white/15">
                    <p className="font-semibold text-black">{item.name}</p>
                    <p className="text-sm text-slate-950">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="plans" className="w-full px-4 py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Choose your support plan
              </h2>
              <p className="mt-2 mb-6 text-lg text-gray-600">
                Start lean, stay supported, and upgrade only if and when it
                makes sense.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg flex flex-col justify-between"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
              >
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
                    Starter Presence
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Basic
                  </h3>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">
                    $149
                    <span className="text-base font-medium text-gray-600">
                      /month
                    </span>
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Best for small businesses and nonprofits that need a clean,
                    credible online presence without large build costs.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Free template-based website launch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Up to 5 core pages + optional blog setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Basic SEO setup for visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Contact form or inquiry capture setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>2 hours of monthly support/edits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>SSL, backups, updates, and managed essentials</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={function openStarter() {
                    handleSelectPlan("starter");
                  }}
                  className={
                    "w-full mt-8 py-3 rounded-lg text-white font-semibold transition-colors duration-300 " +
                    (selectedPlan === "starter"
                      ? "bg-blue-600"
                      : "bg-gray-900 hover:bg-black")
                  }
                >
                  {selectedPlan === "starter" ? "Selected" : "Select Basic"}
                </button>
              </motion.div>

              <motion.div
                className="bg-white border-2 border-blue-300 p-6 rounded-xl shadow-xl flex flex-col justify-between relative"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55 }}
              >
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-md">
                  Most Popular
                </div>

                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-3">
                    Growth Focused
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Professional
                  </h3>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">
                    $298
                    <span className="text-base font-medium text-gray-600">
                      /month
                    </span>
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Best for organizations that want more visibility, stronger
                    content structure, and steady growth support.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Expanded site structure up to 10 pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>SEO-enriched service or location page support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Monthly optimization recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>4 hours of monthly support/updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Simple performance snapshot and guidance</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={function openGrowth() {
                    handleSelectPlan("growth");
                  }}
                  className={
                    "w-full mt-8 py-3 rounded-lg text-white font-semibold transition-colors duration-300 " +
                    (selectedPlan === "growth"
                      ? "bg-blue-600"
                      : "bg-indigo-700 hover:bg-indigo-800")
                  }
                >
                  {selectedPlan === "growth"
                    ? "Selected"
                    : "Select Professional"}
                </button>
              </motion.div>

              <motion.div
                className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg flex flex-col justify-between"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65 }}
              >
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-3">
                    Guided Fit Call
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Request a Call Back
                  </h3>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">
                    Contact Us
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    Best for teams that want help choosing the right path before
                    launching.
                  </p>

                  <ul className="mt-6 space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>Book a guided call to map goals and constraints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>
                        Best for unique requirements or phased growth plans
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>
                        Discuss SEO, content scope, integrations, and support
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>Get realistic next steps and recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <StarIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>No pressure, just clarity</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={function openGuided() {
                    handleSelectPlan("guided_onboarding");
                  }}
                  className={
                    "w-full mt-8 py-3 rounded-lg text-white font-semibold transition-colors duration-300 " +
                    (selectedPlan === "guided_onboarding"
                      ? "bg-blue-600"
                      : "bg-amber-700 hover:bg-amber-800")
                  }
                >
                  {selectedPlan === "guided_onboarding"
                    ? "Selected"
                    : "Request a Call Back"}
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 px-6 md:px-12 py-12 md:py-16 shadow-xl border border-blue-200">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Flexible support, no long-term lock-in
                </h2>
                <p className="mt-4 text-lg text-gray-900">
                  We are offering this program to help more organizations get
                  online without the usual upfront costs and friction. If it is a fit, we
                  will help you move forward. If it is not, you can cancel
                  anytime.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link href="#plans">
                    <a className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900 transition-colors duration-300 w-full sm:w-auto">
                      Get Started
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <motion.div
          className={
            "fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center " +
            (isFormVisible ? "block" : "hidden")
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: isFormVisible ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="bg-white p-4 md:p-8 max-w-[92%] md:max-w-5xl mx-auto max-h-[90vh] rounded-2xl shadow-lg relative overflow-auto">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-gray-600 text-3xl z-10"
              aria-label="Close form"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedPlan === "guided_onboarding"
                ? "Request a Call Back"
                : "Tell us about your site"}
            </h2>
            <p className="text-gray-600 mb-6">
              A few quick details and we will follow up shortly.
            </p>

            <form
              className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 overflow-y-auto pb-6 form-scrollbar"
              onSubmit={handleOnSubmit}
            >
              <input type="hidden" name="formType" value="freeWebsiteIntake" />
              <input type="hidden" name="selectedPlan" value={selectedPlan} />

              <div className="flex flex-col">
                <label htmlFor="name" className="block text-lg text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="block text-lg text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone" className="block text-lg text-gray-700">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="businessName"
                  className="block text-lg text-gray-700"
                >
                  Business or Organization Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your organization name"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="organizationType"
                  className="block text-lg text-gray-700"
                >
                  Organization Type
                </label>
                <select
                  id="organizationType"
                  name="organizationType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="small_business">Small Business</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="community_organization">
                    Community Organization
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="primaryGoal"
                  className="block text-lg text-gray-700"
                >
                  Primary Goal
                </label>
                <select
                  id="primaryGoal"
                  name="primaryGoal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="visibility">Get found online</option>
                  <option value="leads">Get more inquiries</option>
                  <option value="donations">Increase donations</option>
                  <option value="credibility">Look more credible</option>
                  <option value="refresh">Refresh an outdated website</option>
                </select>
              </div>

              <div className="col-span-2 flex flex-col">
                <label
                  htmlFor="message"
                  className="block text-lg text-gray-700"
                >
                  Tell us about your goals and needs
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[140px]"
                  placeholder="What would you like us to help with?"
                  required
                />
              </div>

              {selectedPlan === "guided_onboarding" ? (
                <>
                  <div className="col-span-2 flex flex-col">
                    <label
                      htmlFor="bestTimeToCall"
                      className="block text-lg text-gray-700"
                    >
                      Best Time To Call (Optional)
                    </label>
                    <input
                      type="text"
                      id="bestTimeToCall"
                      name="bestTimeToCall"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Example: Weekdays after 2 PM EST"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="contactPreference"
                      className="block text-lg text-gray-700"
                    >
                      Preferred Contact Method
                    </label>
                    <select
                      id="contactPreference"
                      name="contactPreference"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select one</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </div>
                </>
              ) : null}

              <div className="col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={
                    "w-full py-3 rounded-lg my-2 md:my-4 font-semibold transition-colors duration-300 " +
                    (isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900")
                  }
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>

                {status === "success" ? (
                  <p className="text-sm text-green-700 mt-2">
                    Your submission has been sent successfully.
                  </p>
                ) : null}

                {status === "error" ? (
                  <p className="text-sm text-red-700 mt-2">
                    Something went wrong. Please try again.
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </motion.div>
      </WPLanding>
    </>
  );
}

export default WordPressLandingPage;