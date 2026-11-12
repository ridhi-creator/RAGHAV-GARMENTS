import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  TrendingUp,
  IndianRupee,
  Shield,
  X,
  ChevronDown,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Save,
  Check,
  Database,
  Copy,
  CheckCheck,
  CreditCard,
  Receipt
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { Product, AdminUser, AdminOrder, CustomerRecord, CategoryItem, SiteSettings, OrderStatus, PaymentStatus } from '../../types';

interface AdminDashboardProps {
  token: string;
  adminUser: AdminUser;
  onLogout: () => void;
  onNavigateToStore: () => void;
  onProductsUpdated?: () => void;
}

type TabType = 'overview' | 'products' | 'categories' | 'orders' | 'payments' | 'customers' | 'settings' | 'security' | 'supabase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  onLogout,
  onNavigateToStore,
  onProductsUpdated
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Supabase Integration state (Project: ibergysewvwrbfeatoul)
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<string | null>(null);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  // Feedback notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Selected Order Detail Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<AdminOrder | null>(null);

  // Payment Management States
  const [refundModalOrder, setRefundModalOrder] = useState<AdminOrder | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState<number>(0);
  const [refundReasonInput, setRefundReasonInput] = useState<string>('Customer return / exchange');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'pajamas' as Product['category'],
    originalPrice: 1999,
    price: 1199,
    badge: 'New Arrival',
    fabric: '100% Combed Cotton',
    fit: 'Regular Comfort Fit',
    care: 'Machine wash cold with like colors',
    description: '',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'] as string[],
    inStock: true,
    blackImage: '',
    whiteImage: '',
    greyImage: ''
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch all initial admin data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, productsRes, ordersRes, customersRes, categoriesRes, settingsRes, auditRes, supabaseRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/products'),
        fetch('/api/orders', { headers }),
        fetch('/api/customers', { headers }),
        fetch('/api/categories'),
        fetch('/api/settings'),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/supabase-status', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (customersRes.ok) setCustomers(await customersRes.json());
      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
      if (supabaseRes.ok) {
        const sbData = await supabaseRes.json();
        setSupabaseStatus(sbData);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      showNotification('Error loading data from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Product Operations
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'pajamas',
      originalPrice: 1999,
      price: 1199,
      badge: 'New Arrival',
      fabric: '100% Combed Cotton',
      fit: 'Regular Comfort Fit',
      care: 'Machine wash cold with like colors',
      description: 'Handcrafted luxury garment tailored with signature Raghav Garments precision.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      blackImage: '/src/assets/images/pajamas_cotton_black_1793695964673.jpg',
      whiteImage: '/src/assets/images/pajamas_white_cotton_1793697240501.jpg',
      greyImage: '/src/assets/images/pajamas_grey_loungewear_1793695985061.jpg'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      originalPrice: prod.originalPrice,
      price: prod.price,
      badge: prod.badge || 'New Arrival',
      fabric: prod.fabric || '100% Combed Cotton',
      fit: prod.fit || 'Regular Comfort Fit',
      care: prod.care || 'Machine wash cold',
      description: prod.description || '',
      sizes: prod.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: prod.inStock,
      blackImage: prod.colorImages?.['Black'] || prod.images[0] || '',
      whiteImage: prod.colorImages?.['White'] || prod.images[0] || '',
      greyImage: prod.colorImages?.['Grey'] || prod.images[0] || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      showNotification('Product name is required');
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      originalPrice: Number(productForm.originalPrice),
      price: Number(productForm.price),
      badge: productForm.badge,
      fabric: productForm.fabric,
      fit: productForm.fit,
      care: productForm.care,
      description: productForm.description,
      sizes: productForm.sizes,
      inStock: productForm.inStock,
      images: [
        productForm.blackImage || productForm.whiteImage || productForm.greyImage || '/src/assets/images/category_mens_pajamas_1793694585873.jpg'
      ],
      colorImages: {
        'Black': productForm.blackImage,
        'White': productForm.whiteImage,
        'Grey': productForm.greyImage
      },
      colors: [
        { name: 'Black', hex: '#111827' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Grey', hex: '#6B7280' }
      ]
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');

      showNotification(editingProduct ? 'Product updated successfully' : 'New product created successfully');
      setIsProductModalOpen(false);
      fetchData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err: any) {
      showNotification(err.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete product');

      showNotification('Product removed from catalog');
      setDeleteConfirmId(null);
      fetchData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err: any) {
      showNotification(err.message || 'Error deleting product');
    }
  };

  // Order Operations
  const handleUpdateOrderStatus = async (
    orderId: string, 
    newStatus: OrderStatus,
    courierPartner?: string,
    trackingNumber?: string,
    location?: string,
    note?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          courierPartner,
          trackingNumber,
          location,
          note
        })
      });

      if (!res.ok) throw new Error('Failed to update status');

      showNotification(`Order ${orderId} marked as "${newStatus}"`);
      fetchData();
      if (selectedOrderDetails && selectedOrderDetails.orderId === orderId) {
        setSelectedOrderDetails((prev) => prev ? { ...prev, status: newStatus, courierPartner, trackingNumber } : null);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error updating order status');
    }
  };

  // Payment Management Operations
  const handlePaymentAction = async (
    orderId: string, 
    action: 'mark_paid' | 'verify_upi' | 'refund', 
    amount?: number, 
    reason?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, amount, reason })
      });

      if (!res.ok) throw new Error('Failed to update payment');

      showNotification(`Payment action "${action}" completed for order ${orderId}`);
      setRefundModalOrder(null);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Payment action failed');
    }
  };

  // Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingCategory)
      });

      if (!res.ok) throw new Error('Failed to update category');

      showNotification('Category updated successfully');
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving category');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!res.ok) throw new Error('Failed to update settings');

      showNotification('Storefront settings updated successfully');
    } catch (err: any) {
      showNotification(err.message || 'Error saving settings');
    }
  };

  // Supabase Backend Handlers
  const handleSaveSupabaseKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseKeyInput.trim()) return;

    try {
      const res = await fetch('/api/admin/supabase-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ apiKey: supabaseKeyInput.trim() })
      });

      if (!res.ok) throw new Error('Failed to update Supabase key');
      showNotification('Supabase API key updated successfully');
      setSupabaseKeyInput('');
      fetchData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving Supabase key');
    }
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestResult(null);

    try {
      const res = await fetch('/api/admin/supabase-test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) {
        setSupabaseTestResult(`Error: ${data.error || 'Connection failed'}`);
      } else {
        setSupabaseTestResult(`Success: ${data.message}`);
      }
    } catch (err: any) {
      setSupabaseTestResult(`Connection exception: ${err.message}`);
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleCopySql = () => {
    if (supabaseStatus?.sqlSchema) {
      navigator.clipboard.writeText(supabaseStatus.sqlSchema);
      setHasCopiedSql(true);
      showNotification('Supabase SQL schema copied to clipboard!');
      setTimeout(() => setHasCopiedSql(false), 3000);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      c.city.toLowerCase().includes(customerSearch.toLowerCase())
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Out for Delivery':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      case 'Shipped':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'Packed':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'Processing':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'Confirmed':
      case 'Order Confirmed':
        return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      case 'Pending':
      case 'Order Placed':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Cancelled':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'Refunded':
      case 'Returned':
      case 'Return Requested':
        return 'bg-purple-950/60 border-purple-500/30 text-purple-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1455D9] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-white/20">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-[#0D111D] border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size="sm" showText={true} />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1455D9]/20 text-[#1455D9] border border-[#1455D9]/40">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">v2.4 Live Store Control</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStore}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#1455D9]" />
            <span>View Storefront</span>
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-[#1455D9] flex items-center justify-center font-bold text-xs text-white shadow-md">
              R
            </div>
            <div className="hidden md:block text-left text-xs">
              <span className="font-semibold text-white block">Ridhi Taneja</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Verified Owner: ridhitaneja1404@gmail.com
              </span>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0A0E17] border-b md:border-b-0 md:border-r border-slate-800 p-4 shrink-0">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products Management</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'categories'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Categories (4)</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders Management</span>
              </div>
              {orders.filter((o) => o.status === 'Pending').length > 0 && (
                <span className="text-[10px] bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded-full">
                  {orders.filter((o) => o.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'payments'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Payment Management</span>
              </div>
              {orders.filter((o) => o.paymentStatus === 'Pending').length > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                  {orders.filter((o) => o.paymentStatus === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Security & Logs</span>
              </div>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Armed
              </span>
            </button>

            <button
              onClick={() => setActiveTab('supabase')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'supabase'
                  ? 'bg-[#1455D9] text-white shadow-md shadow-[#1455D9]/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Supabase Backend</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Connected
              </span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-white block">Server Sync Active</span>
              <p className="text-[10px]">All additions, edits, and status changes sync live to the database.</p>
              <button
                onClick={fetchData}
                className="mt-2 text-[#1455D9] hover:text-blue-300 inline-flex items-center gap-1 font-semibold text-[10px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

          {/* ================================================================ */}
          {/* TAB 1: OVERVIEW */}
          {/* ================================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Dashboard Overview
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Live store analytics, order fulfillment status, and inventory metrics.
                </p>
              </div>

              {/* 6 Key Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Sales</span>
                    <IndianRupee className="w-4 h-4 text-[#1455D9]" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      ₹{stats?.totalSales ? stats.totalSales.toLocaleString('en-IN') : '0'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">Across all orders</span>
                </div>

                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#1455D9]" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {stats?.totalOrders ?? orders.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Lifetime fulfilled</span>
                </div>

                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-amber-400">
                      {stats?.pendingOrders ?? 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300/80 block mt-1">Needs packaging</span>
                </div>

                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Products</span>
                    <Package className="w-4 h-4 text-[#1455D9]" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {products.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">4 Men's Categories</span>
                </div>

                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Customers</span>
                    <Users className="w-4 h-4 text-[#1455D9]" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {customers.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Registered clients</span>
                </div>

                <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Delivered</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {orders.filter((o) => o.status === 'Delivered').length}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">100% Success rate</span>
                </div>
              </div>

              {/* Quick Actions & Category Inventory Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Category Inventory Breakdown */}
                <div className="lg:col-span-2 bg-[#0D111D] border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                    <span>Category Inventory Distribution</span>
                    <span className="text-xs text-slate-400 font-normal">Strict Category Compliance</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Men's Pajamas</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {products.filter((p) => p.category === 'pajamas').length} Styles
                      </span>
                      <span className="text-[10px] text-emerald-400">100% In Stock</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Men's Pants</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {products.filter((p) => p.category === 'pants').length} Styles
                      </span>
                      <span className="text-[10px] text-emerald-400">Chinos & Trousers</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Men's Jackets</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {products.filter((p) => p.category === 'jackets').length} Styles
                      </span>
                      <span className="text-[10px] text-emerald-400">Bombers & Quilted</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block">Men's Track Suits</span>
                      <span className="text-lg font-bold text-white mt-1 block">
                        {products.filter((p) => p.category === 'tracksuits').length} Styles
                      </span>
                      <span className="text-[10px] text-emerald-400">Matching Sets</span>
                    </div>
                  </div>
                </div>

                {/* Quick Management Shortcuts */}
                <div className="bg-[#0D111D] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Quick Management</h3>
                    <p className="text-xs text-slate-400 mb-4">Frequently used admin actions</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full flex items-center justify-center gap-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('orders')}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-slate-700"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#1455D9]" />
                      <span>Manage Orders ({orders.length})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('settings')}
                      className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-slate-700"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Store Settings</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Recent Orders Overview Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Recent Orders</h3>
                    <p className="text-xs text-slate-400">Latest customer transactions from India</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#1455D9] hover:text-blue-300 font-semibold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Items</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 font-semibold">Payment</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#1455D9]">
                            {ord.orderId}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{ord.customer.fullName}</span>
                            <span className="text-[11px] text-slate-400">{ord.customer.city}, {ord.customer.state}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {ord.items.length} item(s)
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(ord.status)}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {/* ================================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Product Catalog Management
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, modify prices, upload photos, and update stock status.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-[#1455D9]/25 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by product name or ID..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 shrink-0">Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#080B12] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    <option value="pajamas">Men's Pajamas</option>
                    <option value="pants">Men's Pants</option>
                    <option value="jackets">Men's Jackets</option>
                    <option value="tracksuits">Men's Track Suits</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Product</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Price</th>
                        <th className="py-3 px-4 font-semibold">Discount</th>
                        <th className="py-3 px-4 font-semibold">Sizes</th>
                        <th className="py-3 px-4 font-semibold">Colors</th>
                        <th className="py-3 px-4 font-semibold">Stock</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.colorImages?.['Black'] || p.images[0]}
                                alt={p.name}
                                className="w-12 h-14 object-cover rounded-lg bg-slate-800 border border-slate-700 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block max-w-xs">{p.name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">ID: {p.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="capitalize text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-white">₹{p.price}</span>
                            {p.originalPrice > p.price && (
                              <span className="text-[10px] text-slate-500 line-through block">
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-400 font-semibold">{p.discount}% OFF</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {p.sizes.join(', ')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full bg-black border border-slate-600" title="Black" />
                              <span className="w-3 h-3 rounded-full bg-white border border-slate-300" title="White" />
                              <span className="w-3 h-3 rounded-full bg-gray-500 border border-slate-600" title="Grey" />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {p.inStock ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                title="Edit Product"
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                title="Delete Product"
                                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: CATEGORIES */}
          {/* ================================================================ */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Men's Fashion Categories
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the 4 core men's fashion departments and their banner imagery.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 bg-slate-900 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D111D] via-transparent to-transparent" />
                        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                          {products.filter((p) => p.category === cat.key).length} Active Products
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white">{cat.title}</h3>
                          <span className="text-[10px] uppercase font-bold text-[#1455D9] bg-[#1455D9]/10 px-2 py-0.5 rounded border border-[#1455D9]/30">
                            Key: {cat.key}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between mt-4">
                      <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Active on Storefront
                      </span>
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsCategoryModalOpen(true);
                        }}
                        className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Category</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: ORDERS MANAGEMENT */}
          {/* ================================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Customer Orders Management
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track delivery progress, update order status, and inspect customer shipment notes.
                </p>
              </div>

              {/* Order Status Filters & Search */}
              <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, customer, phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 shrink-0">Filter Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#080B12] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  >
                    <option value="all">All Orders ({orders.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Date</th>
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Phone</th>
                        <th className="py-3 px-4 font-semibold">Address</th>
                        <th className="py-3 px-4 font-semibold">Total</th>
                        <th className="py-3 px-4 font-semibold">Payment</th>
                        <th className="py-3 px-4 font-semibold">Status Update</th>
                        <th className="py-3 px-4 font-semibold text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#1455D9]">
                            {ord.orderId}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {ord.orderDate}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{ord.customer.fullName}</span>
                            <span className="text-[11px] text-slate-500">{ord.customer.email}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono">
                            {ord.customer.phone}
                          </td>
                          <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                            {ord.customer.city}, {ord.customer.state} ({ord.customer.pincode})
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300 block">
                              {ord.paymentMethod}
                            </span>
                            <span className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                              ord.paymentStatus === 'Paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : ord.paymentStatus === 'Refunded'
                                ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value as OrderStatus)}
                              className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(ord.status)} bg-[#080B12]`}
                            >
                              <option value="Order Placed">1. Order Placed</option>
                              <option value="Order Confirmed">2. Order Confirmed</option>
                              <option value="Processing">3. Processing</option>
                              <option value="Packed">4. Packed</option>
                              <option value="Shipped">5. Shipped</option>
                              <option value="Out for Delivery">6. Out for Delivery</option>
                              <option value="Delivered">7. Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Return Requested">Return Requested</option>
                              <option value="Returned">Returned</option>
                              <option value="Refunded">Refunded</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              View / Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB: PAYMENT MANAGEMENT */}
          {/* ================================================================ */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-7xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2.5">
                    <CreditCard className="w-6 h-6 text-[#1455D9]" />
                    Payment Management & Reconciliation
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage online settlements, verify UPI/COD collections, and process customer refunds.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Gateway Status:</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Razorpay 256-Bit Active
                  </span>
                </div>
              </div>

              {/* 4 Payment Metric Cards */}
              {(() => {
                const paidOrders = orders.filter((o) => o.paymentStatus === 'Paid');
                const pendingOrders = orders.filter((o) => o.paymentStatus === 'Pending');
                const refundedOrders = orders.filter((o) => o.paymentStatus === 'Refunded' || o.paymentStatus === 'Partially Refunded');

                const totalRevenuePaid = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                const totalPendingCOD = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                const totalRefunds = refundedOrders.reduce((sum, o) => sum + (o.refundDetails?.amount || o.total || 0), 0);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#0D111D] border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Revenue Collected (Paid)</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-white font-heading">
                          ₹{totalRevenuePaid.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 block mt-1">
                        Across {paidOrders.length} verified transactions
                      </span>
                    </div>

                    <div className="bg-[#0D111D] border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Pending Collection (COD/UPI)</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-amber-400 font-heading">
                          ₹{totalPendingCOD.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 block mt-1">
                        {pendingOrders.length} orders awaiting receipt
                      </span>
                    </div>

                    <div className="bg-[#0D111D] border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Refunds Processed</span>
                        <AlertCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-purple-400 font-heading">
                          ₹{totalRefunds.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {refundedOrders.length} return refunds settled
                      </span>
                    </div>

                    <div className="bg-[#0D111D] border border-slate-800 p-5 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>Total Orders</span>
                        <Receipt className="w-4 h-4 text-[#1455D9]" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-white font-heading">
                          {orders.length}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#1455D9] block mt-1">
                        100% PCI-DSS compliant
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Payment Methods Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { 
                    label: 'Cash on Delivery (COD)', 
                    count: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('cod')).length,
                    amount: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('cod')).reduce((s, o) => s + (o.total || 0), 0)
                  },
                  { 
                    label: 'UPI (GPay / PhonePe)', 
                    count: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('upi')).length,
                    amount: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('upi')).reduce((s, o) => s + (o.total || 0), 0)
                  },
                  { 
                    label: 'Debit / Credit Cards', 
                    count: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('card')).length,
                    amount: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('card')).reduce((s, o) => s + (o.total || 0), 0)
                  },
                  { 
                    label: 'Net Banking', 
                    count: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('net')).length,
                    amount: orders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('net')).reduce((s, o) => s + (o.total || 0), 0)
                  }
                ].map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0D111D] border border-slate-800 text-xs">
                    <span className="text-slate-400 block font-semibold">{m.label}</span>
                    <span className="text-lg font-bold text-white block mt-1">
                      ₹{m.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{m.count} Orders</span>
                  </div>
                ))}
              </div>

              {/* Transactions Management Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Order Payments & Reconciliation Queue
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Filter:</span>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="bg-[#080B12] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="all">All Payments ({orders.length})</option>
                      <option value="Pending">Pending Collection ({orders.filter((o) => o.paymentStatus === 'Pending').length})</option>
                      <option value="Paid">Paid & Settled ({orders.filter((o) => o.paymentStatus === 'Paid').length})</option>
                      <option value="Refunded">Refunded ({orders.filter((o) => o.paymentStatus === 'Refunded').length})</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Customer</th>
                        <th className="py-3 px-4 font-semibold">Amount</th>
                        <th className="py-3 px-4 font-semibold">Method</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Reference ID</th>
                        <th className="py-3 px-4 font-semibold text-right">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders
                        .filter((ord) => paymentFilter === 'all' || ord.paymentStatus === paymentFilter)
                        .map((ord) => (
                          <tr key={ord.orderId} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[#1455D9]">
                              {ord.orderId}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-white block">{ord.customer.fullName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">+91 {ord.customer.phone}</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-white text-sm">
                              ₹{ord.total.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ord.paymentStatus === 'Paid'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                  : ord.paymentStatus === 'Refunded'
                                  ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                                  : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                              {ord.transactionId || 'Awaiting Settlement'}
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              {ord.paymentStatus === 'Pending' ? (
                                <>
                                  <button
                                    onClick={() => handlePaymentAction(ord.orderId, 'mark_paid')}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                                  >
                                    Mark Collected / Paid
                                  </button>
                                  {ord.paymentMethod.toLowerCase().includes('upi') && (
                                    <button
                                      onClick={() => handlePaymentAction(ord.orderId, 'verify_upi')}
                                      className="px-2.5 py-1 bg-[#1455D9] hover:bg-[#0F42A8] text-white rounded-lg text-xs font-bold transition-colors"
                                    >
                                      Verify UPI
                                    </button>
                                  )}
                                </>
                              ) : ord.paymentStatus === 'Paid' ? (
                                <button
                                  onClick={() => {
                                    setRefundModalOrder(ord);
                                    setRefundAmountInput(ord.total);
                                  }}
                                  className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                  Process Refund
                                </button>
                              ) : (
                                <span className="text-[11px] text-purple-400 font-semibold">
                                  Refunded (Ref: {ord.refundDetails?.refundId})
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: CUSTOMERS */}
          {/* ================================================================ */}
          {activeTab === 'customers' && (
            <div className="space-y-6 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Customer Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Client profiles, purchase histories, and contact records across India.
                </p>
              </div>

              {/* Customer Search */}
              <div className="bg-[#0D111D] border border-slate-800 p-4 rounded-2xl">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, city..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
              </div>

              {/* Customer Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Customer Name</th>
                        <th className="py-3 px-4 font-semibold">Email</th>
                        <th className="py-3 px-4 font-semibold">Phone</th>
                        <th className="py-3 px-4 font-semibold">Location</th>
                        <th className="py-3 px-4 font-semibold">Total Orders</th>
                        <th className="py-3 px-4 font-semibold">Total Spent</th>
                        <th className="py-3 px-4 font-semibold">Member Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">
                            {cust.name}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {cust.email}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {cust.phone}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {cust.city}, {cust.state}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#1455D9] bg-[#1455D9]/10 px-2 py-0.5 rounded border border-[#1455D9]/30">
                              {cust.ordersCount} Orders
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            ₹{cust.totalSpent.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {cust.registeredDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 6: SETTINGS */}
          {/* ================================================================ */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  Website & Store Settings
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Update marquee promotional banner, customer service hotline, and dispatch thresholds.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#0D111D] border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Promotional Marquee Text (Top Announcement Bar)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Support Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Free Shipping Order Minimum (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full sm:w-48 bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Atelier & Store Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-[#1455D9]/25"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Website Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 7: SECURITY & AUDIT LOGS */}
          {/* ================================================================ */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2.5">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <span>Owner-Only Security & Access Logs</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enforces strict access control for <span className="text-white font-mono font-bold">ridhitaneja1404@gmail.com</span>. All login requests are authenticated and logged server-side.
                </p>
              </div>

              {/* Security Policy Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Authorized Owner Account
                  </span>
                  <span className="text-sm font-bold text-white font-mono block">
                    ridhitaneja1404@gmail.com
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    The single, non-transferable owner identity authorized for store administration.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D111D] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Registration Policy
                  </span>
                  <span className="text-sm font-bold text-amber-400 block">
                    Strictly Prohibited
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Public signups and secondary admin invites are hard-disabled on the server.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D111D] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Server Audit Subsystem
                  </span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Armed & Monitoring
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {auditLogs.length} total access events logged with IP and timestamp.
                  </p>
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="bg-[#0D111D] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Security Event Log</h3>
                    <p className="text-xs text-slate-400">Chronological history of owner logins and blocked unauthorized attempts</p>
                  </div>
                  <button
                    onClick={fetchData}
                    className="text-xs text-[#1455D9] hover:text-blue-300 font-semibold inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Log</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Timestamp</th>
                        <th className="py-3 px-4 font-semibold">Account / Email</th>
                        <th className="py-3 px-4 font-semibold">Action</th>
                        <th className="py-3 px-4 font-semibold">Security Result</th>
                        <th className="py-3 px-4 font-semibold">Client IP</th>
                        <th className="py-3 px-4 font-semibold">Incident Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-white">
                            {log.email}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {log.status === 'SUCCESS' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                SUCCESS
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                BLOCKED (ACCESS DENIED)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                            {log.ip}
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-sm">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 8: SUPABASE BACKEND INTEGRATION (Project: ibergysewvwrbfeatoul) */}
          {/* ================================================================ */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-7xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2.5">
                  <Database className="w-6 h-6 text-emerald-400" />
                  <span>Supabase Backend Integration</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connected to Supabase Project <span className="text-white font-mono font-bold">ibergysewvwrbfeatoul</span>. Whenever customers complete order checkout, their details are automatically saved to your Supabase tables.
                </p>
              </div>

              {/* Project Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Supabase Project ID
                  </span>
                  <span className="text-sm font-bold text-white font-mono block">
                    ibergysewvwrbfeatoul
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                    https://ibergysewvwrbfeatoul.supabase.co
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D111D] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Target Tables
                  </span>
                  <span className="text-sm font-bold text-white font-mono block">
                    orders & customers
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Receives customer names, phones, addresses, sizes, colors, and amounts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0D111D] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Order Sync Pipeline
                  </span>
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-Save Hook Active
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Triggered instantaneously whenever checkout is submitted.
                  </p>
                </div>
              </div>

              {/* Supabase API Key Configuration & Connection Tester */}
              <div className="bg-[#0D111D] border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Supabase API Credentials</h3>
                  <p className="text-xs text-slate-400">
                    Enter your Supabase <span className="text-slate-300 font-mono">anon public key</span> or <span className="text-slate-300 font-mono">service_role key</span> from your Supabase Project Settings → API.
                  </p>
                </div>

                <form onSubmit={handleSaveSupabaseKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Supabase API Key (Anon / Service Role)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="password"
                        value={supabaseKeyInput}
                        onChange={(e) => setSupabaseKeyInput(e.target.value)}
                        placeholder={supabaseStatus?.hasApiKey ? '•••••••••••••••••••• (Key Configured)' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}
                        className="flex-1 bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#1455D9] font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-md"
                      >
                        Save Key
                      </button>
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={isTestingSupabase}
                        className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 shrink-0 inline-flex items-center gap-1.5"
                      >
                        {isTestingSupabase ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1455D9]" />
                            <span>Testing...</span>
                          </>
                        ) : (
                          <>
                            <Database className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {supabaseTestResult && (
                    <div className={`p-3 rounded-xl text-xs font-mono border ${
                      supabaseTestResult.startsWith('Success')
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      {supabaseTestResult}
                    </div>
                  )}

                  {supabaseStatus?.lastSyncAttempt && (
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-white block">Last Checkout Sync Activity</span>
                      <p className="text-[11px] text-slate-400">
                        Order <span className="font-mono text-[#1455D9]">{supabaseStatus.lastSyncAttempt.orderId}</span> at {new Date(supabaseStatus.lastSyncAttempt.timestamp).toLocaleString()}:
                      </p>
                      <span className="text-[11px] font-mono text-slate-300 block">
                        {supabaseStatus.lastSyncAttempt.details}
                      </span>
                    </div>
                  )}
                </form>
              </div>

              {/* Supabase SQL Table Schema Definition */}
              <div className="bg-[#0D111D] border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">Database Table Schema (SQL)</h3>
                    <p className="text-xs text-slate-400">
                      Run this in your <a href="https://supabase.com/dashboard/project/ibergysewvwrbfeatoul/sql" target="_blank" rel="noopener noreferrer" className="text-[#1455D9] hover:underline">Supabase SQL Editor</a> to initialize the <span className="font-mono text-white">orders</span> table.
                    </p>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-slate-700 shrink-0 self-start sm:self-auto"
                  >
                    {hasCopiedSql ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                        <span>Copy SQL Schema</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="bg-[#080B12] border border-slate-800 p-4 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
                    {supabaseStatus?.sqlSchema || `-- Raghav Garments Orders Table in Supabase
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  status TEXT DEFAULT 'Pending',
  order_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                  </pre>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ================================================================ */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ================================================================ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Apparel Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Signature Flex Tailored Chino"
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1455D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1455D9]"
                  >
                    <option value="pajamas">Men's Pajamas</option>
                    <option value="pants">Men's Pants</option>
                    <option value="jackets">Men's Jackets</option>
                    <option value="tracksuits">Men's Track Suits</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Badge</label>
                  <select
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1455D9]"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Trending">Trending</option>
                    <option value="Special Offer">Special Offer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discounted Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#1455D9]"
                />
              </div>

              {/* Color Specific Images */}
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Mandatory Color Images (Black, White, Grey)</span>
                <div>
                  <label className="block text-slate-400 mb-1">Black Variant Image URL</label>
                  <input
                    type="text"
                    value={productForm.blackImage}
                    onChange={(e) => setProductForm({ ...productForm, blackImage: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">White Variant Image URL</label>
                  <input
                    type="text"
                    value={productForm.whiteImage}
                    onChange={(e) => setProductForm({ ...productForm, whiteImage: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Grey Variant Image URL</label>
                  <input
                    type="text"
                    value={productForm.greyImage}
                    onChange={(e) => setProductForm({ ...productForm, greyImage: e.target.value })}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#1455D9]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-[#1455D9] focus:ring-0"
                  />
                  <span>Mark as In Stock & Ready for Shipping</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1455D9] hover:bg-[#0F42A8] text-white font-bold transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111D] border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h4 className="text-base font-bold text-white">Delete Product?</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this product from the storefront? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ORDER DETAILS & STATUS UPDATE MODAL */}
      {/* ================================================================ */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">Order Management</span>
                <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                  <span>{selectedOrderDetails.orderId}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadgeClass(selectedOrderDetails.status)}`}>
                    {selectedOrderDetails.status}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Customer Information */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer & Delivery Address</span>
                <p className="text-sm font-bold text-white">{selectedOrderDetails.customer.fullName}</p>
                <p className="text-slate-300">Phone: <strong className="text-white font-mono">+91 {selectedOrderDetails.customer.phone}</strong></p>
                <p className="text-slate-300">Email: {selectedOrderDetails.customer.email}</p>
                <p className="text-slate-400 pt-1 leading-relaxed">
                  {selectedOrderDetails.customer.address}, {selectedOrderDetails.customer.city}, {selectedOrderDetails.customer.state} - {selectedOrderDetails.customer.pincode}
                </p>
              </div>

              {/* Status & Courier Control Panel */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-[#1455D9]/30 space-y-3">
                <span className="text-[10px] font-bold text-[#1455D9] uppercase tracking-wider block flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Live Courier & Fulfillment Dispatch Controls
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-[11px]">Timeline Stage:</label>
                    <select
                      value={selectedOrderDetails.status}
                      onChange={(e) => {
                        const newSt = e.target.value as OrderStatus;
                        handleUpdateOrderStatus(selectedOrderDetails.orderId, newSt, selectedOrderDetails.courierPartner, selectedOrderDetails.trackingNumber);
                      }}
                      className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-[#1455D9]"
                    >
                      <option value="Order Placed">1. Order Placed</option>
                      <option value="Order Confirmed">2. Order Confirmed</option>
                      <option value="Processing">3. Processing</option>
                      <option value="Packed">4. Packed</option>
                      <option value="Shipped">5. Shipped</option>
                      <option value="Out for Delivery">6. Out for Delivery</option>
                      <option value="Delivered">7. Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Return Requested">Return Requested</option>
                      <option value="Returned">Returned</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold text-[11px]">Courier Partner:</label>
                    <select
                      value={selectedOrderDetails.courierPartner || 'BlueDart Express'}
                      onChange={(e) => {
                        const newCp = e.target.value;
                        setSelectedOrderDetails({ ...selectedOrderDetails, courierPartner: newCp });
                        handleUpdateOrderStatus(selectedOrderDetails.orderId, selectedOrderDetails.status as OrderStatus, newCp, selectedOrderDetails.trackingNumber);
                      }}
                      className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#1455D9]"
                    >
                      <option value="BlueDart Express">BlueDart Express</option>
                      <option value="Delhivery Air">Delhivery Air</option>
                      <option value="DTDC Premium">DTDC Premium</option>
                      <option value="Ekart Logistics">Ekart Logistics</option>
                      <option value="XpressBees">XpressBees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold text-[11px]">Tracking AWB Number:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedOrderDetails.trackingNumber || ''}
                      placeholder="e.g. BD88291042"
                      onChange={(e) => setSelectedOrderDetails({ ...selectedOrderDetails, trackingNumber: e.target.value })}
                      className="flex-1 bg-[#080B12] border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-[#1455D9]"
                    />
                    <button
                      onClick={() => handleUpdateOrderStatus(
                        selectedOrderDetails.orderId,
                        selectedOrderDetails.status as OrderStatus,
                        selectedOrderDetails.courierPartner,
                        selectedOrderDetails.trackingNumber
                      )}
                      className="px-3 py-1.5 bg-[#1455D9] hover:bg-[#0F42A8] text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Save AWB
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Order Line Items</span>
                <div className="space-y-2">
                  {selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.colorImages?.[item.selectedColor] || item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">{item.product.name}</span>
                          <span className="text-slate-400 text-[11px]">
                            Size: {item.selectedSize} · Colour: <strong className="text-white">{item.selectedColor}</strong> · Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-white font-mono">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary & Controls */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Status</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      selectedOrderDetails.paymentStatus === 'Paid'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : selectedOrderDetails.paymentStatus === 'Refunded'
                        ? 'bg-purple-950 text-purple-400 border border-purple-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {selectedOrderDetails.paymentStatus} · {selectedOrderDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Grand Total</span>
                    <span className="text-lg font-black text-white font-mono">
                      ₹{selectedOrderDetails.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quick Payment Action Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                  {selectedOrderDetails.paymentStatus === 'Pending' ? (
                    <>
                      <button
                        onClick={() => {
                          handlePaymentAction(selectedOrderDetails.orderId, 'mark_paid');
                          setSelectedOrderDetails((prev) => prev ? { ...prev, paymentStatus: 'Paid' } : null);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Mark Payment Received (COD)
                      </button>
                      <button
                        onClick={() => {
                          handlePaymentAction(selectedOrderDetails.orderId, 'verify_upi');
                          setSelectedOrderDetails((prev) => prev ? { ...prev, paymentStatus: 'Paid' } : null);
                        }}
                        className="px-3 py-1.5 bg-[#1455D9] hover:bg-[#0F42A8] text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Verify UPI Transaction
                      </button>
                    </>
                  ) : selectedOrderDetails.paymentStatus === 'Paid' ? (
                    <button
                      onClick={() => {
                        setRefundModalOrder(selectedOrderDetails);
                        setRefundAmountInput(selectedOrderDetails.total);
                      }}
                      className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Process Return Refund
                    </button>
                  ) : null}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                All changes sync live to customer tracking & Supabase.
              </span>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-[#1455D9] text-white font-bold text-xs rounded-xl hover:bg-[#0F42A8] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* REFUND MODAL */}
      {/* ================================================================ */}
      {refundModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Process Customer Refund</h3>
              </div>
              <button 
                onClick={() => setRefundModalOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400">Order ID: <strong className="text-white font-mono">{refundModalOrder.orderId}</strong></p>
              <p className="text-slate-400">Customer: <strong className="text-white">{refundModalOrder.customer.fullName}</strong></p>
              <p className="text-slate-400">Order Total: <strong className="text-white">₹{refundModalOrder.total}</strong></p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmountInput}
                  max={refundModalOrder.total}
                  min={1}
                  onChange={(e) => setRefundAmountInput(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#1455D9]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {refundAmountInput < refundModalOrder.total ? 'Partial Refund' : 'Full Order Refund'}
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Refund</label>
                <textarea
                  rows={2}
                  value={refundReasonInput}
                  onChange={(e) => setRefundReasonInput(e.target.value)}
                  placeholder="e.g. Size exchange returned, defect reported..."
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#1455D9]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRefundModalOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePaymentAction(
                  refundModalOrder.orderId,
                  'refund',
                  refundAmountInput,
                  refundReasonInput
                )}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-md"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* EDIT CATEGORY MODAL */}
      {/* ================================================================ */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Edit Category</h3>
              <button onClick={() => setIsCategoryModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Subtitle Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.subtitle}
                  onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Banner Image URL</label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1455D9] text-white font-bold rounded-xl hover:bg-[#0F42A8]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
