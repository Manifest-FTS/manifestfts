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
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card-grid-style-5 hover-up">
                        <div className="grid-5-img mb-15"><img src="/assets/imgs/page/about/1/kevin_williams.png" alt="Agon"/>
                        </div>
                        <span className="text-body-text-md color-gray-500">Founder, Chief Technology Officer</span>
                        <h3 className="text-heading-5 mb-5 mt-5">Kevin Williams</h3>
                        <span className="text-body-text-md color-gray-600">Let’s Connect</span>
                        <div className="social-bottom">
                            <Link href="mailto:devkev@manifestfts.com"><a
                                className="icon-socials icon-email"></a></Link>
                            <Link href="http://instagram.com/kevinorin"><a className="icon-socials icon-instagram"></a></Link>
                            <Link href="http://linkedin.com/in/kevinorin"><a className="icon-socials icon-linkedin"></a></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card-grid-style-5 hover-up">
                        <div className="grid-5-img mb-15"><img src="/assets/imgs/page/about/1/mohammed_masum.png" alt="Agon"/>
                        </div>
                        <span className="text-body-text-md color-gray-500">Product & Project Manager</span>
                        <h3 className="text-heading-5 mb-5 mt-5">Mohammed Masum</h3>
                        <span className="text-body-text-md color-gray-600">Let’s Connect</span>
                        <div className="social-bottom">
                            <Link href="mailto:mdm@manifestfts.com"><a className="icon-socials icon-email"></a></Link>
                            <Link href="https://www.linkedin.com/in/mmasum/"><a
                                className="icon-socials icon-linkedin"></a></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card-grid-style-5 hover-up">
                        <div className="grid-5-img mb-15"><img src="/assets/imgs/page/about/1/profile.jpg" alt="Agon"/>
                        </div>
                        <span className="text-body-text-md color-gray-500">Client Relations Manager</span>
                        <h3 className="text-heading-5 mb-5 mt-5">Daniel Kane</h3>
                        <span className="text-body-text-md color-gray-600">Let’s Connect</span>
                        <div className="social-bottom">
                            <Link href="mailto:hello@manifestfts.com"><a className="icon-socials icon-email"></a></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card-grid-style-5 hover-up">
                        <div className="grid-5-img mb-15"><img src="/assets/imgs/page/about/1/profile.jpg" alt="Agon"/>
                        </div>
                        <span className="text-body-text-md color-gray-500">Software Engineer, Solutions Architect</span>
                        <h3 className="text-heading-5 mb-5 mt-5">Arun Jha</h3>
                        <span className="text-body-text-md color-gray-600">Let’s Connect</span>
                        <div className="social-bottom">
                            <Link href="mailto:arunj@manifestfts.com"><a className="icon-socials icon-email"></a></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamSlider;

