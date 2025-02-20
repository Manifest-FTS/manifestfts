"use client";
import React from 'react';
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

SwiperCore.use([Autoplay]);

const ContinuousTestimonialSlider = () => {
    const data = [
        {
            avatar: "cfuscarino.png",
            name: "Christian F.",
            title: "Executive Director",
            company: "Garden State Equality",
            quote: "Working with ManifestFTS has truly been a breath of fresh air. Their innovative approach and technical expertise have helped us drive our mission forward in ways we never imagined. I highly recommend them for any organization looking for reliable, mission-driven partners.",
            bg: ""
        },
        {
            avatar: "kadams.png",
            name: "Kevin Adams",
            title: "Executive Director & Founder",
            company: "Waterfall Keepers of NC",
            quote: "ManifestFTS provided us with the tools and strategy we needed to expand our conservation efforts. Their attention to detail and commitment to our mission have been invaluable, and we’re thrilled with the results.",
            bg: "bd-bg-6"
        },
        {
            avatar: "vnastri.png",
            name: "Vanessa N.",
            title: "CEO",
            company: "Barclay Rex Cigars",
            quote: "Kevin and his team are true professionals—efficient, skilled, and reliable. They consistently deliver quality work that helps us stand out in a competitive industry. ManifestFTS is an essential partner for our business.",
            bg: "bd-bg-10"
        },
        {
            avatar: "fsalzano.png",
            name: "Frank Salzano",
            title: "Astrologer",
            company: "Medicine of The Starry Heavens",
            quote: "The expertise and personalized approach from ManifestFTS have helped me enhance my online presence and connect with my clients on a deeper level. Their work is truly transformative.",
            bg: "bd-bg-6"
        },
        {
            avatar: "kadams.png",
            name: "Kevin Adams",
            title: "Photographer",
            company: "Kadamsphoto.com",
            quote: "I needed a digital strategy that reflected my vision and artistic style. ManifestFTS delivered beyond my expectations, providing a seamless and elegant platform for showcasing my work.",
            bg: ""
        },
        {
            avatar: "ngagnier.png",
            name: "Nancy Gagnier",
            title: "Executive Director",
            company: "South Orange/Maplewood Community Coalition on Race",
            quote: "ManifestFTS brought professionalism and creativity to our digital outreach efforts, making our messaging more impactful. Their dedication and technical know-how have been a game changer for us.",
            bg: "bd-bg-10"
        },
        {
            avatar: "rarobertson.png",
            name: "Rebecca Ann Robertson",
            title: "Founding Director",
            company: "Mayan Melipona Bee Sanctuary",
            quote: "Sustainability is at the core of what we do, and finding a tech partner who understands that has been critical. ManifestFTS has helped us amplify our message and connect with supporters worldwide.",
            bg: "bd-bg-6"
        }
    ];

    return (
        <div className="box-swiper w-full overflow-hidden mb-3 pt-20 md:my-12">
            <div className="flex justify-center px-4">
              <span className="bg-blue-100 text-blue-900 mb-2 px-4 py-1 rounded-full">
                Testimonials
              </span>
            </div>
            <h2 className="text-center text-5xl font-bold text-gray-900 mb-4">
              Forward Thinking Clients
            </h2>
            <Swiper
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 }
                }}
                loop={true}
                speed={5000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                freeMode={true}
                grabCursor={false}
                allowTouchMove={false}
                className="swiper-wrapper pb-10 pt-5"
            >
                {data.map((item, i) => (
                    <SwiperSlide key={i} className="flex items-center justify-center">
                        <div className={`card-grid-style-3 hover:shadow-lg transition-shadow duration-300 ${item.bg} w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 bg-white rounded-lg shadow-md flex flex-col justify-center`}> 
                            <div className="flex justify-center">
                                <img className="w-[75px] h-[75px] rounded-full" src={`assets/imgs/testimonials/${item.avatar}`} alt="Testimonial" />
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-800 mt-4 text-center">{item.name}</h3>
                            <span className="bg-blue-200 text-xs font-semibold rounded-full py-1 px-3 text-center block mx-auto my-2 w-fit">{item.title}</span>
                            <span className="text-sm text-gray-500 block text-center">{item.company}</span>
                            <p className="text-sm text-gray-600 mt-4 text-center">{item.quote}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ContinuousTestimonialSlider;
