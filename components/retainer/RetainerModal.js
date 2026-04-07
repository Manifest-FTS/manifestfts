import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { fetchPostJSON } from '../../util/api-helpers';
import { getRetainerSnapshot } from '../../util/retainer';
import RetainerBuilder from './RetainerBuilder';
import { useRetainerPurchase } from './RetainerContext';

const initialForm = {
  name: '',
  email: '',
  company: '',
  brief: '',
};

const steps = [
  { id: 1, label: 'Support' },
  { id: 2, label: 'Brief' },
  { id: 3, label: 'Contact' },
];

const overlayStyle = function (isVisible) {
  return {
    position: 'fixed',
    inset: 0,
    background: isVisible ? 'rgba(16,24,40,0.14)' : 'rgba(16,24,40,0)',
    border: 0,
    zIndex: 999,
    transition: 'background 220ms ease',
    cursor: 'default',
  };
};

const shellStyle = function (isVisible) {
  return {
    position: 'fixed',
    left: '50%',
    bottom: 12,
    transform: 'translateX(-50%) translateY(' + (isVisible ? '0' : '20px') + ')',
    opacity: isVisible ? 1 : 0,
    width: 'min(760px, calc(100vw - 24px))',
    height: 'min(84vh, 760px)',
    zIndex: 1000,
    borderRadius: 24,
    border: '1px solid rgba(16,24,40,0.08)',
    background: '#ffffff',
    boxShadow: '0 18px 50px rgba(16,24,40,0.14)',
    transition: 'transform 220ms ease, opacity 220ms ease',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };
};

const headerStyle = {
  flex: '0 0 auto',
  borderBottom: '1px solid rgba(16,24,40,0.06)',
};

const bodyStyle = {
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
};

const footerStyle = {
  flex: '0 0 auto',
  borderTop: '1px solid rgba(16,24,40,0.06)',
  background: '#ffffff',
};

const mobileSheetHintStyle = {
  width: 48,
  height: 5,
  borderRadius: 999,
  background: 'rgba(16,24,40,0.12)',
  margin: '0 auto 16px auto',
};

const stepBadgeStyle = function () {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
  };
};

const summaryPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  borderRadius: 999,
  background: 'rgba(16,24,40,0.04)',
};

const compactMetaStyle = {
  border: '1px solid rgba(16,24,40,0.08)',
  borderRadius: 16,
  padding: 16,
  background: '#ffffff',
};

const RetainerModal = function () {
  const { isOpen, purchaseState, closeRetainerPurchase } = useRetainerPurchase();
  const [hours, setHours] = useState(purchaseState.hours);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const snapshot = useMemo(function () {
    return getRetainerSnapshot(hours);
  }, [hours]);

  useEffect(function () {
    setHours(purchaseState.hours);
  }, [purchaseState.hours]);

  useEffect(function () {
    if (!isOpen) {
      setFormData(initialForm);
      setIsSubmitting(false);
      setIsVisible(false);
      setStep(1);
      return undefined;
    }

    const timer = window.setTimeout(function () {
      setIsVisible(true);
    }, 10);

    return function () {
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  const handleFieldChange = function (event) {
    const name = event.target.name;
    const value = event.target.value;

    setFormData(function (current) {
      return {
        ...current,
        [name]: value,
      };
    });
  };

  const handleClose = function () {
    setIsVisible(false);

    window.setTimeout(function () {
      closeRetainerPurchase();
    }, 220);
  };

  const nextStep = function () {
    if (step === 2 && !formData.brief.trim()) {
      toast.error('Please add a short brief before continuing.');
      return;
    }

    setStep(function (current) {
      return Math.min(current + 1, 3);
    });
  };

  const previousStep = function () {
    setStep(function (current) {
      return Math.max(current - 1, 1);
    });
  };

  const handleSubmit = async function (event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetchPostJSON('/api/retainer/checkout', {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        brief: formData.brief,
        source: purchaseState.source,
        commitmentHours: snapshot.hours,
      });

      if (!response || !response.ok) {
        throw new Error((response && response.message) || 'Unable to start checkout right now.');
      }

      if (response.mode === 'stub') {
        toast.error(response.message || 'Stripe checkout is not configured yet.');
        return;
      }

      if (response.checkoutUrl && typeof window !== 'undefined') {
        window.location.href = response.checkoutUrl;
        return;
      }

      toast.success('Retainer request captured. Stripe checkout is ready to connect.');
      closeRetainerPurchase();
    } catch (error) {
      toast.error(error.message || 'Unable to start checkout right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close retainer sheet"
        onClick={handleClose}
        style={overlayStyle(isVisible)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="retainer-sheet-title"
        className="bg-white"
        style={shellStyle(isVisible)}
      >
        <div className="p-20 p-lg-25" style={headerStyle}>
          <div style={mobileSheetHintStyle} />

          <div className="d-flex justify-content-between align-items-start" style={{ gap: 16 }}>
            <div>
              <span className="text-body-capitalized color-gray-500 text-uppercase">
                Monthly retainer
              </span>
              <h3 id="retainer-sheet-title" className="text-heading-4 color-gray-900 mt-10 mb-10">
                Start a flexible support partnership
              </h3>
              <p className="text-body-text-md color-gray-600 mb-0">
                Set your monthly rhythm, share a short brief, and continue when you&apos;re ready.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="btn btn-link p-0 text-heading-6"
              aria-label="Close retainer sheet"
            >
              Close
            </button>
          </div>

          <div
            className="d-flex align-items-center justify-content-between flex-wrap mt-20"
            style={{ gap: 12 }}
          >
            <div className="d-flex align-items-center flex-wrap" style={{ gap: 8 }}>
              {steps.map(function (item) {
                const isActive = item.id === step;

                return (
                  <span
                    key={item.id}
                    className={
                      isActive
                        ? 'tag-1 bg-6 color-green-900'
                        : 'text-body-small color-gray-500'
                    }
                    style={stepBadgeStyle()}
                  >
                    {item.id}. {item.label}
                  </span>
                );
              })}
            </div>

            <span className="text-body-small color-gray-600" style={summaryPillStyle}>
              {snapshot.hours}h / mo
              <span className="color-gray-400">•</span>
              ${snapshot.monthlyTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={bodyStyle}>
          <form id="retainer-sheet-form" onSubmit={handleSubmit} className="p-20 p-lg-25">
            {step === 1 && (
              <div>
                <RetainerBuilder
                  compact
                  hours={hours}
                  onHoursChange={setHours}
                  title="Choose your monthly support level"
                  subtitle="Set a monthly pace for design, development, product support, implementation, and ongoing improvements."
                />

                <div className="mt-20" style={compactMetaStyle}>
                  <div className="row">
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Hours</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        {snapshot.hours}/mo
                      </div>
                    </div>
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Rate</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        ${snapshot.effectiveRate}/hr
                      </div>
                    </div>
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Total</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        ${snapshot.monthlyTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="bg-2 bdrd-16 p-20">
                  <span className="text-body-capitalized color-gray-500 text-uppercase">
                    Project brief
                  </span>
                  <h4 className="text-heading-5 color-gray-900 mt-10 mb-15">
                    What do you need help with?
                  </h4>
                  <p className="text-body-text-md color-gray-600 mb-20">
                    A short brief is enough. One project, ongoing support, or a mix is fine.
                  </p>

                  <div className="form-group mb-15">
                    <textarea
                      className="form-control"
                      name="brief"
                      rows="5"
                      placeholder="Website updates, UX/UI improvements, app work, implementation, maintenance, strategy, or a mix."
                      value={formData.brief}
                      onChange={handleFieldChange}
                    />
                  </div>

                  <div className="form-group mb-0">
                    <input
                      className="form-control"
                      name="company"
                      type="text"
                      placeholder="Company (optional)"
                      value={formData.company}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="bg-2 bdrd-16 p-20 mb-20">
                  <span className="text-body-capitalized color-gray-500 text-uppercase">
                    Contact
                  </span>
                  <h4 className="text-heading-5 color-gray-900 mt-10 mb-15">
                    Where should we send the next step?
                  </h4>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group mb-15">
                        <input
                          className="form-control"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleFieldChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-15">
                        <input
                          className="form-control"
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleFieldChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-body-small color-gray-500 mb-0">
                    Your selected commitment and brief will be included with checkout metadata.
                  </p>
                </div>

                <div style={compactMetaStyle}>
                  <span className="text-body-capitalized color-gray-500 text-uppercase">
                    Final details
                  </span>

                  <div className="row mt-15">
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Hours</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        {snapshot.hours}/mo
                      </div>
                    </div>
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Rate</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        ${snapshot.effectiveRate}/hr
                      </div>
                    </div>
                    <div className="col-4">
                      <span className="text-body-small color-gray-500">Total</span>
                      <div className="text-heading-7 color-gray-900 mt-5">
                        ${snapshot.monthlyTotal.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {formData.company ? (
                    <div className="mt-15 text-body-small color-gray-500">{formData.company}</div>
                  ) : null}

                  {formData.brief ? (
                    <p className="text-body-text-md color-gray-600 mt-15 mb-0">
                      {formData.brief}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-20 p-lg-25" style={footerStyle}>
          <div className="d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 12 }}>
            <div>
              {step > 1 ? (
                <button
                  className="btn btn-link text-heading-6 p-0"
                  type="button"
                  onClick={previousStep}
                >
                  Back
                </button>
              ) : (
                <span className="text-body-small color-gray-500">
                  Step {step} of {steps.length}
                </span>
              )}
            </div>

            <div>
              {step < 3 ? (
                <button
                  className="btn btn-black icon-arrow-right-white"
                  type="button"
                  onClick={nextStep}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="btn btn-black icon-arrow-right-white"
                  type="submit"
                  form="retainer-sheet-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Preparing checkout' : 'Continue'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetainerModal;