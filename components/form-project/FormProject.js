import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { RetainerTrigger } from "../retainer";

const FormProject = () => {
  const [status, setStatus] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();
    setShowVerification(true);
  }

  async function verifyAndSend(e) {
    e.preventDefault();

    if (userAnswer.trim() !== "10") {
      toast.error("Human verification failed");
      return;
    }

    const formData = {};
    Array.from(e.currentTarget.elements).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/mail", {
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send message. Please try again.");
        setStatus(false);
        setIsSubmitting(false);
        return;
      }

      setStatus(true);
      setShowVerification(false);
      setUserAnswer("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again later.");
      setStatus(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact-us" className="section-box">
      <div className="container mb-50 mt-70">
        <div className="bdrd-58 box-gray-100 icon-wave">
          <div className="p-30 p-lg-5">
            {status ? (
              <div className="col-lg-10 mt-15">
                <span className="text-body-capitalized text-uppercase color-gray-500">
                  Message received
                </span>
                <h3 className="text-heading-3 color-gray-900 mt-10 mb-15">
                  Thanks — we’ve got it.
                </h3>
                <p className="text-body-text color-gray-600 mb-0">
                  We’ll review your message and follow up soon.
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-7 mb-40">
                  <span className="text-body-capitalized text-uppercase color-gray-500">
                    Get in touch
                  </span>
                  <h2 className="text-heading-3 color-gray-900 mt-10">
                    Let’s start the conversation.
                  </h2>
                  <p className="text-body-text color-gray-600 mt-20 mb-0">
                    Questions, project inquiries, partnerships, or ongoing support —
                    send us a message and I&rsquo;ll follow up with next steps. You
                    can also call or text{" "}
                    <span className="text-heading-6 color-gray-900">
                      +1 864-660-9125
                    </span>
                    .
                  </p>
                </div>

                <div className="col-lg-5 mb-40">
                  <div className="bg-white bdrd-16 p-20">
                    <span className="text-body-capitalized text-uppercase color-gray-500">
                      Typical inquiries
                    </span>
                    <p className="text-body-text-md color-gray-600 mt-15 mb-0">
                      New projects, redesigns, web and mobile work, product support,
                      technical guidance, partnerships, and ongoing digital help.
                    </p>
                  </div>
                </div>

                <div className="col-lg-12">
                  <form
                    className="row"
                    method="post"
                    onSubmit={showVerification ? verifyAndSend : handleOnSubmit}
                  >
                    <input type="hidden" name="formType" value="getQuote" />

                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          className="form-control"
                          type="text"
                          name="fullname"
                          placeholder="Your name"
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
                          type="email"
                          name="email"
                          placeholder="Email"
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
                          placeholder="Phone (optional)"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="message"
                          rows="6"
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>

                    {showVerification && (
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-body-small color-gray-600 mb-10 d-block">
                            What is 2 + 8?
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-lg-12 mt-10">
                      <div
                        className="d-flex items-center justify-content-between flex-wrap"
                        style={{ gap: 16 }}
                      >
                        <div>
                          <button
                            className="btn btn-black icon-arrow-right-white mb-15"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {showVerification
                              ? isSubmitting
                                ? "Sending..."
                                : "Verify & Send"
                              : "Send Message"}
                          </button>
                        </div>

                        <div className="text-body-text-md color-gray-500 mb-15">
                          By sending a message, you agree to our{" "}
                          <Link href="/terms" passHref>
                            <a>terms</a>
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" passHref>
                            <a>privacy policy</a>
                          </Link>
                          .
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 mt-20">
                      <div
                        className="pt-20"
                        style={{ borderTop: "1px solid rgba(16,24,40,0.08)" }}
                      >
                        <p className="text-body-text color-gray-600 mb-10">
                          Ready to move forward? Start a retainer — urgent requests get a response within 15 minutes to 24 hours.
                        </p>
                        <RetainerTrigger
                          className="btn btn-link text-heading-6 p-0"
                          source="contact_form"
                          hours={10}
                        >
                          Start a Retainer
                        </RetainerTrigger>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormProject;