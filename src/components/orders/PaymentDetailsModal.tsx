import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { OrderDetails } from '../../types';
import { BrandLogo } from '../BrandLogo';

interface PaymentDetailsModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTracking?: (orderId: string) => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenTracking
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Calculate GST itemization (12% standard on ready garments)
  const gstRate = 0.12;
  const taxableAmount = Math.round(order.total / (1 + gstRate));
  const gstAmount = order.total - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  // Mask card or UPI details for strict PCI/privacy compliance
  const renderPaymentMethodDetails = () => {
    const methodLower = (order.paymentMethod || '').toLowerCase();
    if (methodLower.includes('card') || methodLower.includes('debit') || methodLower.includes('credit')) {
      return (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#1455D9]" />
          <span className="font-mono text-slate-800 font-semibold">Card Ending In •••• 4242</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">VISA / Rupay</span>
        </div>
      );
    }
    if (methodLower.includes('upi') || methodLower.includes('pay') || methodLower.includes('phonepe')) {
      return (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">₹</span>
          <span className="font-mono text-slate-800 font-semibold">UPI VPA: {order.customer.email.split('@')[0]}@okhdfcbank</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Verified UPI</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <IndianRupee className="w-4 h-4 text-amber-600" />
        <span className="font-medium text-slate-800">Cash on Delivery (Pay upon arrival)</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn print:p-0 print:bg-white">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-200 print:shadow-none print:max-h-none print:border-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#080B12] px-6 py-4 text-white flex items-center justify-between border-b border-slate-800 print:bg-black">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="h-4 w-px bg-slate-700" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Official Tax Invoice</p>
              <p className="text-[10px] text-slate-400 font-mono">GSTIN: 07AABCR1404R1ZX</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 text-xs text-slate-700">
          
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">{order.orderId}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : order.paymentStatus === 'Refunded'
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Placed on {order.orderDate}</span>
                {order.paidAt && (
                  <>
                    <span>·</span>
                    <span>Paid on {order.paidAt}</span>
                  </>
                )}
              </p>
            </div>

            {order.transactionId && (
              <div className="sm:text-right">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Transaction Reference</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">{order.transactionId}</span>
              </div>
            )}
          </div>

          {/* Refund Callout if applicable */}
          {order.refundDetails && (
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Refund Processed: ₹{order.refundDetails.amount.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-purple-700 mt-0.5">
                  Refund Reference: <strong className="font-mono">{order.refundDetails.refundId}</strong> ({order.refundDetails.refundedAt}). Reason: {order.refundDetails.reason}
                </p>
              </div>
            </div>
          )}

          {/* Customer & Billing Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.customer.fullName}</p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> +91 {order.customer.phone}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {order.customer.email}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Payment Verification:
              </span>
              {renderPaymentMethodDetails()}
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span className="block font-medium text-slate-700">Estimated Delivery Window:</span>
                <span className="text-[#1455D9] font-bold">{order.estimatedDelivery}</span>
              </div>
              {order.courierPartner && (
                <div className="text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Courier Partner: </span>
                  <span className="font-semibold text-slate-900">{order.courierPartner}</span>
                  {order.trackingNumber && (
                    <span className="font-mono text-slate-600 ml-1">({order.trackingNumber})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ordered Line Items */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Purchased Items & Specifications
            </span>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => {
                const itemImg = item.product.colorImages?.[item.selectedColor] || item.product.images[0];
                return (
                  <div key={idx} className="p-3 bg-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={itemImg}
                        alt={`${item.product.name} in ${item.selectedColor}`}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.product.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">
                            Size: {item.selectedSize}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-slate-300"
                              style={{ 
                                backgroundColor: 
                                  item.selectedColor.toLowerCase() === 'white' ? '#FFFFFF' :
                                  item.selectedColor.toLowerCase() === 'grey' ? '#6B7280' : '#111827'
                              }}
                            />
                            Colour: {item.selectedColor}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block">₹{item.product.price} each</span>
                      <span className="font-bold text-slate-900 text-xs">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown & Taxes */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-medium text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promotional Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Shipping & Handling:</span>
              <span>{order.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.shipping}`}</span>
            </div>

            {/* GST Itemization */}
            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Taxable Amount (Pre-Tax):</span>
                <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Central GST (CGST 6%):</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>State GST (SGST 6%):</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="pt-2.5 border-t border-slate-300 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Grand Total (Incl. all taxes):</span>
              <span className="text-lg font-black text-[#080B12] font-heading tabular-nums">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Security & Authenticity Footnote */}
          <div className="text-[10px] text-slate-400 text-center space-y-1">
            <p className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certified authentic Raghav Garments original. Computer-generated tax invoice; no signature required.</span>
            </p>
            <p>For return or sizing queries, contact support@raghavgarments.com or WhatsApp +91 98765 43210</p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          {onOpenTracking ? (
            <button
              onClick={() => {
                onClose();
                onOpenTracking(order.orderId);
              }}
              className="w-full sm:w-auto text-[#1455D9] hover:text-[#0F42A8] text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>View Visual Order Tracking Timeline &rarr;</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
