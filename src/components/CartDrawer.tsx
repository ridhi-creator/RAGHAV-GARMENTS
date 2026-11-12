import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Check 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const promoDiscount = (appliedPromo === 'RGARMENTS14' || appliedPromo === 'RAGHAV10') ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - promoDiscount + shippingFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoError(null);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try RGARMENTS14');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1455D9]" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Your Shopping Bag ({cart.reduce((c, i) => c + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-blue-50/70 p-3.5 border-b border-blue-100 text-xs">
            <div className="flex items-center justify-between font-semibold mb-1 text-slate-800">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1455D9]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-bold">You qualify for FREE Standard Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#1455D9]">₹{remainingForFreeShipping}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-500">{shippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#1455D9] h-full transition-all duration-300 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-14 h-14 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">Your Bag is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Looks like you haven't added anything yet. Explore our fresh collection and find your style.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                  className="flex gap-3 pb-4 border-b border-slate-100 last:border-0"
                >
                  {/* Thumbnail matching selected color */}
                  <img
                    src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                    alt={`${item.product.name} in ${item.selectedColor}`}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 font-heading">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="font-bold text-slate-800">Size: {item.selectedSize}</span>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ 
                              backgroundColor: item.selectedColor.toLowerCase() === 'white' ? '#FFFFFF' : item.selectedColor.toLowerCase() === 'black' ? '#111827' : item.selectedColor.toLowerCase() === 'grey' ? '#6B7280' : '#1455D9'
                            }} 
                          />
                          Colour: <span className="text-[#1455D9]">{item.selectedColor}</span>
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-bold text-[#080B12] tabular-nums">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-slate-400 line-through tabular-nums">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromoCode} className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5" /> Coupon <span className="underline">{appliedPromo}</span> Applied!
                    </span>
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="text-rose-600 hover:underline font-semibold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. RGARMENTS14)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-8 pr-3 py-2 rounded-xl text-xs text-slate-800 uppercase focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 font-medium pl-1">{promoError}</p>
                )}
              </form>

              {/* Price Calculation Rows */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount (10% {appliedPromo || 'RGARMENTS14'})</span>
                    <span className="tabular-nums">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-extrabold text-slate-900">Total Amount</span>
                  <span className="text-lg font-black text-[#080B12] tabular-nums font-heading">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 transition-all transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1455D9]" /> 100% Secure Checkout
                </span>
                <span>·</span>
                <span>Cash on Delivery Available</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
