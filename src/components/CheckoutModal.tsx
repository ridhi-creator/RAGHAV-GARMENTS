import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Package,
  Calendar,
  Download
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { INDIAN_STATES } from '../data/products';
import { BrandLogo } from './BrandLogo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedPromo: string | null;
  onClearCart: () => void;
  onOrderPlaced: (order: OrderDetails) => void;
  onTrackOrder?: (orderId: string) => void;
  onViewReceipt?: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedPromo,
  onClearCart,
  onOrderPlaced,
  onTrackOrder,
  onViewReceipt
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    address: 'Flat 402, Royal Residency, Sector 45',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110001'
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShipping = subtotal >= 999;
  const shippingFee = freeShipping ? 0 : 99;
  const promoDiscount = (appliedPromo === 'RGARMENTS14' || appliedPromo === 'RAGHAV10') ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `RG-${Math.floor(10000 + Math.random() * 90000)}`;
      const today = new Date();
      const deliveryDate = new Date();
      deliveryDate.setDate(today.getDate() + 3);
      const isOnlinePaid = paymentMethod !== 'cod';

      const newOrder: OrderDetails = {
        orderId,
        customer: { ...formData },
        items: [...cart],
        subtotal,
        discount: promoDiscount,
        shipping: shippingFee,
        total,
        paymentMethod: paymentMethod === 'cod' 
          ? 'Cash on Delivery (COD)' 
          : paymentMethod === 'upi' 
          ? 'UPI (Google Pay / PhonePe)' 
          : 'Credit / Debit Card',
        paymentStatus: isOnlinePaid ? 'Paid' : 'Pending',
        transactionId: isOnlinePaid ? `RZP-${Date.now().toString().slice(-8)}` : undefined,
        paidAt: isOnlinePaid ? new Date().toISOString() : undefined,
        status: 'Order Placed',
        trackingNumber: `BD${Math.floor(10000000 + Math.random() * 90000000)}`,
        courierPartner: 'BlueDart Express',
        orderDate: today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        statusHistory: [
          {
            status: 'Order Placed',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            location: 'Raghav Garments Digital Gateway',
            note: isOnlinePaid 
              ? 'Payment verified via 256-bit gateway. Order authorized.' 
              : 'Order verified under Cash on Delivery. Dispatched for packing.'
          }
        ],
        notificationsSent: [
          {
            type: 'ORDER_CONFIRMATION',
            channel: 'sms',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            recipient: formData.phone,
            message: `Dear ${formData.fullName}, your order ${orderId} has been placed successfully at Raghav Garments!`
          }
        ]
      };

      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#080B12] text-white">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span className="h-4 w-px bg-slate-700 hidden sm:inline-block" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{confirmedOrder ? 'Official Order Receipt' : '256-Bit SSL Encrypted Checkout'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8">
          {confirmedOrder ? (
            /* --- ORDER SUCCESS SCREEN --- */
            <div className="max-w-2xl mx-auto text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1455D9] rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-200">
                <span>Verified Purchase</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Order ID: <strong className="text-slate-900 font-mono">{confirmedOrder.orderId}</strong>. We've sent an order confirmation SMS & email to <strong className="text-slate-800">{confirmedOrder.customer.email}</strong>.
              </p>

              {/* Order summary card */}
              <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-slate-200 gap-2">
                  <div>
                    <span className="text-slate-400">Delivery Address:</span>
                    <p className="font-semibold text-slate-900 text-sm mt-0.5">{confirmedOrder.customer.fullName}</p>
                    <p className="text-slate-600">
                      {confirmedOrder.customer.address}, {confirmedOrder.customer.city}, {confirmedOrder.customer.state} - {confirmedOrder.customer.pincode}
                    </p>
                    <p className="text-slate-600">Phone: +91 {confirmedOrder.customer.phone}</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400">Estimated Delivery:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5 flex items-center sm:justify-end gap-1 text-[#1455D9]">
                      <Calendar className="w-3.5 h-3.5" /> {confirmedOrder.estimatedDelivery}
                    </p>
                    <p className="text-slate-600 mt-1">Payment: {confirmedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <span className="text-slate-400 mb-2 block font-semibold">Ordered Items:</span>
                  <div className="space-y-2">
                    {confirmedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                            alt={`${item.product.name} in ${item.selectedColor}`}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{item.product.name}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <span>Size {item.selectedSize}</span>
                              <span>·</span>
                              <span className="font-semibold text-slate-800">Colour: {item.selectedColor}</span>
                              <span>·</span>
                              <span>Qty {item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price summary */}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Paid / Payable:</span>
                  <span className="text-lg font-black text-[#080B12] tabular-nums font-heading">
                    ₹{confirmedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                {onTrackOrder && (
                  <button
                    onClick={() => {
                      onClose();
                      onTrackOrder(confirmedOrder.orderId);
                    }}
                    className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track This Order Now</span>
                  </button>
                )}
                {onViewReceipt && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewReceipt(confirmedOrder);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-[#1455D9]" />
                    <span>View Tax Invoice</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* --- CHECKOUT FORM --- */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Delivery & Payment Details (lg: 7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#1455D9]" /> 1. Shipping Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="Recipient full name"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mobile Number (+91)</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="10-digit mobile number"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="Order updates email"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Complete Street Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                        placeholder="House / Flat No., Colony, Street"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">PIN Code</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#1455D9]" /> 2. Payment Option
                  </h3>

                  <div className="space-y-2">
                    {/* Cash on Delivery */}
                    <label 
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'cod' ? 'border-[#1455D9] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                          <p className="text-[11px] text-slate-500">Pay cash or scan QR when your parcel arrives</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#1455D9]"
                      />
                    </label>

                    {/* Instant UPI */}
                    <label 
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'upi' ? 'border-[#1455D9] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-[#1455D9]" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">UPI / QR (Instant Simulation)</p>
                          <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 text-[#1455D9]"
                      />
                    </label>

                    {/* Credit / Debit Card */}
                    <label 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'card' ? 'border-[#1455D9] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Debit / Credit Card (Demo)</p>
                          <p className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-[#1455D9]"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary (lg: 5 cols) */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-[#1455D9] font-semibold">{cart.length} item(s)</span>
                  </h4>

                  {/* Items mini list */}
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-2">
                        <p className="font-semibold text-slate-700">Your shopping bag is currently empty.</p>
                        <button
                          type="button"
                          onClick={onClose}
                          className="inline-flex items-center gap-1.5 text-[#1455D9] hover:underline font-bold"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Browse Products to Add Items
                        </button>
                      </div>
                    ) : (
                      cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                            alt={`${item.product.name} in ${item.selectedColor}`}
                            className="w-12 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-[11px] text-slate-500">
                              Size: {item.selectedSize} · <strong className="text-slate-700">Colour: {item.selectedColor}</strong> · Qty: {item.quantity}
                            </p>
                            <p className="font-extrabold text-[#080B12] tabular-nums mt-0.5">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculations */}
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Discount ({appliedPromo})</span>
                        <span className="tabular-nums">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="tabular-nums">
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-700">FREE</strong>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                      <span className="font-extrabold text-slate-900">Total Payable</span>
                      <span className="text-xl font-black text-[#080B12] tabular-nums font-heading">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-4 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-800/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Processing Order...</span>
                    ) : (
                      <>
                        <span>Place Order · ₹{total.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    By placing this order, you agree to our 7-day hassle-free return policy.
                  </p>
                </div>

              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
