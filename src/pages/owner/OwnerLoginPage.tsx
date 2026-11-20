import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Smartphone, KeyRound, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerLoginPage: React.FC = () => {
  const { ownerLogin, ownerUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState('7337422054');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/owner';

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter any 6-digit OTP');
      return;
    }

    const res = ownerLogin(phone);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleQuickFill = (targetPhone: string) => {
    setPhone(targetPhone);
    setStep('phone');
    setError('');
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block group mb-2">
          <span className="font-serif text-4xl tracking-tight text-ink group-hover:text-terracotta transition-colors">
            Akaay
          </span>
          <div className="w-full flex items-center justify-center gap-1 mt-0.5">
            <span className="h-0.5 w-8 border-b border-dashed border-terracotta" />
          </div>
        </Link>
        <h2 className="font-serif text-2xl text-ink font-normal mt-2">
          Boutique Back Office Login
        </h2>
        <p className="text-xs text-ink-500 mt-1">
          Internal access for Akaay Boutique owners and management staff.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-ivory rounded-xl border border-ivory-400 p-6 sm:p-8 shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Staff / Owner Registered Mobile
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-ivory-400 bg-ivory-300 text-ink text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="7337422054"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded-r px-3 py-2 text-sm text-ink font-medium focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full touch-tap-target py-2.5 px-4 rounded bg-ink text-ivory text-xs font-semibold uppercase tracking-wider hover:bg-ink-900 transition-colors flex items-center justify-center gap-2"
              >
                <span>Request Back Office OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-marigold/15 border border-marigold/40 p-3 rounded text-xs text-ink-800">
                <p className="font-semibold">Simulated Back Office OTP Sent</p>
                <p className="text-ink-600 mt-0.5">
                  Demo hint: Enter <strong>any 6 digits</strong> (e.g. 123456) to sign in.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full tracking-widest text-center bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xl text-ink font-bold focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 py-2 rounded border border-ivory-400 text-xs text-ink hover:bg-ivory-200"
                >
                  Change
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors shadow"
                >
                  Enter Dashboard
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-ivory-300 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-ink-500 font-bold block">
              Simulated Demo Roles (Click to test):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('7337422054')}
                className={`p-2.5 rounded border text-left transition-all ${
                  phone === '7337422054'
                    ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                    : 'border-ivory-400 bg-ivory-100 text-ink'
                }`}
              >
                <span className="block font-bold">👑 Store Owner (Yuvaraj)</span>
                <span className="text-[10px] text-ink-500 block">Full Inventory & Staff</span>
                <span className="text-[10px] text-terracotta">73374 22054</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('9876543210')}
                className={`p-2.5 rounded border text-left transition-all ${
                  phone === '9876543210'
                    ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                    : 'border-ivory-400 bg-ivory-100 text-ink'
                }`}
              >
                <span className="block font-bold">💼 Staff (Manager)</span>
                <span className="text-[10px] text-ink-500 block">Orders only (Protected)</span>
                <span className="text-[10px] text-terracotta">98765 43210</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-ink-600 hover:text-terracotta underline"
            >
              ← Back to Customer Boutique Storefront
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-400">
          Demo data - simulated store
        </p>
      </div>
    </div>
  );
};
