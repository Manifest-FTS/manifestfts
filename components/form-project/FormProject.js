import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const FormProject = () => {
  const [status, setStatus] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  async function handleOnSubmit(e) {
    e.preventDefault();
    setShowVerification(true);
  }

  async function verifyAndSend(e) {
    e.preventDefault();
    if (userAnswer !== "10") {
      toast.error("Human verification failed");
      return;
    }

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
  }

  return (
    <section id="get-started" className="section-box">
      <div className="container mb-50 mt-70">
        <div className="bdrd-58 box-gray-100 icon-wave">
          {status ? (
            <div className="col-lg-12 mt-15">
              <h3 className="text-2xl font-bold mb-2">We&apos;ve received your message</h3>
              <p>
                Our team will be in touch soon, thank you for connecting with
                us.
              </p>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-12 mb-60">
                <span className="text-body-capitalized text-uppercase">
                  Let&#x2019;s work together
                </span>
                <h2 className="text-heading-3 color-gray-900 mt-10">
                  Have a project in mind?
                </h2>
                <p className="text-body-text color-gray-600 mt-20">
                  Call <span className="text-heading-5 color-gray-900 mt-10">+1 732-618-5084</span> or send us a message for a free consultation.
                </p>
              </div>
              <div className="col-lg-12">
                <div className="row">
                  <form className="row" method="post" onSubmit={showVerification ? verifyAndSend : handleOnSubmit}>
                    <input type="hidden" name="formType" value="getQuote" />
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
                    {showVerification && (
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-sm">What is 2 + 8?</label>
                          <input
                            className="form-control mt-2"
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-lg-12 mt-15">
                      <button
                        className="btn btn-black icon-arrow-right-white mr-40 mb-20"
                        type="submit"
                      >
                        {showVerification ? "Verify & Send" : "Send Message"}
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
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FormProject;