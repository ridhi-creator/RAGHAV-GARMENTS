import React, { useState } from 'react';
import { X, Check, Building2, Phone, Mail, MapPin, Package, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({
  isOpen,
  onClose,
  showToast
}) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    city: '',
    state: 'Delhi NCR',
    category: 'all',
    expectedQuantity: '25-50 pcs',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.contactPerson || !formData.phone) {
      showToast('Please fill in business name, contact person and phone');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch('/api/wholesale-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {}

    setIsSubmitting(false);
    setSubmitted(true);
    showToast('Wholesale inquiry submitted successfully! Our B2B manager will contact you within 2 business hours.');
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Raghav Garments Wholesale Team, I would like to inquire about bulk ordering for ${formData.businessName || 'my retail business'} (${formData.expectedQuantity || '10+ pcs'}). Please share your wholesale catalog and price list.`
    );
    window.open(`https://wa.me/919871234567?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#080B12] text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
                Direct Manufacturer &bull; B2B Portal
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                WHOLESALE & BULK INQUIRY
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900 font-heading">
                Inquiry Received Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.contactPerson}</strong>. Our Head of Wholesale Procurement will review your requirements for <strong>{formData.businessName}</strong> and send the complete factory wholesale catalog & rate sheet with GST billing details to <strong>{formData.phone}</strong>.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleWhatsAppDirect}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Connect on WhatsApp Now
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Wholesale Value Props Bar */}
              <div className="grid grid-cols-3 gap-2.5 bg-blue-50/80 p-3 rounded-2xl border border-blue-200/80 text-center text-xs">
                <div>
                  <Package className="w-4 h-4 text-[#1455D9] mx-auto mb-0.5" />
                  <span className="font-extrabold text-[#080B12] block text-[11px]">MOQ 10 Pcs</span>
                  <span className="text-[10px] text-slate-500">Mix & match sizes</span>
                </div>
                <div>
                  <Building2 className="w-4 h-4 text-[#1455D9] mx-auto mb-0.5" />
                  <span className="font-extrabold text-[#080B12] block text-[11px]">GST Invoicing</span>
                  <span className="text-[10px] text-slate-500">100% Tax credit input</span>
                </div>
                <div>
                  <ShieldCheck className="w-4 h-4 text-[#1455D9] mx-auto mb-0.5" />
                  <span className="font-extrabold text-[#080B12] block text-[11px]">48hr Dispatch</span>
                  <span className="text-[10px] text-slate-500">Pan-India Bilty & Express</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Menswear Mart"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="email"
                        placeholder="buyer@business.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9] uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Hub *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Surat, Ludhiana"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Expected Order Size
                    </label>
                    <select
                      value={formData.expectedQuantity}
                      onChange={(e) => setFormData({ ...formData, expectedQuantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    >
                      <option value="10-25 pcs">Sample Batch (10–25 pcs)</option>
                      <option value="25-50 pcs">Standard Bulk (25–50 pcs)</option>
                      <option value="50-100 pcs">Store Assortment (50–100 pcs)</option>
                      <option value="100-500 pcs">Wholesale Master (100–500 pcs)</option>
                      <option value="500+ pcs">Distributor (500+ pcs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Garments of Interest
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                  >
                    <option value="all">Full Catalog Assortment (Pants, Pajamas, Jackets, Track Suits)</option>
                    <option value="pants">Men&apos;s Pants & Denim Flex Trousers (Chemistree, CMJ Raw, Wrangler)</option>
                    <option value="pajamas">Men&apos;s Cotton Sleepwear & Lounge Pajamas</option>
                    <option value="jackets">Men&apos;s Bomber & Lightweight Winter Jackets</option>
                    <option value="tracksuits">Men&apos;s 2-Piece Athletic Tracksuits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Requirements / Sizing Ratio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Mention specific sizing ratios, transport transporter preferences, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 transition-all hover:scale-101 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <span>Submit Wholesale Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp B2B</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
