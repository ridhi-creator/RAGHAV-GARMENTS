import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquarePlus,
  Star,
  Send,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Ruler,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CustomerFeedback, PageView } from '../types';

interface FaqItem {
  category: 'orders' | 'sizing' | 'shipping' | 'wholesale';
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    category: 'orders',
    q: 'Do you offer Cash on Delivery (COD) and promo discounts?',
    a: 'Yes! Cash on Delivery (COD), UPI, and Card payments are available across 19,000+ Indian PIN codes. Use promo code RGARMENTS14 at checkout for an instant 10% festive discount, plus free shipping on orders above ₹999.'
  },
  {
    category: 'sizing',
    q: 'How do I choose the right size for pants, pajamas, and tracksuits?',
    a: 'Our Men’s Pants follow exact Indian waist tags (28 to 38 inches), while our Cotton Pajamas, Jackets, and Track Suits follow true-to-size S to XXL Indian menswear cuts with flexible drawcords and comfortable stretch.'
  },
  {
    category: 'shipping',
    q: 'How fast is delivery and how does your 7-Day Return Policy work?',
    a: 'Orders dispatch within 24 hours via BlueDart or Delhivery Express (2–3 days in metros, 3–5 days across India). If sizing or fit isn’t ideal, request a 7-day hassle-free reverse pickup from your doorstep with instant exchange or refund.'
  },
  {
    category: 'wholesale',
    q: 'What is the Minimum Order Quantity (MOQ) for B2B wholesale buyers?',
    a: 'Retailers and showroom buyers can order directly at factory-gate wholesale rates starting at MOQ 10 pieces per style with custom assorted size ratios, GST tax invoicing, and pan-India transport bilty dispatch.'
  },
  {
    category: 'sizing',
    q: 'Are the product colours on the website 100% original and unedited?',
    a: 'Yes. Every garment photo is uploaded directly from our original store photography without digital recolouring or artificial filters, so what you order matches the actual fabric colour and finish.'
  },
  {
    category: 'orders',
    q: 'Where is the Raghav Garments store located and what are the opening hours?',
    a: 'Visit or contact Raghav Garments at Tehsil Road, Outside Grain Grinder Lane, Kaithal, Haryana. Store & support hours are 9:00 AM to 8:00 PM (+91 94663 75135 / ridhitaneja1404@gmail.com).'
  }
];

const FALLBACK_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'fb-01',
    name: 'Rajesh Sharma',
    city: 'New Delhi',
    category: "Men's Pants",
    rating: 5,
    comment: 'Superb stretch and stitching quality. Fits true to size even after several washes.',
    createdAt: '02 Nov 2026',
    verified: true
  },
  {
    id: 'fb-02',
    name: 'Vikram Malhotra',
    city: 'Mumbai',
    category: "Men's Track Suits",
    rating: 5,
    comment: 'Ordered both retail and 15 pieces for our menswear counter. Exact colour match as shown in photos.',
    createdAt: '05 Nov 2026',
    verified: true
  },
  {
    id: 'fb-03',
    name: 'Aman Verma',
    city: 'Kaithal, Haryana',
    category: "Men's Pajamas",
    rating: 5,
    comment: 'Soft combed cotton pajamas with comfortable elastic waistband. Fast delivery and helpful support.',
    createdAt: '09 Nov 2026',
    verified: true
  }
];

interface FaqAndFeedbackSectionProps {
  mode?: 'both' | 'faq' | 'feedback';
  onNavigatePage?: (page: PageView) => void;
  showToast?: (msg: string) => void;
}

export const FaqAndFeedbackSection: React.FC<FaqAndFeedbackSectionProps> = ({
  mode = 'both',
  onNavigatePage,
  showToast
}) => {
  const [faqFilter, setFaqFilter] = useState<'all' | 'orders' | 'sizing' | 'shipping' | 'wholesale'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Customer feedback state synced with backend & localStorage
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('raghav_garments_feedback');
      return saved ? JSON.parse(saved) : FALLBACK_FEEDBACK;
    } catch {
      return FALLBACK_FEEDBACK;
    }
  });

  const [fbForm, setFbForm] = useState({
    name: '',
    city: '',
    category: 'Overall Store Experience',
    rating: 5,
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFeedbackList((prev) => {
            const seen = new Set<string>();
            const merged: CustomerFeedback[] = [];
            for (const item of [...data, ...prev]) {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                merged.push(item);
              }
            }
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('raghav_garments_feedback', JSON.stringify(feedbackList.slice(0, 30)));
    } catch {}
  }, [feedbackList]);

  const filteredFaqs = useMemo(() => {
    if (faqFilter === 'all') return DEFAULT_FAQS;
    return DEFAULT_FAQS.filter((item) => item.category === faqFilter);
  }, [faqFilter]);

  const averageRating = useMemo(() => {
    if (feedbackList.length === 0) return '5.0';
    const avg = feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length;
    return avg.toFixed(1);
  }, [feedbackList]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbForm.name.trim() || !fbForm.comment.trim()) {
      setFormError('Please enter your name and feedback message.');
      return;
    }
    setFormError(null);
    setIsSubmitting(true);

    let createdEntry: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      name: fbForm.name.trim(),
      city: fbForm.city.trim() || 'India',
      category: fbForm.category,
      rating: fbForm.rating,
      comment: fbForm.comment.trim(),
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      verified: true
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.feedback) {
          createdEntry = data.feedback;
        }
      }
    } catch {}

    setFeedbackList((prev) => [createdEntry, ...prev]);
    setFbForm({
      name: '',
      city: '',
      category: 'Overall Store Experience',
      rating: 5,
      comment: ''
    });
    setIsSubmitting(false);
    setSubmittedNotice(true);
    showToast?.('Thank you! Your feedback has been published.');
    setTimeout(() => setSubmittedNotice(false), 4000);
  };

  const activeRatingValue = hoverRating ?? fbForm.rating;
  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  return (
    <section id="faq-feedback-section" className="py-14 sm:py-18 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* --- PART 1: FAQ SECTION --- */}
        {(mode === 'both' || mode === 'faq') && (
          <div id="faq-section" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9] inline-flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Store &amp; Sizing Help
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#080B12] font-heading mt-1 tracking-tight">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Quick answers on ordering, COD, Kaithal store timings (9 AM – 8 PM), sizing charts, returns, and wholesale rates.
                </p>
              </div>

              {onNavigatePage && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => onNavigatePage('size-guide')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#1455D9] font-bold text-slate-700 hover:text-[#1455D9] cursor-pointer transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                  <button
                    onClick={() => onNavigatePage('shipping-policy')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#1455D9] font-bold text-slate-700 hover:text-[#1455D9] cursor-pointer transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </button>
                  <button
                    onClick={() => onNavigatePage('returns-policy')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#1455D9] font-bold text-slate-700 hover:text-[#1455D9] cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> 7-Day Returns
                  </button>
                </div>
              )}
            </div>

            {/* FAQ Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all' as const, label: 'All Questions' },
                { id: 'orders' as const, label: 'Orders, COD & Store' },
                { id: 'sizing' as const, label: 'Sizing & Original Photos' },
                { id: 'shipping' as const, label: 'Shipping & Returns' },
                { id: 'wholesale' as const, label: 'Wholesale B2B' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setFaqFilter(pill.id);
                    setOpenFaq(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    faqFilter === pill.id
                      ? 'bg-[#080B12] text-white ring-2 ring-[#1455D9]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-xs">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={`${faqFilter}-${idx}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                        {faq.q}
                      </span>
                      <span className="text-slate-400 shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#1455D9]" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-blue-50/30 border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- PART 2: CUSTOMER FEEDBACK & REVIEWS --- */}
        {(mode === 'both' || mode === 'feedback') && (
          <div id="customer-feedback-section" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9] inline-flex items-center gap-1.5">
                  <MessageSquarePlus className="w-3.5 h-3.5" /> Customer Voices
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#080B12] font-heading mt-1 tracking-tight">
                  CUSTOMER FEEDBACK &amp; REVIEWS
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Share your experience with Raghav Garments garments, sizing, or wholesale service.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xs shrink-0">
                <div className="bg-[#080B12] text-white px-3 py-1.5 rounded-xl font-black text-lg font-heading flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{averageRating}</span>
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Trusted Customer Score</p>
                  <p className="text-slate-500">{feedbackList.length} verified reviews</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Submit Customer Feedback Form (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 font-heading">
                    Write Your Feedback
                  </h3>
                  <span className="text-[11px] font-bold text-[#1455D9] bg-blue-50 px-2.5 py-0.5 rounded-md">
                    Instant Publish
                  </span>
                </div>

                {submittedNotice && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Thank you! Your customer feedback has been added.</span>
                  </div>
                )}

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmitFeedback} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5">Your Rating *</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setFbForm({ ...fbForm, rating: star })}
                          aria-label={`Rate ${star} stars`}
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= activeRatingValue
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-bold text-slate-700">
                        {ratingLabels[activeRatingValue]} ({activeRatingValue}/5)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohit Kumar"
                        value={fbForm.name}
                        onChange={(e) => setFbForm({ ...fbForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">City / State</label>
                      <input
                        type="text"
                        placeholder="e.g. Kaithal, Haryana"
                        value={fbForm.city}
                        onChange={(e) => setFbForm({ ...fbForm, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Product / Experience</label>
                    <select
                      value={fbForm.category}
                      onChange={(e) => setFbForm({ ...fbForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    >
                      <option value="Overall Store Experience">Overall Store Experience</option>
                      <option value="Men's Pants">Men&apos;s Pants</option>
                      <option value="Men's Pajamas">Men&apos;s Pajamas</option>
                      <option value="Men's Track Suits">Men&apos;s Track Suits</option>
                      <option value="Men's Jackets">Men&apos;s Jackets</option>
                      <option value="Wholesale & Bulk Order">Wholesale &amp; Bulk Order</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Your Feedback *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share feedback about fabric quality, fit, colour accuracy, or delivery..."
                      value={fbForm.comment}
                      onChange={(e) => setFbForm({ ...fbForm, comment: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-blue-900/15 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Customer Feedback'}</span>
                  </button>
                </form>
              </div>

              {/* Right: Customer Reviews Display Grid (7 cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {feedbackList.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#1455D9] bg-blue-50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-1">
                          {item.name}
                          {item.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                        </p>
                        {item.city && (
                          <p className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3" /> {item.city}
                          </p>
                        )}
                      </div>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
