import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Truck,
  Tag,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Banknote,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Calendar,
  Download,
  User,
  Mail,
  Lock,
  Phone,
  LogOut,
  Package,
  Building2,
  MapPin,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderDetails, Product, PageView, ActiveTab } from '../types';
import { INDIAN_STATES } from '../data/products';
import { BrandLogo } from './BrandLogo';

/* ============================================================================
   1. DEDICATED SHOPPING CART PAGE (/cart)
   ============================================================================ */
interface CartPageProps {
  cart: CartItem[];
  appliedPromo: string | null;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onProceedToCheckout: () => void;
  onBrowseCategory: (tab: ActiveTab) => void;
  onOpenProduct: (product: Product) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  appliedPromo,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  onRemovePromo,
  onProceedToCheckout,
  onBrowseCategory,
  onOpenProduct
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const promoDiscount =
    appliedPromo === 'RGARMENTS14' || appliedPromo === 'RAGHAV10' ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - promoDiscount + shippingFee);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (onApplyPromo(promoInput.trim().toUpperCase())) {
      setPromoError(null);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Use RGARMENTS14 for 10% OFF.');
    }
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
              <button onClick={() => onBrowseCategory('all')} className="hover:text-[#1455D9] font-medium cursor-pointer">
                Home
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-800">Shopping Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-[#1455D9]" />
              YOUR SHOPPING BAG ({cart.reduce((c, i) => c + i.quantity, 0)})
            </h1>
          </div>
          <button
            onClick={() => onBrowseCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1455D9] hover:text-[#0F42A8] bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center space-y-4 shadow-xs">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-black text-slate-900 font-heading">Your Shopping Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Add men&apos;s pants, cotton pajamas, bomber jackets, or athletic track suits to your bag to unlock complimentary shipping above ₹999.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2.5">
              {[
                { tab: 'pants' as ActiveTab, label: "Men's Pants" },
                { tab: 'pajamas' as ActiveTab, label: "Men's Pajamas" },
                { tab: 'tracksuits' as ActiveTab, label: "Men's Track Suits" },
                { tab: 'jackets' as ActiveTab, label: "Men's Jackets" }
              ].map((cat) => (
                <button
                  key={cat.tab}
                  onClick={() => onBrowseCategory(cat.tab)}
                  className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Shop {cat.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-xs">
                <div className="flex items-center justify-between font-semibold mb-1.5 text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#1455D9]" />
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold">You qualify for FREE All-India Delivery!</span>
                    ) : (
                      <span>
                        Add <strong className="text-[#1455D9]">₹{remainingForFreeShipping}</strong> more for FREE Delivery!
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-500">{shippingProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1455D9] h-full rounded-full transition-all" style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-5 first:pt-1 last:pb-1 flex gap-4 sm:gap-5">
                    <img
                      src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                      alt={`${item.product.name} in ${item.selectedColor}`}
                      onClick={() => onOpenProduct(item.product)}
                      className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-2xl bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            onClick={() => onOpenProduct(item.product)}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#1455D9] font-heading cursor-pointer"
                          >
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => onRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-slate-800">Size: {item.selectedSize}</span>
                          <span>·</span>
                          <span>
                            Colour: <strong className="text-[#1455D9]">{item.selectedColor}</strong>
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-black text-[#080B12] tabular-nums">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            ₹{item.product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3.5 py-1.5 text-xs font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-black text-slate-900 font-heading uppercase tracking-wider">
                Order Summary
              </h2>

              <form onSubmit={handlePromoSubmit} className="space-y-1.5">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2.5 rounded-xl text-xs">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5" /> {appliedPromo} Applied!
                    </span>
                    <button type="button" onClick={onRemovePromo} className="text-rose-600 font-semibold hover:underline cursor-pointer">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Promo code (RGARMENTS14)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-2.5 rounded-xl text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                    <button type="submit" className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>}
              </form>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedPromo})</span>
                    <span className="tabular-nums">-₹{promoDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-extrabold text-slate-900">Total Amount</span>
                  <span className="text-xl font-black text-[#080B12] tabular-nums font-heading">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1455D9]" />
                <span>256-Bit SSL Checkout · COD Available</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   2. DEDICATED WISHLIST PAGE (/wishlist)
   ============================================================================ */
interface WishlistPageProps {
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product, size: string, color: string) => void;
  onOpenProduct: (product: Product) => void;
  onBrowseCategory: (tab: ActiveTab) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onOpenProduct,
  onBrowseCategory
}) => {
  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
              <button onClick={() => onBrowseCategory('all')} className="hover:text-[#1455D9] font-medium cursor-pointer">
                Home
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-800">Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2.5">
              <Heart className="w-7 h-7 text-rose-600 fill-current" />
              SAVED WISHLIST ({wishlistProducts.length})
            </h1>
          </div>
          <button
            onClick={() => onBrowseCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1455D9] bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Catalog
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-16 text-center space-y-4 shadow-xs">
            <Heart className="w-16 h-16 text-slate-300 mx-auto" />
            <h2 className="text-xl font-black text-slate-900 font-heading">No Saved Items Yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tap the heart icon on any pant, pajama, jacket, or tracksuit card to shortlist your favorite styles for fast ordering.
            </p>
            <button
              onClick={() => onBrowseCategory('all')}
              className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
              >
                <div
                  onClick={() => onOpenProduct(product)}
                  className="relative aspect-[3/4] bg-[#F8F9FA] cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/95 text-slate-500 hover:text-rose-600 shadow-xs cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => onOpenProduct(product)}
                      className="text-sm font-bold text-slate-900 hover:text-[#1455D9] line-clamp-1 font-heading cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-base font-black text-[#080B12] tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onMoveToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Black');
                      onRemoveFromWishlist(product.id);
                    }}
                    className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   3. DEDICATED CHECKOUT PAGE (/checkout)
   ============================================================================ */
interface CheckoutPageProps {
  cart: CartItem[];
  appliedPromo: string | null;
  onClearCart: () => void;
  onOrderPlaced: (order: OrderDetails) => void;
  onTrackOrder: (orderId: string) => void;
  onViewReceipt: (order: OrderDetails) => void;
  onBackToCart: () => void;
  onBackToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  appliedPromo,
  onClearCart,
  onOrderPlaced,
  onTrackOrder,
  onViewReceipt,
  onBackToCart,
  onBackToShop
}) => {
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
  const promoDiscount =
    appliedPromo === 'RGARMENTS14' || appliedPromo === 'RAGHAV10' ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
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
        paymentMethod:
          paymentMethod === 'cod'
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
        estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }),
        statusHistory: [
          {
            status: 'Order Placed',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            location: 'Raghav Garments Digital Gateway',
            note: isOnlinePaid
              ? 'Payment verified via 256-bit gateway. Order authorized.'
              : 'Order verified under Cash on Delivery. Dispatched for packing.'
          }
        ]
      };

      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="py-10 sm:py-14 bg-slate-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 flex items-center gap-2 mb-1">
              <button onClick={onBackToShop} className="hover:text-[#1455D9] font-medium cursor-pointer">
                Home
              </button>
              <span>/</span>
              <button onClick={onBackToCart} className="hover:text-[#1455D9] font-medium cursor-pointer">
                Cart
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-800">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#1455D9]" />
              {confirmedOrder ? 'ORDER CONFIRMED' : 'SECURE CHECKOUT'}
            </h1>
          </div>
          {!confirmedOrder && (
            <button
              onClick={onBackToCart}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1455D9] bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {confirmedOrder ? (
            <div className="max-w-2xl mx-auto text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Order Placed Successfully!
              </h2>
              <p className="text-sm text-slate-500">
                Order ID: <strong className="text-slate-900 font-mono">{confirmedOrder.orderId}</strong> · Confirmation sent to{' '}
                <strong className="text-slate-800">{confirmedOrder.customer.email}</strong>.
              </p>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between pb-3 border-b border-slate-200 gap-2">
                  <div>
                    <span className="text-slate-400">Delivery Address:</span>
                    <p className="font-semibold text-slate-900 text-sm mt-0.5">{confirmedOrder.customer.fullName}</p>
                    <p className="text-slate-600">
                      {confirmedOrder.customer.address}, {confirmedOrder.customer.city}, {confirmedOrder.customer.state} -{' '}
                      {confirmedOrder.customer.pincode}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-slate-400">Estimated Delivery:</span>
                    <p className="font-bold text-sm mt-0.5 flex items-center sm:justify-end gap-1 text-[#1455D9]">
                      <Calendar className="w-3.5 h-3.5" /> {confirmedOrder.estimatedDelivery}
                    </p>
                    <p className="text-slate-600 mt-1">{confirmedOrder.paymentMethod}</p>
                  </div>
                </div>
                <div className="flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Amount:</span>
                  <span className="text-lg font-black text-[#080B12] tabular-nums font-heading">
                    ₹{confirmedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => onTrackOrder(confirmedOrder.orderId)}
                  className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" /> Track This Order Now
                </button>
                <button
                  onClick={() => onViewReceipt(confirmedOrder)}
                  className="bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#1455D9]" /> View Tax Invoice
                </button>
                <button
                  onClick={onBackToShop}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto" />
              <h2 className="text-xl font-black text-slate-900 font-heading">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Add at least one product to your shopping bag before completing checkout.
              </p>
              <button
                onClick={onBackToShop}
                className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#1455D9]" /> 1. Shipping Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#1455D9]" /> 2. Payment Method
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'cod' as const,
                        icon: <Banknote className="w-5 h-5 text-emerald-600" />,
                        title: 'Cash on Delivery (COD)',
                        desc: 'Pay cash or scan QR when your parcel arrives'
                      },
                      {
                        id: 'upi' as const,
                        icon: <Smartphone className="w-5 h-5 text-[#1455D9]" />,
                        title: 'UPI / QR Instant Pay',
                        desc: 'Google Pay, PhonePe, Paytm, BHIM'
                      },
                      {
                        id: 'card' as const,
                        icon: <CreditCard className="w-5 h-5 text-slate-700" />,
                        title: 'Debit / Credit Card',
                        desc: 'Visa, Mastercard, RuPay'
                      }
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === opt.id ? 'border-[#1455D9] bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {opt.icon}
                          <div>
                            <p className="text-xs font-bold text-slate-900">{opt.title}</p>
                            <p className="text-[11px] text-slate-500">{opt.desc}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="w-4 h-4 text-[#1455D9]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
                    <span>Order Summary</span>
                    <span className="text-[#1455D9] font-semibold">{cart.length} item(s)</span>
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Size: {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                          </p>
                          <p className="font-extrabold text-[#080B12] tabular-nums">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
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
                        {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
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
                    disabled={isSubmitting}
                    className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-4 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-800/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing Order...' : `Place Order · ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. DEDICATED LOGIN & SIGNUP PAGE (/login, /signup)
   ============================================================================ */
interface AuthPageProps {
  initialMode: 'login' | 'signup';
  currentUser: { name: string; email: string } | null;
  onLogin: (user: { name: string; email: string }) => void;
  onLogout: () => void;
  onNavigatePage: (page: PageView) => void;
  onBackToShop: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode,
  currentUser,
  onLogin,
  onLogout,
  onNavigatePage,
  onBackToShop
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    phone: '9876543210'
  });

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Valued Member',
      email: formData.email || 'customer@raghavgarments.com'
    });
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#080B12] px-6 py-7 text-center border-b border-slate-800">
          <div className="flex justify-center">
            <BrandLogo size="md" className="justify-center" />
          </div>
          <h1 className="text-xl font-black text-white font-heading mt-3">
            {currentUser
              ? `Welcome, ${currentUser.name}`
              : mode === 'login'
              ? 'Customer & Buyer Sign In'
              : 'Create Your Raghav Garments Account'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser
              ? 'Manage your orders, wishlist shortlists, and live parcel tracking'
              : 'Access your orders, saved wishlist, and instant checkout'}
          </p>
        </div>

        {currentUser ? (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#1455D9] rounded-full flex items-center justify-center mx-auto font-black text-2xl border-2 border-blue-200">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => onNavigatePage('orders')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#1455D9]" /> My Orders
              </button>
              <button
                onClick={() => onNavigatePage('order-tracking')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-emerald-600" /> Track Parcel
              </button>
              <button
                onClick={() => onNavigatePage('wishlist')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-500" /> Saved Wishlist
              </button>
              <button
                onClick={() => onNavigatePage('cart')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-900 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#1455D9]" /> Shopping Cart
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onBackToShop}
                className="flex-1 bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3 rounded-xl text-xs font-bold cursor-pointer"
              >
                Continue Shopping
              </button>
              <button
                onClick={onLogout}
                className="px-5 py-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  onNavigatePage('login');
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  onNavigatePage('signup');
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === 'signup' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number (+91)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-sm cursor-pointer"
              >
                {mode === 'login' ? 'Sign In to Account' : 'Create Member Account'}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onBackToShop}
                  className="text-slate-500 hover:text-[#1455D9] font-medium cursor-pointer"
                >
                  &larr; Return to Storefront
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   5. DEDICATED WHOLESALE & B2B SUPPLY PAGE (/wholesale)
   ============================================================================ */
interface WholesalePageProps {
  onBackToShop: () => void;
  onBrowseCategory: (tab: ActiveTab) => void;
  showToast: (msg: string) => void;
}

export const WholesalePage: React.FC<WholesalePageProps> = ({
  onBackToShop,
  onBrowseCategory,
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
    showToast('Wholesale inquiry submitted! Our B2B team will contact you shortly.');
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Raghav Garments Wholesale Team, I would like to inquire about bulk ordering for ${
        formData.businessName || 'my retail store'
      } (${formData.expectedQuantity}). Please share your factory price sheet.`
    );
    window.open(`https://wa.me/919871234567?text=${text}`, '_blank');
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={onBackToShop} className="hover:text-[#1455D9] font-medium cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-900">B2B Wholesale & Bulk Supply</span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#080B12] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Direct Manufacturer · Factory Gate Pricing
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
              WHOLESALE &amp; RETAIL PARTNER PORTAL
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Source directly from RAGHAV GARMENTS&apos; manufacturing floor. Enjoy MOQ starting at just 10 pieces per design with mix-and-match size ratios, full 100% GST tax invoices, and insured pan-India bilty freight delivery.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleWhatsAppDirect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Wholesale Desk
              </button>
              <button
                onClick={() => onBrowseCategory('all')}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Inspect All 55+ Styles
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Package className="w-5 h-5 text-[#1455D9] mb-2" />
              <p className="font-bold text-white">MOQ 10 Pieces</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Flexible assorted sizes (S–XXL / 28–38)</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Building2 className="w-5 h-5 text-[#1455D9] mb-2" />
              <p className="font-bold text-white">100% GST Billing</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Verified input tax credit invoices</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Truck className="w-5 h-5 text-[#1455D9] mb-2" />
              <p className="font-bold text-white">48h Dispatch</p>
              <p className="text-[11px] text-slate-400 mt-0.5">VRL, TCI, BlueDart &amp; Bilty freight</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Sparkles className="w-5 h-5 text-[#1455D9] mb-2" />
              <p className="font-bold text-white">Up to 25% Margin</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Extra volume slab discounts (50+ pcs)</p>
            </div>
          </div>
        </div>

        {/* Rate Tiers + Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900 font-heading uppercase">
                Category Wholesale Rate Guide
              </h2>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { cat: 'pants' as ActiveTab, name: "Men's Pants & Denim Chinos", moq: '10 Pcs', discount: '15%–22% Off Retail' },
                  { cat: 'pajamas' as ActiveTab, name: "Men's Cotton & Lounge Pajamas", moq: '10 Pcs', discount: '15%–25% Off Retail' },
                  { cat: 'tracksuits' as ActiveTab, name: "Men's 2-Piece Track Suits", moq: '10 Sets', discount: '15%–20% Off Retail' },
                  { cat: 'jackets' as ActiveTab, name: "Men's Bomber & Winter Jackets", moq: '10 Pcs', discount: '15%–20% Off Retail' }
                ].map((row) => (
                  <div key={row.cat} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">{row.name}</p>
                      <p className="text-[11px] text-slate-500">MOQ: {row.moq} · {row.discount}</p>
                    </div>
                    <button
                      onClick={() => onBrowseCategory(row.cat)}
                      className="text-[#1455D9] font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      View &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 font-heading mb-4">
              Request Official Wholesale Rate Sheet &amp; Catalog
            </h2>
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 font-heading">Wholesale Inquiry Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.contactPerson}</strong>. Our B2B procurement desk will send the rate sheet and sample catalog to <strong>{formData.phone}</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#1455D9] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Business / Store Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Menswear Mart"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="buyer@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="07AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 uppercase focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City *</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Delhi, Surat, Ludhiana"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Order Volume</label>
                    <select
                      value={formData.expectedQuantity}
                      onChange={(e) => setFormData({ ...formData, expectedQuantity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
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
                  <label className="block font-bold text-slate-700 mb-1">Requirements / Size Ratio</label>
                  <textarea
                    rows={3}
                    placeholder="Mention preferred categories, size assortment, or transporter..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Wholesale Inquiry'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
