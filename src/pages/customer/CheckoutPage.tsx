import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
  Check,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress } from '../../types';
import { getCartWhatsAppUrl } from '../../utils/whatsapp';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    customerUser,
    customerLogin,
    placeOrder,
  } = useStore();

  const navigate = useNavigate();

  // Step 1: Login state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState('');

  // Step 2: Address state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: customerUser?.name || 'Aarohi Sen',
    phone: customerUser?.phone || '7337422054',
    pincode: '500034',
    city: 'Hyderabad',
    state: 'Telangana',
    streetAddress: 'Flat 402, Banjara Hills Road No. 12',
  });

  // Step 3: Payment state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute bill
  let totalMrp = 0;
  let subtotal = 0;

  const orderItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const price = product?.price || 0;
    const mrp = product?.mrp || price;

    totalMrp += mrp * item.quantity;
    subtotal += price * item.quantity;

    return {
      productId: item.productId,
      name: product?.name || 'Handcrafted Piece',
      image: product?.images[0] || '',
      price,
      mrp,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    };
  });

  const discount = Math.max(0, totalMrp - subtotal);
  const shipping = subtotal > 0 ? (subtotal >= 1499 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length !== 10) return;
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length === 6) {
      customerLogin(phoneInput, customerNameInput || 'Valued Patron');
      setAddress((prev) => ({
        ...prev,
        phone: phoneInput,
        fullName: customerNameInput || prev.fullName,
      }));
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = placeOrder({
        items: orderItems,
        subtotal,
        discount,
        shipping,
        total,
        address,
        paymentMethod,
        customerPhone: customerUser?.phone || address.phone,
        status: 'Placed',
      });

      setIsProcessing(false);
      navigate(`/order-success?orderId=${newOrder.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl text-ink">Your bag is empty</h2>
        <p className="text-xs text-ink-500">
          Add artisanal sarees, suits, or linen separates to proceed with checkout.
        </p>
        <Link
          to="/shop/all"
          className="inline-block bg-terracotta text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const whatsappUrl = getCartWhatsAppUrl(cart, products, total);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 pb-4 border-b border-ivory-400">
        <h1 className="font-serif text-3xl text-ink font-normal">Boutique Checkout</h1>
        <p className="text-xs text-ink-500 mt-1">
          Simulated demo checkout • All orders will appear in your account and the Owner back office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Flow (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: LOGIN REQUIREMENT */}
          {!customerUser ? (
            <div className="bg-ivory rounded-lg border border-ivory-400 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-ivory-300 pb-3">
                <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif text-lg text-ink font-medium">Customer Mobile Login</h3>
              </div>

              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-ink-600">
                    Enter your 10-digit mobile phone to receive simulated OTP and track your orders.
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={customerNameInput}
                      onChange={(e) => setCustomerNameInput(e.target.value)}
                      placeholder="e.g. Priyamvada Rao"
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
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="7337422054"
                        className="w-full bg-ivory-100 border border-ivory-400 rounded-r px-3 py-2 text-sm text-ink focus:outline-none focus:border-terracotta font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={phoneInput.length !== 10}
                    className="w-full py-2.5 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors disabled:opacity-50"
                  >
                    Send Simulated OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="bg-marigold/15 border border-marigold/40 p-3 rounded text-xs text-ink-800">
                    <p className="font-semibold">Simulated OTP Sent to +91 {phoneInput}</p>
                    <p className="text-ink-600 mt-0.5">Demo hint: Enter <strong>any 6 digits</strong> (e.g. 123456) to proceed.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink">6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="1 2 3 4 5 6"
                      className="w-full tracking-widest text-center bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-lg text-ink font-bold focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="w-1/3 py-2 rounded border border-ivory-400 text-xs text-ink"
                    >
                      Change Number
                    </button>
                    <button
                      type="submit"
                      disabled={otpInput.length !== 6}
                      className="w-2/3 py-2 px-4 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors disabled:opacity-50"
                    >
                      Verify & Continue
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-ivory rounded-lg border border-ivory-400 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <h4 className="font-serif text-sm font-medium text-ink">Signed in as {customerUser.name}</h4>
                  <p className="text-xs text-ink-500">+91 {customerUser.phone}</p>
                </div>
              </div>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Verified Customer
              </span>
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          <div className="bg-ivory rounded-lg border border-ivory-400 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-ivory-300 pb-3">
              <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif text-lg text-ink font-medium">Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Full Name</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-medium text-ink">Street Address & Landmark</label>
                <input
                  type="text"
                  required
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-ivory rounded-lg border border-ivory-400 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-ivory-300 pb-3">
              <span className="w-6 h-6 rounded-full bg-terracotta text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-serif text-lg text-ink font-medium">Payment Option</h3>
            </div>

            {/* DEMO AMBER BANNER */}
            <div className="bg-marigold/20 border-2 border-marigold/60 p-3.5 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <div className="text-xs text-ink-900">
                <strong className="font-bold uppercase tracking-wider text-amber-800">
                  DEMO - No Real Payment is Processed
                </strong>
                <p className="text-ink-700 mt-0.5">
                  Select any method and click "Complete Demo Order". No bank account or card is charged.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* UPI Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-ivory-400 bg-ivory hover:bg-ivory-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 accent-terracotta"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-terracotta" />
                      UPI (Instant simulated approval)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Fastest
                    </span>
                  </div>
                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 flex gap-2">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`text-xs px-2.5 py-1 rounded border ${
                            selectedUpiApp === app
                              ? 'border-terracotta bg-terracotta text-white font-medium'
                              : 'border-ivory-400 bg-ivory text-ink'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'Card'
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-ivory-400 bg-ivory hover:bg-ivory-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="mt-1 accent-terracotta"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-terracotta" />
                    Credit / Debit Card (Simulated Visa, Mastercard, RuPay)
                  </span>
                  {paymentMethod === 'Card' && (
                    <p className="text-xs text-ink-500 mt-1">
                      Mock 3D-Secure approval will occur automatically.
                    </p>
                  )}
                </div>
              </label>

              {/* COD Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-ivory-400 bg-ivory hover:bg-ivory-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-terracotta"
                />
                <div className="flex-1">
                  <span className="text-sm font-semibold text-ink flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-terracotta" />
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-ink-500 mt-1">
                    Pay in cash or UPI scan at your doorstep on delivery.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* WhatsApp Direct Order Alternative */}
          <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-ink">Prefer personal assistance on WhatsApp?</p>
                <p className="text-ink-600">Our Hyderabad stylist can take your address and place this order directly.</p>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-tap-target shrink-0 bg-[#25D366] text-white text-xs font-semibold px-4 py-2 rounded hover:bg-[#20ba59] transition-colors"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>

        {/* Right Sidebar: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ivory rounded-lg border border-ivory-400 p-6 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-serif text-lg font-medium text-ink pb-3 border-b border-ivory-400">
              Order Ensembles ({cart.length})
            </h3>

            {/* Items list */}
            <div className="divide-y divide-ivory-300 max-h-64 overflow-y-auto pr-1 space-y-2">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-2 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-18 object-cover rounded border border-ivory-400 aspect-[4/5] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-medium text-ink truncate">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-ink-500">
                      Size: {item.size} • Color: {item.color}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill computation */}
            <div className="pt-3 border-t border-ivory-400 space-y-2 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Boutique Savings</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE</strong>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-ivory-300 flex justify-between text-base font-bold text-ink">
                <span>Final Payable</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="button"
              disabled={isProcessing || !customerUser}
              onClick={handlePlaceOrder}
              className="w-full touch-tap-target py-3.5 px-4 rounded bg-terracotta text-white text-sm font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-all flex items-center justify-center gap-2 shadow disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Complete Demo Order (₹{total.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>

            {!customerUser && (
              <p className="text-[11px] text-terracotta text-center font-medium">
                * Please sign in with your phone in Step 1 to complete order
              </p>
            )}

            <div className="pt-2 text-center text-[11px] text-ink-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated SSL Encrypted Demo Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
