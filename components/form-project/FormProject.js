import Link from "next/link";
import React, { useState } from "react";
const FormProject = () => {
  const [status, setStatus] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();
    const formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    try {
      const res = await fetch("/api/mail", {
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      setStatus(true);
    } catch (e) {
      setStatus(false);
    }

    const { error } = await res.json();
    console.log(formData);
  }

  return (
    <section id="get-started" className="section-box">
      <div className="container mb-50 mt-70">
        <div className="bdrd-58 box-gray-100 icon-wave">
          <div className="row">
            <div className="col-lg-12 mb-60">
              <span className="text-body-capitalized text-uppercase">
                Let&#x2019;s work together
              </span>
              <h2 className="text-heading-3 color-gray-900 mt-10">
                Have a project in mind?
              </h2>
              <p className="text-body-text color-gray-600 mt-20">
                Let us help Manifest your next project. Contact us regarding an
                upcoming project or for a consultation.
              </p>
            </div>
            <div className="col-lg-12">
              <div className="row">
                <form className="row" method="post" onSubmit={handleOnSubmit}>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        name="fullname"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        name="company"
                        placeholder="Company (optional)"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        type="email"
                        name="message"
                        placeholder="Your message or project description"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 mt-15">
                    <button
                      className="btn btn-black icon-arrow-right-white mr-40 mb-20"
                      type="submit"
                    >
                      Send Message
                    </button>
                    <br className="d-lg-none d-block" />
                    <span className="text-body-text-md color-gray-500 mb-20">
                      By sending a message, you agree to our{" "}
                      <Link href="/terms" passHref>
                        <a>terms</a>
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy-policy" passHref>
                        <a>privacy policy</a>
                      </Link>
                      .
                    </span>
                  </div>

                  {status ? (
                    <div className="col-lg-12 mt-15">
                      <h3>We&apos;ve received your message</h3>
                      <p>
                        Our team will be in touch soon, thank you for connecting
                        with us
                      </p>
                    </div>
                  ) : (
                    <div className="col-lg-12 mt-15">
                      <h3>Something went wrong</h3>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormProject;
