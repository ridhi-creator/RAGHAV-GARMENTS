import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Calendar, 
  Truck, 
  CreditCard, 
  Receipt, 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { OrderDetails, OrderStatus } from '../../types';
import { BrandLogo } from '../BrandLogo';

interface CustomerOrdersProps {
  currentUser: { name: string; email: string } | null;
  onBackToShop: () => void;
  onTrackOrder: (orderId: string) => void;
  onOpenReceipt: (order: OrderDetails) => void;
  onOpenAuth: () => void;
}

export const CustomerOrders: React.FC<CustomerOrdersProps> = ({
  currentUser,
  onBackToShop,
  onTrackOrder,
  onOpenReceipt,
  onOpenAuth
}) => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom email/phone lookup input if user wants to check with specific credentials
  const [lookupEmail, setLookupEmail] = useState(currentUser?.email || 'rahul.sharma@example.com');
  const [lookupPhone, setLookupPhone] = useState('9876543210');

  const fetchCustomerOrders = async (emailParam?: string, phoneParam?: string) => {
    setIsLoading(true);
    const emailToUse = (emailParam || currentUser?.email || lookupEmail).trim();
    const phoneToUse = (phoneParam || lookupPhone).trim();

    try {
      const url = new URL('/api/customer/orders', window.location.origin);
      if (emailToUse) url.searchParams.set('email', emailToUse);
      if (phoneToUse) url.searchParams.set('phone', phoneToUse);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Network error fetching customer orders:', e);
    }

    // Fallback: check localStorage for orders placed during this session
    try {
      const saved = localStorage.getItem('raghav_garments_orders');
      if (saved) {
        const localList: OrderDetails[] = JSON.parse(saved);
        if (localList.length > 0) {
          setOrders(localList);
          setIsLoading(false);
          return;
        }
      }
    } catch {}

    // Default seed fallback order
    setOrders([
      {
        orderId: 'RG-1042',
        customer: {
          fullName: 'Rahul Sharma',
          phone: '9876543210',
          email: 'rahul.sharma@example.com',
          address: 'Flat 402, Royal Residency, Sector 45',
          city: 'New Delhi',
          state: 'Delhi NCR',
          pincode: '110001'
        },
        items: [
          {
            product: {
              id: 'pt-01',
              name: 'Chemistree Comfort Fit Stretch Denim Pants',
              category: 'pants',
              originalPrice: 2499,
              price: 1499,
              discount: 40,
              rating: 4.9,
              reviewsCount: 310,
              sizes: ['30', '32', '34', '36', '38'],
              colors: [
                { name: 'Black', hex: '#111827' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Grey', hex: '#6B7280' }
              ],
              colorImages: {
                'Black': '/images/pants/pants_black_chemistree.jpg',
                'White': '/images/pants/pants_white_light_icewash.jpg',
                'Grey': '/images/pants/pants_grey_washed.jpg'
              },
              images: ['/images/pants/pants_black_chemistree.jpg'],
              badge: 'Best Seller',
              description: 'Authentic Chemistree comfort-fit stretch denim with reinforced bar-tacks and branded rivet details.',
              features: ['Authentic Chemistree comfort fit', 'Flexible stretch waistband'],
              fabric: '98% Cotton Denim, 2% Elastane Flex',
              fit: 'Comfort Fit Straight Leg',
              care: 'Machine wash cold inside-out',
              inStock: true
            },
            selectedSize: '34',
            selectedColor: 'Black',
            quantity: 1
          }
        ],
        subtotal: 1499,
        discount: 0,
        shipping: 0,
        total: 1499,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'Pending',
        status: 'Out for Delivery',
        trackingNumber: 'BD88291042',
        courierPartner: 'BlueDart Express',
        orderDate: '28 Oct 2026',
        estimatedDelivery: '31 Oct 2026',
        statusHistory: [
          {
            status: 'Order Placed',
            timestamp: '28 Oct 2026, 11:30 AM',
            location: 'Raghav Garments Digital Gateway',
            note: 'Order confirmed and verified.'
          },
          {
            status: 'Processing',
            timestamp: '28 Oct 2026, 03:15 PM',
            location: 'Quality Inspection Unit',
            note: 'Garment stitch & fabric certified.'
          },
          {
            status: 'Shipped',
            timestamp: '29 Oct 2026, 09:00 AM',
            location: 'Delhi Central Air Hub',
            note: 'Dispatched via BlueDart Express (AWB: BD88291042).'
          },
          {
            status: 'Out for Delivery',
            timestamp: '31 Oct 2026, 08:30 AM',
            location: 'New Delhi South Delivery Center',
            note: 'Out for delivery today with executive.'
          }
        ]
      }
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [currentUser]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomerOrders(lookupEmail, lookupPhone);
  };

  // Filter & search orders
  const filteredOrders = orders.filter((ord) => {
    const matchesFilter = filterStatus === 'all' 
      ? true 
      : filterStatus === 'pending'
      ? ['Pending', 'Order Placed', 'Order Confirmed', 'Processing'].includes(ord.status)
      : filterStatus === 'shipped'
      ? ['Shipped', 'Packed', 'Out for Delivery'].includes(ord.status)
      : filterStatus === 'delivered'
      ? ord.status === 'Delivered'
      : true;

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      ord.orderId.toLowerCase().includes(q) ||
      ord.items.some((it) => it.product.name.toLowerCase().includes(q)) ||
      ord.customer.fullName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 border border-slate-700/80 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <BrandLogo size="sm" />
          </div>

          <div className="flex items-center gap-3 text-xs">
            {currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-semibold">{currentUser.name}</span>
                <span className="text-[10px] text-slate-400">({currentUser.email})</span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl bg-[#1455D9] hover:bg-[#0F42A8] text-white font-bold transition-colors shadow-md"
              >
                Sign In to Raghav Garments
              </button>
            )}

            <button
              onClick={() => fetchCustomerOrders()}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 transition-colors"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1455D9]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1455D9]/10 text-[#1455D9] border border-[#1455D9]/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Customer Order History</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track status, review garments, inspect payment verification, and download tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Orders:</span>
            <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Customer Lookup Form */}
        <div className="bg-[#0D111D] border border-slate-800 rounded-2xl p-4 sm:p-5">
          <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <span className="text-slate-300 font-bold shrink-0">Account Lookup:</span>
            <input
              type="email"
              placeholder="Your email (e.g., rahul.sharma@example.com)"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
            />
            <input
              type="text"
              placeholder="10-digit mobile number"
              value={lookupPhone}
              onChange={(e) => setLookupPhone(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9] w-full sm:w-48"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#1455D9] hover:bg-[#0F42A8] text-white px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              Fetch My Orders
            </button>
          </form>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D111D] border border-slate-800 p-3 rounded-2xl">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID or garment name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {[
              { label: 'All Orders', value: 'all' },
              { label: 'Pending / Processing', value: 'pending' },
              { label: 'Shipped / Out for Delivery', value: 'shipped' },
              { label: 'Delivered', value: 'delivered' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  filterStatus === f.value
                    ? 'bg-[#1455D9] text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Cards List */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#1455D9] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading your orders from Raghav Garments servers...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Orders Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any orders matching your criteria. Place your first order today or check with another email.
            </p>
            <button
              onClick={onBackToShop}
              className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => (
              <div 
                key={ord.orderId}
                className="bg-[#0D111D] border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-7 space-y-6 transition-all shadow-xl"
              >
                {/* Order Card Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xl font-bold text-white">
                        {ord.orderId}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : ord.status === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-[#1455D9]/20 text-blue-400 border border-[#1455D9]/40'
                      }`}>
                        {ord.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'Paid'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}>
                        Payment: {ord.paymentStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> Placed: {ord.orderDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#1455D9] font-semibold">
                        <Clock className="w-3.5 h-3.5" /> Estimated Delivery: {ord.estimatedDelivery}
                      </span>
                      {ord.courierPartner && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Truck className="w-3.5 h-3.5 text-slate-400" /> {ord.courierPartner}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Actions for this order */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onTrackOrder(ord.orderId)}
                      className="px-4 py-2.5 bg-[#1455D9] hover:bg-[#0F42A8] text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>
                    <button
                      onClick={() => onOpenReceipt(ord)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-slate-700"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#1455D9]" />
                      <span>View Order Details</span>
                    </button>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="divide-y divide-slate-800/60">
                  {ord.items.map((item, idx) => {
                    const itemImg = item.product.colorImages?.[item.selectedColor] || item.product.images[0];
                    return (
                      <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={itemImg}
                            alt={`${item.product.name} in ${item.selectedColor}`}
                            className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{item.product.name}</p>
                            
                            {/* Color, Size & Qty display */}
                            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-1">
                              <span className="bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-200">
                                Size: {item.selectedSize}
                              </span>
                              
                              <span className="flex items-center gap-1.5 font-semibold text-white">
                                <span 
                                  className="w-3 h-3 rounded-full border border-white/20 inline-block"
                                  style={{
                                    backgroundColor: 
                                      item.selectedColor.toLowerCase() === 'white' ? '#FFFFFF' :
                                      item.selectedColor.toLowerCase() === 'grey' ? '#6B7280' : '#111827'
                                  }}
                                />
                                Colour: <strong className="text-white uppercase">{item.selectedColor}</strong>
                              </span>

                              <span>Qty: {item.quantity}</span>
                              <span className="text-slate-500">|</span>
                              <span className="text-slate-300">₹{item.product.price.toLocaleString('en-IN')} each</span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <span className="text-sm font-bold text-white tabular-nums">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer: Address + Total */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="text-slate-400">
                    <span>Delivering to: </span>
                    <strong className="text-white">{ord.customer.fullName}</strong>
                    <span> · {ord.customer.city}, {ord.customer.state} ({ord.customer.pincode})</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      Payment Method: <span className="text-slate-300 font-medium">{ord.paymentMethod}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 text-xs">Total Order Amount:</span>
                    <span className="text-lg font-black text-white font-mono">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
