import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Package, Truck, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { customerUser, customerLogin, customerLogout, orders } = useStore();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      customerLogin(phone, name || 'Boutique Patron');
    }
  };

  // Orders placed by this phone or recent orders
  const customerOrders = customerUser
    ? orders.filter((o) => o.customerPhone === customerUser.phone)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <nav className="flex items-center gap-2 text-xs text-ink-500 mb-2">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <span className="text-ink font-medium">Boutique Account</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">Patron Profile & Orders</h1>
      </div>

      {!customerUser ? (
        /* Login Screen */
        <div className="bg-ivory rounded-xl border border-ivory-400 p-6 sm:p-10 max-w-lg mx-auto shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-ivory-300 text-terracotta rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-ink">Sign in to Akaay Boutique</h2>
            <p className="text-xs text-ink-500">
              Access your order timeline, saved addresses, and express checkout.
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Your Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shalini Roy"
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Mobile Number</label>
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
                disabled={phone.length !== 10}
                className="w-full py-2.5 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors disabled:opacity-50"
              >
                Request Simulated OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-marigold/15 border border-marigold/40 p-3 rounded text-xs text-ink-800">
                <p className="font-semibold">Simulated OTP Sent to +91 {phone}</p>
                <p className="text-ink-600 mt-0.5">Demo mode: Enter <strong>any 6 digits</strong> (e.g. 654321).</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full tracking-widest text-center bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-lg text-ink font-bold focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/3 py-2 rounded border border-ivory-400 text-xs text-ink"
                >
                  Edit Number
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-2/3 py-2 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors disabled:opacity-50"
                >
                  Verify & Sign In
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center text-[11px] text-ink-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulated OTP Verification • No SMS Cost</span>
          </div>
        </div>
      ) : (
        /* Logged In View */
        <div className="space-y-8">
          {/* Patron Profile Card */}
          <div className="bg-ivory rounded-xl border border-ivory-400 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ivory-300 rounded-full flex items-center justify-center text-terracotta font-serif text-lg font-bold">
                {customerUser.name?.charAt(0) || 'M'}
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">{customerUser.name}</h3>
                <p className="text-xs text-ink-500">+91 {customerUser.phone}</p>
                <span className="inline-block mt-0.5 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-medium">
                  Verified Patron
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/track-order"
                className="touch-tap-target text-xs px-3.5 py-2 rounded border border-ivory-400 hover:border-terracotta text-ink font-medium transition-colors"
              >
                Track Any Order
              </Link>
              <button
                type="button"
                onClick={customerLogout}
                className="touch-tap-target text-xs px-3.5 py-2 rounded bg-ivory-200 hover:bg-ivory-300 text-ink-700 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Customer Orders */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-ink font-medium">Your Order History</h3>

            {customerOrders.length === 0 ? (
              <div className="bg-ivory rounded-xl border border-ivory-400 p-8 text-center space-y-3">
                <Package className="w-10 h-10 text-ink-300 mx-auto" />
                <p className="font-serif text-base text-ink">No orders found for +91 {customerUser.phone}</p>
                <p className="text-xs text-ink-500">
                  Try placing a simulated order or browse other sample orders via Track Order.
                </p>
                <Link
                  to="/shop/all"
                  className="inline-block bg-terracotta text-white px-5 py-2 rounded text-xs uppercase font-semibold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-ivory rounded-lg border border-ivory-400 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ivory-300 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-ink">{ord.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-marigold/30 text-ink-900 border border-marigold/50">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-xs text-ink-400 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-ink-500 block">Total</span>
                          <span className="font-bold text-sm text-ink">
                            ₹{ord.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <Link
                          to={`/track-order?id=${ord.id}`}
                          className="touch-tap-target px-3.5 py-1.5 rounded bg-terracotta text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-terracotta-600 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-10 h-12 object-cover rounded aspect-[4/5] border border-ivory-300"
                            />
                            <div>
                              <p className="font-serif font-medium text-ink">{it.name}</p>
                              <p className="text-[11px] text-ink-500">
                                Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold text-ink">
                            ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
