import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarSquareIcon,
  CheckBadgeIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
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

type DataLayerEvent = {
  event: string;
  [key: string]: unknown;
};

type AttributionParams = {
  gclid: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

type HeroVariantKey = "a" | "b" | "c";

type HeroVariantContent = {
  headline: string;
  subtext: string;
};

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}

const SITE_URL = "https://www.manifestfts.com/free-website";
const SITE_NAME = "Manifest FTS";
const PAGE_TITLE =
  "Free Website for Small Businesses & Nonprofits | Manifest FTS";
const PAGE_DESCRIPTION =
  "Get a professional website with no upfront website build cost. Manifest FTS helps small businesses and nonprofits launch a modern website with hosting, support, maintenance, backups, and SSL included.";
const OG_IMAGE = "https://www.manifestfts.com/assets/imgs/marketing/wordpress.jpg";
const ATTRIBUTION_STORAGE_KEY = "manifest_free_website_attribution";

const defaultAttribution: AttributionParams = {
  gclid: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
};

const heroVariants: Record<HeroVariantKey, HeroVariantContent> = {
  a: {
    headline: "Get a higher-performing website with a dedicated tech partner",
    subtext:
      "No upfront build fee. We manage, maintain, and improve your website for $149/month.",
  },
  b: {
    headline: "Launch fast, stay supported, and keep improving every month",
    subtext:
      "Go live in days, then keep momentum with ongoing technical support and optimization.",
  },
  c: {
    headline: "Your dedicated tech partner for a website that keeps improving",
    subtext:
      "No upfront website build fee. Ongoing hosting, maintenance, and expert ownership for $149/month.",
  },
};

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

const alsoIncludedItems = [
  "Managed hosting (Flywheel-level infrastructure)",
  "SSL, backups, and updates",
  "DevOps-level support",
  "Access to experienced engineers",
  "Performance monitoring and improvements",
  "Ongoing technical maintenance",
];

const trustChips = [
  {
    label: "Dedicated Partner",
    icon: LifebuoyIcon,
  },
  {
    label: "Performance-Led",
    icon: ChartBarSquareIcon,
  },
  {
    label: "Ongoing Reliability",
    icon: ShieldCheckIcon,
  },
];

const valueCards = [
  {
    title: "Professional launch",
    description:
      "A polished website foundation that makes your business credible from the first click.",
    icon: SparklesIcon,
  },
  {
    title: "Hosting + security",
    description:
      "Managed infrastructure, SSL, backups, maintenance, and proactive technical oversight.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Better visibility",
    description:
      "Search-ready structure and technical improvements to help people find and trust you faster.",
    icon: RocketLaunchIcon,
  },
  {
    title: "Ongoing help",
    description:
      "Monthly support from experienced engineers so updates and fixes actually get done.",
    icon: WrenchScrewdriverIcon,
  },
];

const managedChecklist = [
  {
    title: "Website Setup",
    items: [
      "Professional launch and brand-aligned layout",
      "Core pages configured with conversion-ready structure",
      "Contact and lead capture setup",
      "Mobile-first performance checks before launch",
    ],
  },
  {
    title: "Business Functionality",
    items: [
      "Inquiry forms and email routing",
      "Service or program page structure support",
      "Basic analytics and event foundations",
      "Content update support through monthly hours",
    ],
  },
  {
    title: "Infrastructure",
    items: [
      "Managed hosting environment",
      "SSL, backups, and update cycles",
      "Security hardening and uptime oversight",
      "Release support from experienced engineers",
    ],
  },
  {
    title: "Growth & Support",
    items: [
      "Ongoing maintenance and troubleshooting",
      "Performance monitoring and optimization guidance",
      "SEO-friendly foundations for local discoverability",
      "A dedicated partner for technical ownership",
    ],
  },
];

const comparisonRows = [
  {
    label: "Cost over time",
    diy: "Low upfront, but hidden add-ons and time cost",
    freelancers: "Variable project fees and change-order risk",
    manifest: "Predictable monthly investment with support included",
  },
  {
    label: "Effort required from you",
    diy: "High - you manage setup, copy, and troubleshooting",
    freelancers: "Medium - project coordination and follow-ups required",
    manifest: "Low - we handle delivery, maintenance, and updates",
  },
  {
    label: "Ongoing support",
    diy: "Self-serve docs and ticket queues",
    freelancers: "Usually ad hoc or unavailable after launch",
    manifest: "Built-in monthly expert support and technical ownership",
  },
];

const placeholderPortfolioCards = [
  {
    label: "Local Service Website",
    industry: "Home Services",
  },
  {
    label: "Mission-Focused Nonprofit",
    industry: "Nonprofit",
  },
  {
    label: "Growth-Oriented Small Business",
    industry: "Professional Services",
  },
];

const placeholderCaseStudyCards = [
  {
    title: "Case Study Preview: Local Business Growth",
    result: "42% increase in qualified leads",
    badges: ["Lead Generation", "SEO Foundation"],
  },
  {
    title: "Case Study Preview: Nonprofit Visibility Lift",
    result: "2.1x increase in monthly engagement",
    badges: ["Mission Impact", "Content Structure"],
  },
];

const teamSupportAvatars = [
  {
    name: "Kevin Williams",
    role: "Engineering",
    src: "/assets/imgs/page/about/1/kevin_williams.webp",
  },
  {
    name: "Mohammed Masum",
    role: "Design",
    src: "/assets/imgs/page/about/1/mohammed_masum.webp",
  },
  {
    name: "Daniel Kane",
    role: "Product",
    src: "/assets/imgs/page/about/1/daniel_kane.webp",
  },
];

function readAttributionFromSearch(search: string): AttributionParams {
  const params = new URLSearchParams(search);
  return {
    gclid: params.get("gclid") || "",
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    utmTerm: params.get("utm_term") || "",
    utmContent: params.get("utm_content") || "",
  };
}

function hasAttributionValue(attribution: AttributionParams): boolean {
  return Object.values(attribution).some((value) => Boolean(value));
}

function readHeroVariantFromSearch(search: string): HeroVariantKey {
  const params = new URLSearchParams(search);
  const queryValue = (params.get("heroVariant") || "").toLowerCase();
  if (queryValue === "a" || queryValue === "b" || queryValue === "c") {
    return queryValue;
  }
  return "c";
}

function WordPressLandingPage() {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [attribution, setAttribution] = useState<AttributionParams>(defaultAttribution);
  const [heroVariant, setHeroVariant] = useState<HeroVariantKey>("c");
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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setHeroVariant(readHeroVariantFromSearch(window.location.search));

    const parsed = readAttributionFromSearch(window.location.search);
    const hasIncomingAttribution = hasAttributionValue(parsed);

    if (hasIncomingAttribution) {
      setAttribution(parsed);
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(parsed));
      return;
    }

    const stored = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      try {
        const parsedStored = JSON.parse(stored) as AttributionParams;
        setAttribution({
          ...defaultAttribution,
          ...parsedStored,
        });
      } catch (error) {
        console.warn("Could not parse stored attribution payload", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    if (checkoutStatus === "success") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "free_website_checkout_success",
      });
      toast.success("Checkout completed. Our team will start your onboarding shortly.", {
        duration: 10000,
      });
    }

    if (checkoutStatus === "cancelled") {
      toast("Checkout canceled. You can resume whenever you're ready.", {
        duration: 8000,
      });
    }
  }, []);

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

  function trackLeadFormSubmitSuccess() {
    if (typeof window === "undefined") {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit_success",
    });
  }

  function trackCheckoutStart(selectedPlanName: string, intakeId: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "free_website_checkout_start",
      selectedPlan: selectedPlanName,
      intakeId,
      gclid: attribution.gclid,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmTerm: attribution.utmTerm,
      utmContent: attribution.utmContent,
    });
  }

  async function submitMailWithRetry(payload: Record<string, unknown>) {
    const attempts = 2;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        const response = await fetch("/api/mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const body = await response.json().catch(function onJsonParseError() {
          return null;
        });

        if (response.ok && body?.status === "Ok") {
          return { ok: true, body };
        }

        if (attempt < attempts) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          continue;
        }

        return { ok: false, body };
      } catch (error) {
        if (attempt < attempts) {
          await new Promise((resolve) => setTimeout(resolve, 700));
          continue;
        }

        throw error;
      }
    }

    return { ok: false, body: null };
  }

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

      const isCheckoutPlan = selectedPlan === "starter" || selectedPlan === "growth";

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
          "\nGCLID: " +
          (attribution.gclid || "N/A") +
          "\nUTM Source: " +
          (attribution.utmSource || "N/A") +
          "\nUTM Medium: " +
          (attribution.utmMedium || "N/A") +
          "\nUTM Campaign: " +
          (attribution.utmCampaign || "N/A") +
          "\nUTM Term: " +
          (attribution.utmTerm || "N/A") +
          "\nUTM Content: " +
          (attribution.utmContent || "N/A") +
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
        marketingAttribution: {
          gclid: attribution.gclid,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          utmTerm: attribution.utmTerm,
          utmContent: attribution.utmContent,
        },
      };

      let intakeId = "";
      try {
        const intakeRes = await fetch("/api/free-website/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(intakePayload),
        });

        const intakeBody = await intakeRes.json().catch(() => ({}));
        intakeId = intakeBody?.id || "";

        if (!intakeRes.ok && intakeRes.status !== 202) {
          console.warn("Free website intake storage request failed", {
            status: intakeRes.status,
          });
          throw new Error("Unable to save your intake details.");
        }
      } catch (intakeError) {
        console.warn("Free website intake storage request failed", intakeError);
        if (isCheckoutPlan) {
          setStatus("error");
          toast.error("We could not start checkout. Please try again.", {
            duration: 12000,
          });
          return;
        }
      }

      if (isCheckoutPlan) {
        trackCheckoutStart(selectedPlan, intakeId || "pending");

        const checkoutResponse = await fetch("/api/free-website/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name || "",
            email: formData.email || "",
            businessName: formData.businessName || "",
            businessType: formData.organizationType || "",
            primaryGoal: formData.primaryGoal || "",
            selectedPlan,
            intakeId,
            gclid: attribution.gclid,
            utmSource: attribution.utmSource,
            utmMedium: attribution.utmMedium,
            utmCampaign: attribution.utmCampaign,
            utmTerm: attribution.utmTerm,
            utmContent: attribution.utmContent,
          }),
        });

        const checkoutBody = await checkoutResponse.json().catch(() => ({}));
        if (!checkoutResponse.ok || !checkoutBody?.checkoutUrl) {
          setStatus("error");
          toast.error(
            checkoutBody?.message || "Unable to launch checkout. Please try again.",
            {
              duration: 12000,
            }
          );
          return;
        }

        // Send intake emails before redirect so browser navigation does not cancel requests.
        const preCheckoutMailResult = await submitMailWithRetry({
          ...formData,
          formType: "freeWebsiteIntake",
          selectedPlan,
          intakeId,
        }).catch((mailError) => {
          console.warn("Pre-checkout intake email failed", mailError);
          return { ok: false, body: null };
        });

        if (!preCheckoutMailResult.ok) {
          console.warn("Pre-checkout intake email did not confirm success.");
        }

        window.location.href = checkoutBody.checkoutUrl;
        return;
      }

      const mailResult = await submitMailWithRetry({
        ...formData,
        formType: "freeWebsiteIntake",
        selectedPlan: selectedPlan,
      });

      if (!mailResult.ok) {
        setStatus("error");
        toast.error("Something went wrong. Please try again.", {
          duration: 12000,
        });
        return;
      }

      trackLeadFormSubmitSuccess();

      setIsFormVisible(false);
      setStatus("success");
      toast.success(
        "Thanks for reaching out. We will review your request and get back to you soon.",
        { duration: 12000 }
      );
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
        <section className="relative overflow-hidden bg-[#051225] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(12,164,150,0.34),transparent_45%),radial-gradient(circle_at_82%_26%,rgba(9,182,214,0.22),transparent_42%),radial-gradient(circle_at_55%_88%,rgba(16,185,129,0.16),transparent_38%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.6),rgba(2,6,23,0.86))]" />
          <div className="absolute inset-0 opacity-[0.16] [background-size:42px_42px] [background-image:linear-gradient(to_right,rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.22)_1px,transparent_1px)]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <div className="header-logo mb-6">
                  <div className="max-w-[223px]">
                    <Lottie
                      animationData={logo}
                      loop={false}
                      style={logoAnimationStyle}
                    />
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.04] tracking-tight text-balance text-white drop-shadow-[0_6px_24px_rgba(2,6,23,0.45)]">
                  {heroVariants[heroVariant].headline}
                </h1>

                <p className="mt-5 text-lg md:text-xl max-w-2xl text-slate-100 leading-relaxed font-medium">
                  {heroVariants[heroVariant].subtext}
                </p>

                <p className="mt-4 text-base md:text-lg max-w-2xl text-cyan-100 font-semibold">
                  You focus on your business - we handle everything technical.
                </p>

                <p className="mt-2 text-sm md:text-base max-w-2xl text-emerald-100 font-semibold">
                  No more dealing with broken plugins, outdated sites, or DIY builders.
                </p>

                <p className="mt-2 text-sm md:text-base max-w-2xl text-white/90">
                  Built for businesses serious about growth - not DIY website builders.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  <Link href="#plans">
                    <a className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-7 py-3.5 font-bold text-slate-950 ring-1 ring-cyan-100/70 shadow-[0_20px_42px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_24px_48px_rgba(34,211,238,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#051225] transition-all duration-300 w-full sm:w-auto">
                      Get Started Instantly
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  </Link>
                </div>

                <p className="mt-5 text-sm text-slate-100">
                  Cancel anytime, no contracts. *
                  <Link href="/terms#section-13">
                    <a
                      className="underline decoration-cyan-300/60 underline-offset-2 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 rounded-sm ml-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Terms apply
                    </a>
                  </Link>
                </p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                  {trustChips.map((chip) => (
                    <div
                      key={chip.label}
                      className="rounded-xl border border-white/32 bg-slate-900/55 backdrop-blur-sm px-4 py-3 flex items-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                    >
                      <chip.icon className="w-4 h-4 text-cyan-50" />
                      <span className="text-sm text-white font-semibold">{chip.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(34,211,238,0.28),transparent_62%)] blur-3xl" />

                <motion.div
                  className="relative mx-auto w-full max-w-[560px] rounded-3xl border border-white/28 bg-white/12 backdrop-blur-xl shadow-[0_30px_85px_rgba(3,7,18,0.56)] overflow-hidden"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="px-5 py-3 border-b border-white/18 bg-white/10 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                    <div className="ml-3 h-7 rounded-lg bg-white/14 border border-white/18 flex-1 flex items-center px-3 text-xs text-white/90">
                      manifestfts.com
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="rounded-2xl border border-white/14 bg-slate-950/65 p-4">
                      <div className="h-28 rounded-xl bg-gradient-to-r from-cyan-300/28 via-emerald-300/22 to-teal-300/24 border border-white/10" />
                      <div className="mt-4 space-y-2">
                        <div className="h-3 rounded bg-white/20 w-11/12" />
                        <div className="h-3 rounded bg-white/16 w-8/12" />
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="h-20 rounded-lg border border-white/12 bg-white/8" />
                        <div className="h-20 rounded-lg border border-white/12 bg-white/8" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-5 -right-4 md:-right-8 rounded-2xl border border-emerald-100/30 bg-emerald-300/24 backdrop-blur-md px-4 py-3 shadow-[0_16px_40px_rgba(16,185,129,0.26)]"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <BoltIcon className="w-4 h-4 text-emerald-50" />
                    <p className="text-xs text-white font-semibold">Monthly technical improvements</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-3 md:-left-8 rounded-2xl border border-cyan-100/30 bg-cyan-300/22 backdrop-blur-md px-4 py-3 shadow-[0_16px_44px_rgba(34,211,238,0.24)]"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 6.7, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <Cog6ToothIcon className="w-4 h-4 text-cyan-50" />
                    <p className="text-xs text-white font-semibold">Hosting, updates, and support included</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-[#f4fbfb]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 mb-3">
                Why It Matters
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why a better website matters
              </h2>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                A modern online presence helps people trust you faster, find you
                more easily, and follow through when they are ready to take
                action.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-[0_18px_42px_rgba(15,23,42,0.09)]"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  81%
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  People check online first
                </h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Before they contact, book, or donate, most people look up an
                  organization online. Your website often decides whether they
                  move forward.
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-[0_18px_42px_rgba(15,23,42,0.09)]"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  20%+
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  Better mobile experience, better conversions
                </h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Improving speed and mobile usability often leads to a
                  noticeable lift in inquiries, signups, or donations.
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-slate-200 bg-white/95 p-7 shadow-[0_18px_42px_rgba(15,23,42,0.09)]"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65 }}
              >
                <div className="text-4xl font-extrabold text-gray-900">
                  2x–10x
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  More inquiries is possible
                </h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  When a site is clear, search-friendly, and easy to use, many
                  small organizations see a meaningful increase in engagement.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-[#f8fbff]">
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
              <div className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-4 border border-cyan-100">
                Built for practical growth
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What you actually get
              </h2>

              <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                This is not just hosting. We help you launch a clean, credible
                site that is easier to maintain and easier for people to trust.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center">
                  {teamSupportAvatars.map((member, index) => (
                    <div
                      key={member.name}
                      className={
                        "relative h-10 w-10 rounded-full border-2 border-white ring-1 ring-cyan-200 shadow-sm overflow-hidden bg-slate-100 " +
                        (index === 0 ? "" : "-ml-3")
                      }
                      title={member.name + " - " + member.role}
                    >
                      <Image src={member.src} alt={member.name} layout="fill" objectFit="cover" />
                    </div>
                  ))}
                </div>
                <div className="inline-flex items-center rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-xs font-semibold text-cyan-900">
                  Backed by a real design + development team
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {valueCards.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.1)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(6,182,212,0.08),transparent_45%)] pointer-events-none" />
                    <div className="relative">
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center mb-3">
                        <item.icon className="w-5 h-5 text-cyan-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-[#0b2037] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(45,212,191,0.2),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.18),transparent_42%)]" />
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="max-w-3xl relative"
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
              <p className="mt-3 text-slate-100/95 text-lg leading-relaxed">
                Highlights from teams we have supported across nonprofit,
                local business, and mission-driven projects.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {testimonialHighlights.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="relative rounded-2xl border border-white/24 bg-slate-900/78 p-6 shadow-[0_20px_48px_rgba(2,6,23,0.34)]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45 + index * 0.1 }}
                >
                  <div className="absolute -top-3 right-4 text-5xl leading-none text-cyan-200/50">
                    “
                  </div>
                  <p className="text-slate-50 leading-relaxed">{item.quote}</p>
                  <div className="mt-5 pt-4 border-t border-white/18">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-slate-100">{item.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-[#eef7f7]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 mb-3">
                Proof Modules
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Recent Work and Case Study Previews
              </h2>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                Placeholder blocks are ready for portfolio screenshots and case study visuals so social proof can be expanded without layout changes.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {placeholderPortfolioCards.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_38px_rgba(15,23,42,0.1)] overflow-hidden"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.4 + index * 0.08 }}
                >
                  <div className="aspect-[16/10] rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <div className="h-7 border-b border-slate-200 bg-white flex items-center gap-1.5 px-3">
                      <span className="w-2 h-2 rounded-full bg-rose-300" />
                      <span className="w-2 h-2 rounded-full bg-amber-300" />
                      <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    </div>
                    <div className="h-[calc(100%-1.75rem)] p-3 bg-gradient-to-br from-cyan-50 via-teal-50 to-slate-100">
                      <div className="h-full rounded-lg border border-cyan-100 bg-white/70" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-200 font-semibold">
                      {item.industry}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-900">
                    View live preview
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {placeholderCaseStudyCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.1)]"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45 + index * 0.08 }}
                >
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <div className="h-32 bg-gradient-to-r from-indigo-100 via-sky-100 to-teal-100" />
                    <div className="p-4 bg-white">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-2 text-sm text-emerald-800 font-bold">{item.result}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.badges.map((badge) => (
                          <span
                            key={badge}
                            className="text-[11px] px-2 py-1 rounded-full border border-slate-300 bg-slate-100 text-slate-800 font-medium"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-900">
                        View case study
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-[#071b31] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold">
                What We Handle For You
              </h2>
              <p className="mt-3 text-slate-100 text-lg leading-relaxed">
                You focus on your business. We handle the technical work across setup, delivery, infrastructure, and ongoing growth support.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {managedChecklist.map((group, index) => (
                <motion.div
                  key={group.title}
                  className="rounded-2xl border border-white/26 bg-slate-900/56 p-6 shadow-[0_18px_40px_rgba(2,6,23,0.38)] relative overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45 + index * 0.08 }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(45,212,191,0.12),transparent_48%)]" />
                  <h3 className="text-xl font-semibold text-white relative">{group.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-slate-50 text-sm md:text-base relative leading-relaxed">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckBadgeIcon className="w-5 h-5 mt-0.5 text-cyan-200" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-14 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                DIY Builders vs Freelancers vs Manifest FTS
              </h2>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                If your goal is consistent growth without technical headaches, ownership and support quality matter more than a low starting price.
              </p>
            </div>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-[0_18px_42px_rgba(15,23,42,0.09)] bg-white">
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3">Comparison</th>
                    <th className="text-left px-4 py-3">DIY Builders</th>
                    <th className="text-left px-4 py-3">Freelancers</th>
                    <th className="text-left px-4 py-3">Manifest FTS</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-t border-slate-200 align-top">
                      <td className="px-4 py-4 font-semibold text-gray-900">{row.label}</td>
                      <td className="px-4 py-4 text-gray-700">{row.diy}</td>
                      <td className="px-4 py-4 text-gray-700">{row.freelancers}</td>
                      <td className="px-4 py-4 text-gray-900 font-medium">{row.manifest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="plans" className="w-full px-4 py-14 md:py-16 bg-[#eef3f8]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 mb-3">
                Plans
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Choose your support plan
              </h2>
              <p className="mt-2 mb-6 text-lg text-gray-700 leading-relaxed">
                Start lean, stay supported, and upgrade only if and when it
                makes sense.
              </p>
              <div className="mt-4 mb-2 flex items-center justify-center">
                <Link href="#plans">
                  <a className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(15,23,42,0.25)] hover:bg-slate-900 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto">
                    Get Started Instantly
                  </a>
                </Link>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className={
                  "p-6 rounded-2xl shadow-[0_18px_42px_rgba(15,23,42,0.12)] flex flex-col justify-between relative border-2 " +
                  (selectedPlan === "starter"
                    ? "bg-blue-50 border-blue-600 ring-4 ring-blue-100"
                    : "bg-white border-blue-300")
                }
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
              >
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-700 text-white shadow-md ring-1 ring-white/70">
                  Most Popular
                </div>

                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
                    Starter Presence
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Basic
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                    Founding offer
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-through font-medium">
                    $249/month
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-gray-900 flex items-end gap-1">
                    $149
                    <span className="text-base font-semibold text-gray-800">
                      /month
                    </span>
                  </p>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Best for small businesses and nonprofits that need a clean,
                    credible online presence without large build costs.
                  </p>
                  <p className="mt-2 text-sm font-bold text-blue-900">
                    Includes up to 2 hours of expert support ($240 value)
                  </p>

                  <ul className="mt-6 space-y-3.5 text-sm text-gray-800 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Free template-based website launch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Up to 5 core pages + optional blog setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Basic SEO setup for visibility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Contact form or inquiry capture setup</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                      <span>Monthly support with execution ownership</span>
                    </li>
                  </ul>

                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <p className="text-sm font-semibold text-blue-900">
                      Also Included
                    </p>
                    <ul className="mt-3 space-y-2.5 text-sm text-blue-950 leading-relaxed font-medium">
                      {alsoIncludedItems.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-blue-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={function openStarter() {
                    handleSelectPlan("starter");
                  }}
                  className={
                    "w-full mt-8 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 " +
                    (selectedPlan === "starter"
                      ? "bg-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.32)]"
                      : "bg-slate-900 hover:bg-black hover:-translate-y-0.5")
                  }
                >
                  {selectedPlan === "starter" ? "Selected" : "Start Basic Checkout"}
                </button>
              </motion.div>

              <motion.div
                className={
                  "p-6 rounded-2xl shadow-[0_16px_38px_rgba(15,23,42,0.11)] flex flex-col justify-between relative border " +
                  (selectedPlan === "growth"
                    ? "bg-indigo-50 border-indigo-600 ring-4 ring-indigo-100"
                    : "bg-white border-slate-300")
                }
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55 }}
              >
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-3">
                    Growth Focused
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Professional
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    Growth plan
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-gray-900 flex items-end gap-1">
                    $298
                    <span className="text-base font-semibold text-gray-700">
                      /month
                    </span>
                  </p>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Best for organizations that want more visibility, stronger
                    content structure, and steady growth support.
                  </p>
                  <p className="mt-2 text-sm font-bold text-indigo-900">
                    Includes up to 4 hours of expert support ($480 value)
                  </p>

                  <ul className="mt-6 space-y-3.5 text-sm text-gray-800 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Everything in Basic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Expanded site structure up to 10 pages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>SEO-enriched service or location page support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>Monthly optimization recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-500" />
                      <span>4 hours of monthly expert support and execution</span>
                    </li>
                  </ul>

                  <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <p className="text-sm font-semibold text-indigo-900">
                      Also Included
                    </p>
                    <ul className="mt-3 space-y-2.5 text-sm text-indigo-950 leading-relaxed font-medium">
                      {alsoIncludedItems.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-indigo-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={function openGrowth() {
                    handleSelectPlan("growth");
                  }}
                  className={
                    "w-full mt-8 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 " +
                    (selectedPlan === "growth"
                      ? "bg-indigo-700 shadow-[0_12px_28px_rgba(67,56,202,0.32)]"
                      : "bg-indigo-700 hover:bg-indigo-800 hover:-translate-y-0.5")
                  }
                >
                  {selectedPlan === "growth"
                    ? "Selected"
                    : "Start Professional Checkout"}
                </button>
              </motion.div>

              <motion.div
                className="bg-white border border-slate-300 p-6 rounded-2xl shadow-[0_16px_38px_rgba(15,23,42,0.11)] flex flex-col justify-between"
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
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Best for teams that want help choosing the right path before
                    launching.
                  </p>

                  <ul className="mt-6 space-y-3.5 text-sm text-gray-800 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>Book a guided call to map goals and constraints</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>
                        Best for unique requirements or phased growth plans
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>
                        Discuss SEO, content scope, integrations, and support
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>Get realistic next steps and recommendations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckBadgeIcon className="w-4 h-4 mt-0.5 text-amber-500" />
                      <span>No pressure, just clarity</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={function openGuided() {
                    handleSelectPlan("guided_onboarding");
                  }}
                  className={
                    "w-full mt-8 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 " +
                    (selectedPlan === "guided_onboarding"
                      ? "bg-amber-700 shadow-[0_12px_28px_rgba(180,83,9,0.28)]"
                      : "bg-amber-700 hover:bg-amber-800 hover:-translate-y-0.5")
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

        <section className="w-full px-4 py-16 bg-[#f4f9ff]">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl bg-gradient-to-r from-blue-100 via-sky-100 to-indigo-100 px-6 md:px-12 py-12 md:py-16 shadow-xl border border-blue-300">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Flexible support, no long-term lock-in
                </h2>
                <p className="mt-4 text-lg text-slate-900 leading-relaxed font-medium">
                  We are offering this program to help more organizations get
                  online without the usual upfront costs and friction. If it is a fit, we
                  will help you move forward. If it is not, you can cancel
                  anytime. No contracts.
                </p>

                <p className="mt-3 text-sm font-semibold text-gray-800">
                  Cancel anytime. No contracts. Built for businesses ready to grow.
                </p>

                <div className="mt-8 flex items-center justify-center">
                  <Link href="#plans">
                    <a className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 font-bold text-white shadow-[0_14px_32px_rgba(15,23,42,0.3)] hover:bg-black hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 transition-all duration-300 w-full sm:w-auto">
                      Get Started Instantly
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <style jsx global>{`
          .footer .menu-footer a,
          .footer .footer-bottom,
          .footer .footer-bottom p,
          .footer .footer-bottom span {
            color: #dbe7ff !important;
          }

          .footer .menu-footer a:hover,
          .footer .menu-footer a:focus-visible {
            color: #ffffff !important;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
        `}</style>
        
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
              A few quick details, then we will route you to the next best step.
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
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="organizationType"
                  className="block text-lg text-gray-700"
                >
                  Business Type
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
                  {isSubmitting
                    ? "Sending..."
                    : selectedPlan === "guided_onboarding"
                    ? "Send"
                    : "Continue to Checkout"}
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