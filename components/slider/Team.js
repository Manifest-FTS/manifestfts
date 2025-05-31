/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import Link from "next/link";
import SwiperCore, { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Navigation]);
const TeamSlider = () => {

    const data = [
        {
            img: "9.jpg",
            avatar: "1.jpg",
            title: "Liguid Wave",
            author: "Sound Box"
        },
        {
            img: "10.jpg",
            avatar: "2.jpg",
            title: "Liguid Wave",
            author: "Sound Box"
        },
        {
            img: "11.jpg",
            avatar: "3.jpg",
            title: "Liguid Wave",
            author: "Sound Box"
        },
        {
            img: "12.jpg",
            avatar: "4.jpg",
            title: "Liguid Wave",
            author: "Sound Box"
        },
    ];

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl">
                    <div className="mb-4">
                        <img src="/assets/imgs/page/about/1/kevin_williams.webp" alt="Kevin Williams" className="w-full rounded-lg" />
                    </div>
                    <span className="text-gray-500 text-sm">Founder,<br/>Software Engineer</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">Kevin Williams</h3>
                    <span className="text-gray-600 text-sm">Let’s Connect</span>
                    <div className="social-bottom flex space-x-3">
                        <Link href="mailto:devkev@manifestfts.com">
                          <img src="/assets/imgs/template/icons/email.svg" alt="Email" className="icon-socials cursor-pointer" />
                        </Link>
                        <Link href="http://instagram.com/kevinorin"><a className="icon-socials icon-instagram"></a></Link>
                        <Link href="http://linkedin.com/in/kevinorin"><a className="icon-socials icon-linkedin"></a></Link>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl">
                    <div className="mb-4">
                        <img src="/assets/imgs/page/about/1/mohammed_masum.webp" alt="Mohammed Masum" className="w-full rounded-lg" />
                    </div>
                    <span className="text-gray-500 text-sm">Business Analyst & Project Manager</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">Mohammed Masum</h3>
                    <span className="text-gray-600 text-sm">Let’s Connect</span>
                    <div className="social-bottom flex space-x-3">
                      <Link href="mailto:mdm@manifestfts.com">
                        <img src="/assets/imgs/template/icons/email.svg" alt="Email" className="icon-socials cursor-pointer" />
                      </Link>
                      <Link href="https://www.linkedin.com/in/mmasum/"><a className="icon-socials icon-linkedin"></a></Link>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl">
                    <div className="mb-4">
                        <img src="/assets/imgs/page/about/1/daniel_kane.webp" alt="Daniel Kane" className="w-full rounded-lg" />
                    </div>
                    <span className="text-gray-500 text-sm">Client Relations Manager<br/>&nbsp;</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">Daniel Kane</h3>
                    <span className="text-gray-600 text-sm">Let’s Connect</span>
                    <div className="social-bottom flex space-x-3">
                      <Link href="mailto:danielk@manifestfts.com">
                        <img src="/assets/imgs/template/icons/email.svg" alt="Email" className="icon-socials cursor-pointer" />
                      </Link>
                    </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl">
                    <div className="mb-4">
                        <img src="/assets/imgs/page/about/1/profile.jpg" alt="Arun Jha" className="w-full rounded-lg" />
                    </div>
                    <span className="text-gray-500 text-sm">Software Engineer, Solutions Architect</span>
                    <h3 className="text-xl font-semibold mt-2 mb-2">Arun Jha</h3>
                    <span className="text-gray-600 text-sm">Let’s Connect</span>
                    <div className="social-bottom flex space-x-3">
                      <Link href="mailto:hello@manifestfts.com">
                        <img src="/assets/imgs/template/icons/email.svg" alt="Email" className="icon-socials cursor-pointer" />
                      </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamSlider;
