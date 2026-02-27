/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const challengeIssues = [
    { title: "Poor User Interface", description: "The original UI was outdated and non-intuitive, making it difficult for users to navigate and use effectively.", image: "/assets/imgs/optumpricer/ui-issue-placeholder.png" },
    { title: "Manual Approval Process", description: "Users had to wait for manual approvals before accessing features, slowing down adoption and engagement.", image: "/assets/imgs/optumpricer/manual-approval-placeholder.png" },
    { title: "Lack of Subscription System", description: "No automated billing or subscription management led to operational inefficiencies.", image: "/assets/imgs/optumpricer/no-subscription-placeholder.png" },
    { title: "Limited Marketing Capabilities", description: "No landing pages, FAQs, or structured onboarding meant potential customers had little support.", image: "/assets/imgs/optumpricer/no-marketing-placeholder.png" },
];

const solutionPoints = [
    { title: "Modern UI/UX", description: "We designed a sleek, user-friendly interface using Next.js and TailwindCSS for a seamless experience.", image: "/assets/imgs/optumpricer/ui-solution-placeholder.png" },
    { title: "Automated Subscription System", description: "We integrated Stripe for seamless, self-managed subscriptions and trials.", image: "/assets/imgs/optumpricer/subscription-solution-placeholder.png" },
    { title: "Comprehensive Onboarding", description: "New users are now guided through an intuitive onboarding process, reducing confusion and increasing engagement.", image: "/assets/imgs/optumpricer/onboarding-solution-placeholder.png" },
    { title: "Feature-Rich SaaS", description: "New feature flags allow customization of pricing plans, user seats, and report access for different subscription tiers.", image: "/assets/imgs/optumpricer/feature-solution-placeholder.png" },
];

const impactStats = [
    { title: "400% Increase in Demo Requests", description: "After integrating a simulator and free trial onboarding, demo requests surged." },
    { title: "Seamless SaaS Monetization", description: "Stripe-powered subscriptions and automated trials increased user conversion." },
    { title: "Optimized Performance & Security", description: "Refactoring in Next.js improved speed, while security enhancements ensured data protection." },
    { title: "Enhanced Scalability", description: "With a modular architecture, OptumPricer is now positioned to expand features and user capacity effortlessly." },
];

function OptumPricerCaseStudy() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % challengeIssues.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout>
            <section className="section-box bg-gray-100 py-16">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="container text-center max-w-4xl"
                >
                    <h1 className="text-5xl font-bold text-gray-900">OptumPricer: Transforming Pricing Strategy with Scalable SaaS</h1>
                    <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">A complete overhaul from a legacy PHP prototype to a modern SaaS platform with seamless pricing automation.</p>
                </motion.div>
            </section>

            <section className="section-box py-20">
                <div className="container flex flex-col-reverse md:flex-row-reverse items-center gap-12">
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-green-700">The Challenge</h2>
                        <p className="text-lg text-gray-700 mt-4">Rudy Z. and Raquel K. faced several roadblocks with their outdated platform.</p>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="relative max-w-xl mx-auto overflow-hidden">
                            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                {challengeIssues.map((issue, index) => (
                                    <div key={index} className="w-full min-w-full p-8 bg-white rounded-md">
                                        <img src={issue.image} alt={issue.title} className="rounded-md mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-800">{issue.title}</h3>
                                        <p className="text-gray-600 mt-2">{issue.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box bg-gray-100 py-20">
                <div className="container flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2 order-2 md:order-1">
                        <div className="relative max-w-xl mx-auto overflow-hidden">
                            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                                {solutionPoints.map((solution, index) => (
                                    <div key={index} className="w-full min-w-full p-8 bg-white rounded-md">
                                        <img src={solution.image} alt={solution.title} className="rounded-md mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-800">{solution.title}</h3>
                                        <p className="text-gray-600 mt-2">{solution.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2">
                        <h2 className="text-4xl font-bold text-green-700">Forward Thinking Solutions</h2>
                        <p className="text-lg text-gray-700 mt-4">We implemented a range of solutions to modernize and enhance OptumPricer.</p>
                    </div>
                </div>
            </section>

            <section className="section-box bg-white py-20">
                <div className="container text-center">
                    <h2 className="text-4xl font-bold text-green-700">The Impact</h2>
                    <p className="text-lg text-gray-700 mt-4">OptumPricer transformed from an outdated prototype into an industry-standard SaaS product.</p>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {impactStats.map((impact, index) => (
                            <div key={index} className="p-8 bg-white shadow-lg rounded-md">
                                <h3 className="text-2xl font-bold text-gray-800">{impact.title}</h3>
                                <p className="text-gray-600 mt-2">{impact.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default OptumPricerCaseStudy;
