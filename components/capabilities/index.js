import Link from 'next/link'
import React from 'react'

function Capabilities() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto text-center max-w-5xl">
          <span className="text-green-700 bg-green-100 px-4 py-2 rounded-full">Core Capabilities</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">Forward-thinking solutions</h2>
          <p className="text-lg text-gray-600 mt-4">Our forward-thinking approach leverages thoughtful creativity, cutting-edge software, and technology to give value-rich experiences to our partners.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
        <div className="text-center">
          <img src="/assets/imgs/icon-branding.png" alt="Branding" className="h-24 mx-auto" />
          <h3 className="text-2xl font-semibold mt-4">Branding</h3>
          <p className="text-gray-600 mt-2">
            Elevate your brand identity by crafting a memorable narrative that inspires customer trust and loyalty.
          </p>
        </div>
        <div className="text-center">
          <img src="/assets/imgs/icon-design.png" alt="Design" className="h-24 mx-auto" />
          <h3 className="text-2xl font-semibold mt-4">Design</h3>
          <p className="text-gray-600 mt-2">
            Create visually striking designs that seamlessly bridge digital and print media, ensuring consistency and style.
          </p>
        </div>
        <div className="text-center">
          <img src="/assets/imgs/icon-software.png" alt="Software" className="h-24 mx-auto" />
          <h3 className="text-2xl font-semibold mt-4">Software</h3>
          <p className="text-gray-600 mt-2">
            Develop innovative software solutions that empower users with efficient mobile and web experiences for challenges.
          </p>
        </div>
        <div className="text-center">
          <img src="/assets/imgs/icon-hosting.png" alt="Hosting" className="h-24 mx-auto" />
          <h3 className="text-2xl font-semibold mt-4"><Link href="/wordpress-hosting">Hosting</Link></h3>
          <p className="text-gray-600 mt-2">
            Secure, reliable hosting & maintenance with scalable infrastructure designed to support your business.
          </p>
        </div>
      </div>
  </section>
  )
}

export default Capabilities