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
  Award
} from 'lucide-react';
import { PageView } from '../types';

interface StaticPagesProps {
  page: PageView;
  onBackToShop: () => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ page, onBackToShop }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

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
      a: 'All our garments follow true-to-size standard Indian measurements. Our pajamas and track pants feature an elasticized waistband with custom drawcords, giving you 2-3 inches of flex comfort. Refer to the interactive Size Guide on any product page for exact chest and waist metrics.'
    },
    {
      q: 'How long will delivery take to my city?',
      a: 'Metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata) typically receive deliveries within 2 to 3 business days. Tier-2 and Tier-3 cities receive delivery within 3 to 5 business days via Blue Dart and Delhivery Express.'
    },
    {
      q: 'How should I care for my Raghav Garments bomber jacket or tracksuits?',
      a: 'We recommend gentle machine wash inside-out with cold water. Avoid high heat tumble drying or direct harsh sunlight exposure to preserve rich pigment vibrancy and metallic zipper finishes.'
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

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <button onClick={onBackToShop} className="hover:text-[#1455D9] font-medium">Home</button>
          <span>/</span>
          <span className="capitalize font-semibold text-slate-800">
            {page === 'about' ? 'About Us' : page === 'contact' ? 'Contact Us' : 'Frequently Asked Questions'}
          </span>
        </div>

        {/* --- 1. ABOUT US PAGE --- */}
        {page === 'about' && (
          <div className="space-y-12">
            {/* Header */}
            <div className="bg-[#080B12] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Our Story & Craft
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading mt-2 leading-tight">
                  DEFINING MODERN INDIAN MENSWEAR
                </h1>
                <p className="text-slate-300 mt-4 text-sm sm:text-base leading-relaxed">
                  Founded with a singular vision: to deliver luxurious fabric handfeel, sharp contemporary aesthetics, and unrivaled daily durability for modern men.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-15 w-96 h-96 pointer-events-none">
                <Building2 className="w-full h-full text-white" />
              </div>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Obsessive Material Selection
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  We reject scratchy synthetic poly blends for foundational wear. Every piece is woven from long-staple Indian combed cotton, pure European linens, and high-tenacity technical nylon.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Engineered Anatomical Cut
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Generic international fits fail Indian bodies. Our patterns feature refined taper angles, articulated knees, and auto-flex waistbands for supreme comfort during travel and office hours.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1455D9] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Direct Honest Pricing
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  By cutting out middle-tier retail markups and luxury distributor margins, we bring you world-class craftsmanship at genuine, transparent Indian Rupee pricing.
                </p>
              </div>
            </div>

            {/* Quality Promise */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-center gap-8">
              <img
                src="/src/assets/images/hero_mens_fashion_lifestyle_1793694584426.jpg"
                alt="Raghav Garments team tailoring"
                className="w-full md:w-1/2 aspect-video object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  "Style is what gives you confidence when you step out."
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  From our signature dual-tone royal bomber jackets to ultra-comfortable night pajamas and pro-performance tracksuits, Raghav Garments is dedicated to making you feel sharp, composed, and effortlessly stylish.
                </p>
                <button
                  onClick={onBackToShop}
                  className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Explore Current Drop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. CONTACT US PAGE --- */}
        {page === 'contact' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">
                Here To Assist You
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                CONTACT RAGHAV GARMENTS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Have questions about sizing, bulk ordering, or delivery? Our dedicated concierge team is at your service.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Contact Information Cards (lg: 5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm font-heading">
                    Customer Concierge Desk
                  </h3>

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
                      <p className="text-slate-600">support@raghavgarments.com</p>
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
                      <p className="font-semibold text-slate-800">Delhi Flagship Atelier & Experience Hub</p>
                      <p className="text-slate-600">
                        Raghav Garments, 24-B Fashion Boulevard, Near South Extension, Ring Road, New Delhi, 110049
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs text-emerald-900 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">WhatsApp Priority Support</span>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Chat directly with our styling specialist at +91 98712 34567 for quick size guidance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form (lg: 7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-base font-heading mb-4">
                  Send Us A Message
                </h3>

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
                      className="w-full sm:w-auto bg-[#1455D9] hover:bg-[#0F42A8] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. FAQ ACCORDION PAGE --- */}
        {page === 'faq' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">
                Help Center
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                FREQUENTLY ASKED QUESTIONS
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Everything you need to know about ordering, delivery, sizing, returns, and fabrics at Raghav Garments.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden shadow-xs">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                        {faq.q}
                      </span>
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

            <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-2xl text-center">
              <h3 className="font-bold text-slate-900 text-sm">Still have questions?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Our support team is available from 10 AM to 7:30 PM to assist you with any sizing questions.
              </p>
              <button
                onClick={onBackToShop}
                className="mt-3 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                Back To Store
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
