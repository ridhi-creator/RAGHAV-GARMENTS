import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  KeyRound,
  CheckCircle2,
  X,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: AdminUser) => void;
  onBackToStore: () => void;
}

const AUTHORIZED_OWNER_EMAIL = 'ridhitaneja1404@gmail.com';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState(AUTHORIZED_OWNER_EMAIL);
  const [password, setPassword] = useState('RaghavOwner@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Error & Access Denied state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accessDeniedDetails, setAccessDeniedDetails] = useState<string | null>(null);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(AUTHORIZED_OWNER_EMAIL);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // 1. Password Credentials Form Submit
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAccessDeniedDetails(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 || data.code === 'ACCESS_DENIED') {
          setAccessDeniedDetails(data.error || 'ACCESS DENIED: Only the verified owner is authorized.');
        } else {
          setErrorMessage(data.error || 'Authentication failed. Please verify your credentials.');
        }
        return;
      }

      sessionStorage.setItem('raghav_admin_token', data.token);
      sessionStorage.setItem('raghav_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google OAuth Authentication (Authorized Owner vs Unauthorized Simulation)
  const handleGoogleSignIn = async (simulatedEmail: string = AUTHORIZED_OWNER_EMAIL, name: string = 'Ridhi Taneja') => {
    setErrorMessage(null);
    setAccessDeniedDetails(null);
    setIsGoogleLoading(true);

    try {
      const response = await fetch('/api/admin/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: simulatedEmail,
          name
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 || data.code === 'ACCESS_DENIED') {
          setAccessDeniedDetails(data.error || 'ACCESS DENIED: This Google account is not authorized.');
        } else {
          setErrorMessage(data.error || 'Google authentication failed.');
        }
        return;
      }

      sessionStorage.setItem('raghav_admin_token', data.token);
      sessionStorage.setItem('raghav_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication error.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 3. Forgot Password Request
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error || 'Failed to request recovery');
        return;
      }

      setGeneratedCode(data.recoveryCode);
      setForgotMessage(data.message);
      setForgotStep('reset');
    } catch (err: any) {
      setForgotError(err.message || 'Error communicating with server');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: recoveryCode, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        setForgotError(data.error || 'Failed to update password');
        return;
      }

      setPassword(newPassword);
      setIsForgotModalOpen(false);
      setForgotStep('request');
      setForgotMessage('Password successfully updated! You can now log in.');
    } catch (err: any) {
      setForgotError(err.message || 'Error updating password');
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1455D9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#1455D9]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <header className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between relative z-10 backdrop-blur-md">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors group px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-[#1455D9] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Owner-Only Encrypted Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-[#0D111D] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {/* Brand Logo & Title */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <BrandLogo size="lg" showText={false} />
            </div>
            <h1 className="text-2xl font-bold font-heading text-white tracking-tight">
              RAGHAV GARMENTS
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1455D9]/10 border border-[#1455D9]/30 text-[#1455D9] text-xs font-semibold mt-2">
              <Lock className="w-3 h-3" />
              <span>Owner Administrative Portal</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Strictly restricted to the authorized store owner (<span className="text-slate-200 font-mono font-semibold">{AUTHORIZED_OWNER_EMAIL}</span>).
            </p>
          </div>

          {/* ACCESS DENIED ALERT SCREEN */}
          {accessDeniedDetails && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border-2 border-rose-500/60 shadow-lg shadow-rose-950/50 animate-shake">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 tracking-wider uppercase">
                    Security Alert: Access Denied
                  </h4>
                  <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                    {accessDeniedDetails}
                  </p>
                  <span className="text-[10px] text-rose-400/80 block mt-2 font-mono">
                    Incident recorded in server security audit log.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Regular Error Message */}
          {errorMessage && !accessDeniedDetails && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message from reset */}
          {forgotMessage && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{forgotMessage}</span>
            </div>
          )}

          {/* GOOGLE SIGN-IN OPTION */}
          <div className="mb-5 space-y-2">
            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={() => handleGoogleSignIn(AUTHORIZED_OWNER_EMAIL, 'Ridhi Taneja')}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-3 transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1455D9]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>Continue with Google ({AUTHORIZED_OWNER_EMAIL})</span>
            </button>

            {/* Simulated unauthorized account button for demonstrating strict security */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleGoogleSignIn('intruder.unauthorized@gmail.com', 'Unknown User')}
                className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors inline-flex items-center gap-1"
                title="Click to test unauthorized access blocking"
              >
                <span>Test Unauthorized Login Block</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-[#0D111D] px-2 text-slate-500">Or sign in with password</span>
            </div>
          </div>

          {/* Password Login Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Authorized Owner Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ridhitaneja1404@gmail.com"
                className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#1455D9] focus:ring-1 focus:ring-[#1455D9] transition-all font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-[#1455D9] hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#080B12] border border-slate-700/80 rounded-xl pl-4 pr-11 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#1455D9] focus:ring-1 focus:ring-[#1455D9] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="bg-[#1455D9]/5 border border-[#1455D9]/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-300 block font-mono">
                  Owner: {AUTHORIZED_OWNER_EMAIL}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Pass: RaghavOwner@2026!
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail(AUTHORIZED_OWNER_EMAIL);
                  setPassword('RaghavOwner@2026!');
                  setAccessDeniedDetails(null);
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1 text-[11px] text-[#1455D9] hover:text-blue-300 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Fill</span>
              </button>
            </div>

            {/* Secure Login Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-[#1455D9] hover:bg-[#0F42A8] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 shadow-lg shadow-[#1455D9]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Owner Identity...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Owner Login</span>
                </>
              )}
            </button>
          </form>

        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D111D] border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#1455D9]" />
                <h3 className="text-sm font-bold text-white">Owner Password Recovery</h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {forgotError}
              </div>
            )}

            {forgotStep === 'request' ? (
              <form onSubmit={handleRequestRecovery} className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Enter the owner email address to receive a secure 6-digit recovery code.
                </p>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Owner Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Generate Recovery Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                {generatedCode && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <span className="block text-[11px]">Recovery Code Generated for Owner:</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">{generatedCode}</span>
                  </div>
                )}
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">6-Digit Code</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter code"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono tracking-widest text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#080B12] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Set New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <footer className="py-4 text-center text-xs text-slate-600 border-t border-slate-800/60 relative z-10">
        <p>© {new Date().getFullYear()} RAGHAV GARMENTS • Confidential Owner Administration Portal</p>
      </footer>
    </div>
  );
};
