import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
  Truck,
  RotateCcw,
  Ruler,
  FileText,
  Scale,
  AlertTriangle
} from 'lucide-react';
import { PageView, ActiveTab } from '../types';

interface StaticPagesProps {
  page: PageView;
  onBackToShop: () => void;
  onNavigatePage?: (page: PageView) => void;
  onBrowseCategory?: (tab: ActiveTab) => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({
  page,
  onBackToShop,
  onNavigatePage,
  onBrowseCategory
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sizeCategory, setSizeCategory] = useState<'pants' | 'pajamas' | 'jackets'>('pants');

  const faqs = [
    {
      q: 'What makes Raghav Garments different from other menswear brands?',
      a: 'We design specifically for Indian male body proportions and climate. Every garment undergoes intensive testing using long-staple combed cottons, shape-recovery interlocks, and reinforced stress-point stitching so your clothes look tailored even after 50+ wash cycles.'
    },
    {
      q: 'How does your 7-Day Hassle-Free Return Policy work?',
      a: 'If the fit or color is not 100% to your liking, request a return within 7 days of delivery. Our courier partner will pick up the package directly from your doorstep at zero extra cost, and your refund or exchange is processed instantly.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery (COD) is available on all pin codes across India with zero prepayment required. You can pay via cash or UPI scan directly to the delivery personnel.'
    },
    {
      q: 'How do I choose the right size for pajamas and tracksuits?',
      a: 'All our garments follow true-to-size standard Indian measurements. Our pajamas and track pants feature an elasticized waistband with custom drawcords, giving you 2-3 inches of flex comfort. Refer to our dedicated Size Guide page for exact chest and waist metrics.'
    },
    {
      q: 'How long will delivery take to my city?',
      a: 'Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) typically receive deliveries within 2 to 3 business days. Tier-2 and Tier-3 cities receive delivery within 3 to 5 business days via Blue Dart and Delhivery Express.'
    },
    {
      q: 'Do you accept wholesale and bulk B2B orders?',
      a: 'Yes! Retailers and boutique owners can order directly at manufacturer rates starting at MOQ 10 pieces per style with full GST invoicing and pan-India transport billing.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSubmitted(false);
    }, 4000);
  };

  const breadcrumbLabel: Record<string, string> = {
    about: 'About Us',
    contact: 'Contact Us',
    faq: 'Frequently Asked Questions',
    'shipping-policy': 'Shipping & Delivery Policy',
    'returns-policy': 'Returns & Exchange Policy',
    'size-guide': 'Size Chart & Fitting Guide',
    'privacy-policy': 'Privacy Policy',
    terms: 'Terms of Service',
    'not-found': 'Page Not Found'
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <button onClick={onBackToShop} className="hover:text-[#1455D9] font-medium cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">{breadcrumbLabel[page] || 'Information'}</span>
        </div>

        {/* --- 1. ABOUT US PAGE --- */}
        {page === 'about' && (
          <div className="space-y-12">
            <div className="bg-[#080B12] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Our Story &amp; Craft
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading mt-2 leading-tight">
                  DEFINING MODERN INDIAN MENSWEAR
                </h1>
                <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed">
                  Founded with a singular vision: to deliver luxurious fabric handfeel, sharp contemporary aesthetics, and unrivaled daily durability for modern men and wholesale retail partners across India.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-15 w-96 h-96 pointer-events-none">
                <Building2 className="w-full h-full text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Obsessive Material Selection</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Every piece is woven from long-staple Indian combed cotton, stretch cotton twills, and high-tenacity technical nylon with 100% authentic unedited store photography.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Engineered Anatomical Cut</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Our patterns feature refined taper angles, articulated knees, and auto-flex waistbands for effortless comfort during travel, gym sessions, and work hours.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Direct Factory &amp; Retail Pricing</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Supplying 500+ Indian retail counters and direct D2C customers with transparent GST-compliant pricing and 48-hour express dispatch.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-8">
              <img
                src="/assets/images/hero_mens_fashion_lifestyle_1793694584426.jpg"
                alt="Raghav Garments menswear studio"
                className="w-full md:w-1/2 aspect-video object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  &ldquo;Style is what gives you confidence when you step out.&rdquo;
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  From our signature dual-tone bomber jackets to ultra-comfortable cotton pajamas, denim-flex pants, and pro-performance tracksuits, Raghav Garments is dedicated to keeping you sharp and composed every day.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onBackToShop}
                    className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Explore Current Drop
                  </button>
                  {onNavigatePage && (
                    <button
                      onClick={() => onNavigatePage('wholesale')}
                      className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      B2B Wholesale Program
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. CONTACT US PAGE --- */}
        {page === 'contact' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Here To Assist You</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                CONTACT RAGHAV GARMENTS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Have questions about sizing, wholesale bulk ordering, or delivery? Our concierge desk is ready to help.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm font-heading">Customer Concierge Desk</h3>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#1455D9] mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Direct Phone Support</p>
                      <p className="text-slate-600">+91 98712 34567 / +91 11 4567 8900</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#1455D9] mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Email Inquiry</p>
                      <p className="text-slate-600">care@raghavgarments.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#1455D9] mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Operating Hours</p>
                      <p className="text-slate-600">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#1455D9] mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">Delhi Flagship Atelier &amp; Wholesale Hub</p>
                      <p className="text-slate-600">
                        Raghav Garments, 24-B Fashion Boulevard, Ring Road, New Delhi, 110049, India
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">WhatsApp Priority Support</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Chat directly at +91 98712 34567 for quick size guidance or bulk wholesale catalogs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base font-heading mb-4">Send Us A Message</h3>
                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-800 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="font-bold text-sm">Message Received Successfully!</p>
                    <p className="text-xs text-emerald-700">
                      Our customer support team will review your query and reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                          placeholder="e.g. Vikram Verma"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                          placeholder="vikram@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="Order status / Size query / Bulk purchase"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Your Message</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="Tell us how we can assist you..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#1455D9] hover:bg-[#0F42A8] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. FAQ PAGE --- */}
        {page === 'faq' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Help Center</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                FREQUENTLY ASKED QUESTIONS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Everything you need to know about ordering, delivery, sizing, returns, and wholesale supply.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-xs">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base font-heading">{faq.q}</span>
                      <span className="text-slate-400 p-1">
                        {isOpen ? <ChevronUp className="w-5 h-5 text-[#1455D9]" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {onNavigatePage && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <button
                  onClick={() => onNavigatePage('shipping-policy')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#1455D9] text-left cursor-pointer"
                >
                  <Truck className="w-5 h-5 text-[#1455D9] mb-2" />
                  <p className="font-bold text-slate-900">Shipping &amp; Delivery &rarr;</p>
                  <p className="text-slate-500 mt-0.5">Timelines, couriers &amp; COD rules</p>
                </button>
                <button
                  onClick={() => onNavigatePage('returns-policy')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#1455D9] text-left cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5 text-[#1455D9] mb-2" />
                  <p className="font-bold text-slate-900">7-Day Returns Policy &rarr;</p>
                  <p className="text-slate-500 mt-0.5">Reverse pickup &amp; instant refund info</p>
                </button>
                <button
                  onClick={() => onNavigatePage('size-guide')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#1455D9] text-left cursor-pointer"
                >
                  <Ruler className="w-5 h-5 text-[#1455D9] mb-2" />
                  <p className="font-bold text-slate-900">Size Chart &amp; Fitting &rarr;</p>
                  <p className="text-slate-500 mt-0.5">Inches &amp; cm charts for all items</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- 4. SHIPPING & DELIVERY POLICY --- */}
        {page === 'shipping-policy' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1455D9] flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Logistics &amp; Dispatch</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  SHIPPING &amp; DELIVERY POLICY
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 text-sm">Metro Cities</p>
                <p className="text-[#1455D9] font-extrabold text-lg mt-1">2–3 Business Days</p>
                <p className="text-slate-500 mt-1">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 text-sm">Rest of India</p>
                <p className="text-[#1455D9] font-extrabold text-lg mt-1">3–5 Business Days</p>
                <p className="text-slate-500 mt-1">Tier-2, Tier-3 towns &amp; remote serviceable PIN codes</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <p className="font-bold text-slate-900 text-sm">Free Shipping Threshold</p>
                <p className="text-emerald-700 font-extrabold text-lg mt-1">Orders ₹999+</p>
                <p className="text-slate-600 mt-1">Flat ₹99 express fee below ₹999</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">1. Order Processing &amp; Dispatch</h2>
                <p>
                  All retail orders placed before 2:00 PM IST (Monday–Saturday) are quality-checked, steamed, and dispatched the same day from our New Delhi fulfillment center via BlueDart Air Express or Delhivery Surface/Air.
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">2. Cash on Delivery (COD) Across India</h2>
                <p>
                  COD is supported across 19,000+ Indian PIN codes with zero extra surcharge on orders above ₹999. Customers may pay in cash or via UPI QR scan at the time of parcel handoff.
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">3. B2B Wholesale Freight &amp; Transport Bilty</h2>
                <p>
                  Bulk cartons (10+ pieces) are dispatched within 48 hours via your preferred transport carrier (VRL Logistics, TCI Express, Gati, or local Delhi Transport Nagar bilty services) with GST e-Way billing when applicable.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('order-tracking')}
                  className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Track an Existing Order
                </button>
              )}
              <button
                onClick={onBackToShop}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* --- 5. RETURNS & EXCHANGE POLICY --- */}
        {page === 'returns-policy' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1455D9] flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Customer Protection</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  7-DAY EASY RETURNS &amp; EXCHANGE POLICY
                </h1>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">1. 7-Day Window from Delivery</h2>
                <p>
                  If your selected garment does not fit as expected or you wish to switch colours/sizes, you can initiate an exchange or full refund within 7 calendar days of delivery.
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">2. Eligibility Conditions</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Garment must be unworn, unwashed, and retain original price tags and barcode packaging.</li>
                  <li>Reverse pickup is arranged at zero cost from your doorstep within 24–48 hours of approval.</li>
                  <li>Size exchanges are dispatched immediately once the reverse courier scans the return parcel.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">3. Refund Timelines</h2>
                <p>
                  UPI and card payments are refunded to the original source within 2–4 business days. Cash on Delivery (COD) orders are refunded via instant UPI bank transfer once quality inspection is completed.
                </p>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading mb-1">4. B2B Wholesale Claim Guarantee</h2>
                <p>
                  Wholesale buyers receive 100% free piece-to-piece replacement for any manufacturing defect reported within 10 days of carton receipt.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('orders')}
                  className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  View My Orders
                </button>
              )}
              <button
                onClick={onBackToShop}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        )}

        {/* --- 6. SIZE CHART & FITTING GUIDE --- */}
        {page === 'size-guide' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1455D9] flex items-center justify-center shrink-0">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Indian Menswear Spec</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">
                  SIZE CHART &amp; FITTING GUIDE
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'pants' as const, label: "Men's Pants & Denim Chinos (28–38)" },
                { id: 'pajamas' as const, label: "Men's Pajamas & Track Pants (S–XXL)" },
                { id: 'jackets' as const, label: "Men's Jackets & Tracksuit Tops (S–XXL)" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSizeCategory(t.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    sizeCategory === t.id
                      ? 'bg-[#1455D9] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              {sizeCategory === 'pants' && (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#080B12] text-white uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Tag Size</th>
                      <th className="px-4 py-3">Waist (Inches)</th>
                      <th className="px-4 py-3">Hip (Inches)</th>
                      <th className="px-4 py-3">Outseam Length</th>
                      <th className="px-4 py-3">Thigh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {[
                      ['28', '28.5"', '36"', '39.5"', '21.5"'],
                      ['30', '30.5"', '38"', '40.0"', '22.5"'],
                      ['32', '32.5"', '40"', '40.5"', '23.5"'],
                      ['34', '34.5"', '42"', '41.0"', '24.5"'],
                      ['36', '36.5"', '44"', '41.5"', '25.5"'],
                      ['38', '38.5"', '46"', '42.0"', '26.5"']
                    ].map((row) => (
                      <tr key={row[0]} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-black text-[#1455D9]">{row[0]}</td>
                        <td className="px-4 py-3">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        <td className="px-4 py-3">{row[3]}</td>
                        <td className="px-4 py-3">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {sizeCategory === 'pajamas' && (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#080B12] text-white uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Fits Waist</th>
                      <th className="px-4 py-3">Relaxed Waist</th>
                      <th className="px-4 py-3">Hip</th>
                      <th className="px-4 py-3">Full Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {[
                      ['S', '28"–30"', '26"', '39"', '39.0"'],
                      ['M', '30"–32"', '28"', '41"', '39.5"'],
                      ['L', '32"–34"', '30"', '43"', '40.5"'],
                      ['XL', '34"–36"', '32"', '45"', '41.0"'],
                      ['XXL', '36"–38"', '34"', '47"', '41.5"']
                    ].map((row) => (
                      <tr key={row[0]} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-black text-[#1455D9]">{row[0]}</td>
                        <td className="px-4 py-3">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        <td className="px-4 py-3">{row[3]}</td>
                        <td className="px-4 py-3">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {sizeCategory === 'jackets' && (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#080B12] text-white uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Chest (Garment)</th>
                      <th className="px-4 py-3">Shoulder</th>
                      <th className="px-4 py-3">Length</th>
                      <th className="px-4 py-3">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {[
                      ['S', '40"', '17.0"', '26.0"', '24.5"'],
                      ['M', '42"', '17.5"', '27.0"', '25.0"'],
                      ['L', '44"', '18.2"', '28.0"', '25.5"'],
                      ['XL', '46"', '19.0"', '29.0"', '26.0"'],
                      ['XXL', '48"', '19.8"', '30.0"', '26.5"']
                    ].map((row) => (
                      <tr key={row[0]} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-black text-[#1455D9]">{row[0]}</td>
                        <td className="px-4 py-3">{row[1]}</td>
                        <td className="px-4 py-3">{row[2]}</td>
                        <td className="px-4 py-3">{row[3]}</td>
                        <td className="px-4 py-3">{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-slate-700">
              <strong className="text-slate-900">How to Measure:</strong> Measure around the fullest part of your chest or natural waistline using a flexible tape without pulling too tight. Between two sizes? Pick the larger size for relaxed lounge comfort.
            </div>
          </div>
        )}

        {/* --- 7. PRIVACY POLICY --- */}
        {page === 'privacy-policy' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1455D9] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Data Protection</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">PRIVACY POLICY</h1>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Raghav Garments values your privacy and protects your personal information in accordance with applicable Indian IT and data protection regulations.
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">1. Information We Collect</h2>
              <p>
                We collect your name, phone number, email address, shipping destination, and GSTIN (for wholesale orders) solely to process deliveries, generate tax invoices, and provide real-time parcel tracking.
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">2. Payment &amp; Browser Security</h2>
              <p>
                Online payments are encrypted over HTTPS. We never store your full card numbers or UPI PINs on Raghav Garments servers. Local browser storage is used strictly to preserve your shopping cart and wishlist across reloads.
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">3. Contact Privacy Officer</h2>
              <p>
                For data removal or correction requests, write to <strong>care@raghavgarments.com</strong> or call +91 98712 34567.
              </p>
            </div>
          </div>
        )}

        {/* --- 8. TERMS OF SERVICE --- */}
        {page === 'terms' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-start gap-4 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1455D9] flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Legal Terms</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">TERMS OF SERVICE</h1>
              </div>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                By placing retail or wholesale B2B orders on Raghav Garments, you agree to the following commercial and storefront terms:
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">1. Pricing &amp; Taxes</h2>
              <p>
                All listed storefront prices are in Indian Rupees (INR) inclusive of GST. Festive promo code <strong>RGARMENTS14</strong> grants 10% instant retail discount during active campaigns.
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">2. Wholesale MOQ &amp; Dispatch</h2>
              <p>
                Wholesale tiered discounts apply to qualifying B2B orders of 10 pieces or more. Custom size assortment dispatches are billed under GSTIN <strong>07AABCR1404R1ZX</strong>.
              </p>
              <h2 className="text-base font-bold text-slate-900 font-heading">3. Governing Law</h2>
              <p>
                All disputes are subject to the exclusive jurisdiction of courts in New Delhi, India.
              </p>
            </div>
          </div>
        )}

        {/* --- 9. 404 PAGE NOT FOUND --- */}
        {page === 'not-found' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center shadow-xs space-y-6">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">Error 404</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                PAGE NOT FOUND
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
                The link you followed may be outdated or misspelled. Choose one of our active collections or support pages below.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={onBackToShop}
                className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Go to Homepage
              </button>
              {onBrowseCategory && (
                <>
                  <button
                    onClick={() => onBrowseCategory('pants')}
                    className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Men&apos;s Pants
                  </button>
                  <button
                    onClick={() => onBrowseCategory('pajamas')}
                    className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Men&apos;s Pajamas
                  </button>
                  <button
                    onClick={() => onBrowseCategory('tracksuits')}
                    className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Men&apos;s Track Suits
                  </button>
                </>
              )}
              {onNavigatePage && (
                <button
                  onClick={() => onNavigatePage('order-tracking')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
