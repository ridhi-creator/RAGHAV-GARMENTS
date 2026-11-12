import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Search, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CreditCard,
  Receipt,
  RotateCcw,
  RefreshCw,
  Bell
} from 'lucide-react';
import { OrderDetails, OrderStatus, StatusHistoryEntry } from '../../types';
import { BrandLogo } from '../BrandLogo';

interface OrderTrackingPageProps {
  initialOrderId?: string;
  onBackToShop: () => void;
  onNavigateToMyOrders?: () => void;
  onOpenReceipt?: (order: OrderDetails) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId = 'RG-1042',
  onBackToShop,
  onNavigateToMyOrders,
  onOpenReceipt
}) => {
  const [searchOrderId, setSearchOrderId] = useState(initialOrderId);
  const [searchContact, setSearchContact] = useState('');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Fetch tracking details for an Order ID
  const fetchOrderTracking = async (id: string, contactVal?: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId: id.trim().toUpperCase(),
          contact: contactVal ? contactVal.trim() : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Could not locate order details.');
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch (err: any) {
      // Fallback to local storage if network or offline
      try {
        const localSaved = localStorage.getItem('raghav_garments_orders');
        if (localSaved) {
          const list: OrderDetails[] = JSON.parse(localSaved);
          const found = list.find((o) => o.orderId.toUpperCase() === id.trim().toUpperCase());
          if (found) {
            setOrder(found);
            setIsLoading(false);
            return;
          }
        }
      } catch {}
      setErrorMessage('Network error while fetching tracking. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchOrderId(initialOrderId);
      fetchOrderTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderTracking(searchOrderId, searchContact);
  };

  const handleCopyAWB = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  // 7 Core Sequential Stages
  const TIMELINE_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
    { 
      status: 'Order Placed', 
      label: 'Order Placed', 
      desc: 'Order verified & payment acknowledged' 
    },
    { 
      status: 'Order Confirmed', 
      label: 'Order Confirmed', 
      desc: 'Stock allocated & billing receipt issued' 
    },
    { 
      status: 'Processing', 
      label: 'Processing', 
      desc: 'Tailoring check & hand-packaging' 
    },
    { 
      status: 'Packed', 
      label: 'Packed', 
      desc: 'Enclosed with tamper-evident seal' 
    },
    { 
      status: 'Shipped', 
      label: 'Shipped', 
      desc: 'Dispatched with express courier air hub' 
    },
    { 
      status: 'Out for Delivery', 
      label: 'Out for Delivery', 
      desc: 'Courier rider assigned for doorstep drop' 
    },
    { 
      status: 'Delivered', 
      label: 'Delivered', 
      desc: 'Successfully handed over to recipient' 
    }
  ];

  // Helper to calculate progress index
  const getStageIndex = (currentStatus?: string): number => {
    if (!currentStatus) return 0;
    const norm = currentStatus.trim().toLowerCase();

    if (norm === 'pending' || norm === 'order placed') return 0;
    if (norm === 'confirmed' || norm === 'order confirmed') return 1;
    if (norm === 'processing') return 2;
    if (norm === 'packed') return 3;
    if (norm === 'shipped') return 4;
    if (norm === 'out for delivery') return 5;
    if (norm === 'delivered') return 6;
    return 1;
  };

  const currentStageIndex = getStageIndex(order?.status);
  const isCancelled = order?.status === 'Cancelled';
  const isReturned = ['Return Requested', 'Returned', 'Refunded'].includes(order?.status || '');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <BrandLogo size="sm" />
          </div>

          <div className="flex items-center gap-3 text-xs">
            {onNavigateToMyOrders && (
              <button
                onClick={onNavigateToMyOrders}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold transition-colors"
              >
                My Orders History
              </button>
            )}
            <button
              onClick={() => order && fetchOrderTracking(order.orderId)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition-colors"
              title="Refresh tracking status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1455D9]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Page Title & Search Bar */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1455D9]/10 text-[#1455D9] border border-[#1455D9]/30 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Parcel Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight">
            Track Your Raghav Garments Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time fulfillment tracking across Delhivery, BlueDart & DTDC air hubs.
          </p>

          {/* Search Lookup Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="pt-3 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Order ID (e.g., RG-1042)"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3 py-3 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
              />
            </div>
            <input
              type="text"
              placeholder="Registered Phone or Email (Optional)"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9] sm:w-56"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0 shadow-lg shadow-[#1455D9]/30"
            >
              {isLoading ? 'Tracking...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Error message callout */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto bg-rose-950/40 border border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-start gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
              <p className="text-[11px] text-rose-400 mt-1">
                Tip: Try tracking with sample order <strong className="font-mono text-white">RG-1042</strong>, <strong className="font-mono text-white">RG-1043</strong>, or your newly placed order ID.
              </p>
            </div>
          </div>
        )}

        {/* Live Order Tracking Card */}
        {order && (
          <div className="space-y-6">

            {/* Quick Summary Top Header */}
            <div className="bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#1455D9]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                      {order.orderId}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : order.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#1455D9]/20 text-blue-400 border border-[#1455D9]/40'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      order.paymentStatus === 'Paid'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                    }`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Placed on {order.orderDate}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#1455D9]" /> Est. Delivery: {order.estimatedDelivery}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {onOpenReceipt && (
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 border border-slate-700"
                    >
                      <Receipt className="w-4 h-4 text-[#1455D9]" />
                      <span>Itemized Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Courier Partner & AWB Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Courier Partner
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 font-bold text-sm text-white">
                    <Truck className="w-4 h-4 text-[#1455D9]" />
                    <span>{order.courierPartner || 'BlueDart Express Air'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">Priority Air Express Dispatch</span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Tracking AWB Number
                  </span>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-mono font-bold text-sm text-white">
                      {order.trackingNumber || 'BD88291042'}
                    </span>
                    <button
                      onClick={() => handleCopyAWB(order.trackingNumber || 'BD88291042')}
                      className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                      title="Copy Tracking Number"
                    >
                      {copiedAWB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Direct courier sync active</span>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Delivery Destination
                  </span>
                  <p className="font-bold text-white mt-1.5 truncate">
                    {order.customer.fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {order.customer.city}, {order.customer.state} ({order.customer.pincode})
                  </p>
                </div>
              </div>

              {/* ============================================================== */}
              {/* VISUAL 7-STAGE ORDER TIMELINE */}
              {/* ============================================================== */}
              <div className="mt-10 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1455D9] animate-pulse" />
                      Live Shipment Progress Timeline
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Updated live as checkpoints are scanned by delivery hubs across India.
                    </p>
                  </div>

                  <span className="text-xs font-mono font-semibold text-[#1455D9] bg-[#1455D9]/10 px-2.5 py-1 rounded-full border border-[#1455D9]/20 hidden sm:inline-block">
                    Stage {Math.min(currentStageIndex + 1, 7)} of 7
                  </span>
                </div>

                {/* Desktop Stepper (Horizontal) */}
                <div className="hidden lg:block">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 -z-0">
                      <div 
                        className="h-full bg-gradient-to-r from-[#1455D9] to-blue-400 transition-all duration-700 ease-out"
                        style={{ 
                          width: `${(Math.min(currentStageIndex, 6) / 6) * 100}%` 
                        }}
                      />
                    </div>

                    {TIMELINE_STAGES.map((st, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex && !isCancelled;

                      return (
                        <div key={st.status} className="relative z-10 flex flex-col items-center text-center max-w-[120px]">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#1455D9] text-white ring-4 ring-[#1455D9]/40 shadow-lg shadow-[#1455D9]/60 scale-110'
                              : isCompleted
                              ? 'bg-[#1455D9] text-white'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {isCompleted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isCurrent ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                            ) : (
                              idx + 1
                            )}
                          </div>

                          <span className={`text-[11px] font-bold mt-3 block ${
                            isCurrent
                              ? 'text-white'
                              : isCompleted
                              ? 'text-slate-300'
                              : 'text-slate-500'
                          }`}>
                            {st.label}
                          </span>

                          <span className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-2">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Stepper (Vertical) */}
                <div className="lg:hidden space-y-4">
                  {TIMELINE_STAGES.map((st, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex && !isCancelled;

                    return (
                      <div key={st.status} className="flex items-start gap-3 relative">
                        {idx < TIMELINE_STAGES.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                              idx < currentStageIndex ? 'bg-[#1455D9]' : 'bg-slate-800'
                            }`}
                          />
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                          isCurrent
                            ? 'bg-[#1455D9] text-white ring-4 ring-[#1455D9]/40 shadow-lg'
                            : isCompleted
                            ? 'bg-[#1455D9] text-white'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>

                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                              {st.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#1455D9] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Two-Column Detail Grid: Checkpoint Log & Ordered Items */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column (7 cols): Detailed Checkpoint Scan History */}
              <div className="lg:col-span-7 bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1455D9]" />
                    Hub Checkpoint Activity Log
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {(order.statusHistory || []).length} Recorded Milestones
                  </span>
                </div>

                <div className="space-y-4">
                  {(order.statusHistory && order.statusHistory.length > 0) ? (
                    order.statusHistory.slice().reverse().map((entry: StatusHistoryEntry, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1455D9] mt-1 shrink-0 ring-4 ring-[#1455D9]/20" />
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-white text-xs">{entry.status}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{entry.timestamp}</span>
                          </div>
                          {entry.location && (
                            <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {entry.location}
                            </p>
                          )}
                          {entry.note && (
                            <p className="text-[11px] text-slate-400 leading-relaxed">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 p-4 text-center">
                      Checkpoint scans are recorded as the package reaches intermediate sorting hubs.
                    </div>
                  )}
                </div>

                {/* Automated Notification SMS/Email dispatch log */}
                {order.notificationsSent && order.notificationsSent.length > 0 && (
                  <div className="pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                      <Bell className="w-3 h-3 text-[#1455D9]" /> Customer Notifications Dispatched
                    </span>
                    <div className="space-y-2">
                      {order.notificationsSent.map((notif, nIdx) => (
                        <div key={nIdx} className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                          <span className="uppercase text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono shrink-0">
                            {notif.channel}
                          </span>
                          <div className="flex-1">
                            <p className="text-slate-300">{notif.message}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">{notif.timestamp} · To: {notif.recipient}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Order Items Summary & Payment Info */}
              <div className="lg:col-span-5 bg-[#0D111D] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white pb-3 border-b border-slate-800">
                    Package Contents ({order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'})
                  </h3>

                  <div className="divide-y divide-slate-800/80 mt-3">
                    {order.items.map((item, i) => {
                      const itemImg = item.product.colorImages?.[item.selectedColor] || item.product.images[0];
                      return (
                        <div key={i} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={itemImg}
                              alt={`${item.product.name} in ${item.selectedColor}`}
                              className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-white text-xs">{item.product.name}</p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                <span className="bg-slate-800 px-1.5 py-0.5 rounded font-semibold text-slate-300">
                                  {item.selectedSize}
                                </span>
                                <span className="flex items-center gap-1 font-semibold text-slate-200">
                                  <span 
                                    className="w-2 h-2 rounded-full border border-white/20"
                                    style={{
                                      backgroundColor: 
                                        item.selectedColor.toLowerCase() === 'white' ? '#FFFFFF' :
                                        item.selectedColor.toLowerCase() === 'grey' ? '#6B7280' : '#111827'
                                    }}
                                  />
                                  {item.selectedColor}
                                </span>
                                <span>Qty {item.quantity}</span>
                              </div>
                            </div>
                          </div>

                          <span className="font-bold text-white text-xs shrink-0">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment & Amount Summary */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping:</span>
                    <span className="text-emerald-400 font-semibold">
                      {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-white">Total Amount:</span>
                    <span className="text-base font-black text-white font-mono">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Address</span>
                  <p className="font-bold text-white">{order.customer.fullName}</p>
                  <p className="text-slate-400 leading-relaxed">
                    {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                  </p>
                  <p className="text-slate-400 pt-1">Phone: +91 {order.customer.phone}</p>
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  {onOpenReceipt && (
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Download Official Invoice</span>
                    </button>
                  )}
                  <button
                    onClick={onBackToShop}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
