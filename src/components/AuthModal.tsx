import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, LogOut, CheckCircle, Package } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string } | null;
  onLogin: (user: { name: string; email: string }) => void;
  onLogout: () => void;
  onNavigateOrders?: () => void;
  onNavigateTracking?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onNavigateOrders,
  onNavigateTracking,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    phone: '9876543210'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Valued Member',
      email: formData.email || 'customer@raghavgarments.com'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dark Header for Official Logo */}
        <div className="bg-[#080B12] px-6 py-5 text-center relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center">
            <BrandLogo size="md" className="justify-center" />
          </div>
          <p className="text-[11px] text-slate-300 mt-2 tracking-wide">
            {currentUser 
              ? 'Official Member Account' 
              : mode === 'login' 
                ? 'Sign in to access your orders & wishlist' 
                : 'Create an account for personalized styling & exclusive drops'}
          </p>
        </div>

        {currentUser ? (
          /* Profile view */
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#1455D9] rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl border-2 border-blue-200">
              {currentUser.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Welcome back, {currentUser.name}!
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#1455D9]" /> Membership Tier
                </span>
                <span className="text-[#1455D9] bg-blue-100/70 px-2 py-0.5 rounded font-bold">Raghav Club Elite</span>
              </div>
              <div className="text-slate-600">
                Enjoy complimentary express shipping, early access to new menswear drops, and priority customer care.
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {onNavigateOrders && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateOrders();
                  }}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#1455D9]" /> My Orders & Purchase History
                  </span>
                  <span className="text-[#1455D9]">&rarr;</span>
                </button>
              )}

              {onNavigateTracking && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTracking();
                  }}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" /> Live Parcel Tracking
                  </span>
                  <span className="text-emerald-600">&rarr;</span>
                </button>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3 rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Shop Collection
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        ) : (
          /* Login / Signup form */
          <div className="p-6 sm:p-8">
            {/* Mode Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
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
                      placeholder="e.g. Rahul Sharma"
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
                    placeholder="name@example.com"
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
                      placeholder="10-digit mobile number"
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-sm"
                >
                  {mode === 'login' ? 'Sign In to Account' : 'Register Account'}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-slate-400">
                  Demo mode: Click submit to sign in immediately.
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
