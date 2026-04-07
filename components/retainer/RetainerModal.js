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

const RetainerModal = () => {
  const { isOpen, purchaseState, closeRetainerPurchase } = useRetainerPurchase();
  const [hours, setHours] = useState(purchaseState.hours);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const snapshot = useMemo(() => getRetainerSnapshot(hours), [hours]);

  useEffect(() => {
    setHours(purchaseState.hours);
  }, [purchaseState.hours]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setIsSubmitting(false);
      return undefined;
    }
  }, [isOpen]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
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
        effectiveRate: snapshot.effectiveRate,
        monthlyTotal: snapshot.monthlyTotal,
        supportLabel: snapshot.supportLabel,
      });

      if (!response?.ok) {
        throw new Error(response?.message || 'Unable to start checkout right now.');
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
        onClick={closeRetainerPurchase}
        aria-label="Close retainer purchase flow"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(16,24,40,0.25)',
          border: 0,
          zIndex: 999,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="retainer-modal-title"
        className="bg-white"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 16,
          transform: 'translateX(-50%)',
          width: 'min(1120px, calc(100vw - 24px))',
          maxHeight: 'calc(100vh - 32px)',
          overflowY: 'auto',
          zIndex: 1000,
          borderRadius: 24,
          boxShadow: '0 24px 70px rgba(16,24,40,0.18)',
          border: '1px solid rgba(16,24,40,0.08)',
        }}
      >
        <div className="p-25 p-lg-30">
          <div className="d-flex justify-content-between align-items-start mb-20">
            <div>
              <span className="text-body-capitalized color-gray-500 text-uppercase">Monthly retainer</span>
              <h3 id="retainer-modal-title" className="text-heading-3 color-gray-900 mt-10">Start a flexible support partnership</h3>
              <p className="text-body-text color-gray-600 mt-10 mb-0">
                Choose a monthly rhythm, share a short brief, and continue when you&apos;re ready.
              </p>
            </div>
            <button type="button" onClick={closeRetainerPurchase} className="btn btn-link text-heading-6 p-0">
              Close
            </button>
          </div>

          <div className="row">
            <div className="col-lg-6 mb-30 mb-lg-0">
              <RetainerBuilder
                compact
                hours={hours}
                onHoursChange={setHours}
                title="Choose the level of support"
                subtitle="A simple monthly structure for design, development, strategy, enhancements, and ongoing digital execution."
              />
            </div>

            <div className="col-lg-6">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input className="form-control" name="name" type="text" placeholder="Your name" value={formData.name} onChange={handleFieldChange} required />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <input className="form-control" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleFieldChange} required />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input className="form-control" name="company" type="text" placeholder="Company (optional)" value={formData.company} onChange={handleFieldChange} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="brief"
                        rows="4"
                        placeholder="A short brief is enough — website work, UX/UI, product support, app enhancements, SEO implementation, maintenance, or a mix."
                        value={formData.brief}
                        onChange={handleFieldChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-2 bdrd-16 p-20 mb-20">
                  <div className="row">
                    <div className="col-4">
                      <span className="text-body-capitalized color-gray-500 text-uppercase">Hours</span>
                      <p className="text-heading-6 color-gray-900 mt-10 mb-0">{snapshot.hours}/mo</p>
                    </div>
                    <div className="col-4">
                      <span className="text-body-capitalized color-gray-500 text-uppercase">Rate</span>
                      <p className="text-heading-6 color-gray-900 mt-10 mb-0">${snapshot.effectiveRate}/hr</p>
                    </div>
                    <div className="col-4">
                      <span className="text-body-capitalized color-gray-500 text-uppercase">Total</span>
                      <p className="text-heading-6 color-gray-900 mt-10 mb-0">${snapshot.monthlyTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-3">
                  <button className="btn btn-black icon-arrow-right-white" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Preparing checkout' : 'Continue'}
                  </button>
                  <span className="text-body-text-md color-gray-500">
                    Stripe metadata includes commitment, rate, total, brief, and contact details.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetainerModal;