import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, Clock, Truck, Package, Home, XCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { getOrderWhatsAppUrl } from '../../utils/whatsapp';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'Placed', label: 'Order Placed', icon: Package },
  { status: 'Packed', label: 'Artisan Inspection & Packed', icon: CheckCircle2 },
  { status: 'Shipped', label: 'In Transit with Express Courier', icon: Truck },
  { status: 'Out for delivery', label: 'Out for Delivery', icon: Clock },
  { status: 'Delivered', label: 'Delivered to Doorstep', icon: Home },
];

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [orderQuery, setOrderQuery] = useState(initialId);
  const { orders, customerUser, getOrder } = useStore();

  const [activeOrder, setActiveOrder] = useState(() => {
    if (initialId) {
      return getOrder(initialId);
    }
    // If customer logged in, default to their latest order
    if (customerUser) {
      const userOrders = orders.filter((o) => o.customerPhone === customerUser.phone);
      return userOrders[0] || orders[0];
    }
    return orders[0];
  });

  useEffect(() => {
    if (initialId) {
      const found = getOrder(initialId);
      if (found) {
        setActiveOrder(found);
        setOrderQuery(found.id);
      }
    }
  }, [initialId, orders]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    const found = getOrder(orderQuery.trim());
    if (found) {
      setActiveOrder(found);
      setSearchParams({ id: found.id });
    } else {
      setActiveOrder(undefined);
    }
  };

  const currentStatusIndex = activeOrder
    ? STATUS_STEPS.findIndex((s) => s.status === activeOrder.status)
    : -1;

  const isCancelled = activeOrder?.status === 'Cancelled';

  // Customer's other orders for quick-pick
  const userOrders = customerUser
    ? orders.filter((o) => o.customerPhone === customerUser.phone)
    : orders.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-ink-500 mb-2">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <span className="text-ink font-medium">Track Order</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">Track Boutique Order</h1>
        <p className="text-xs sm:text-sm text-ink-600 mt-1">
          Follow your handcrafted garment's journey from our Hyderabad atelier to your hands.
        </p>
      </div>

      {/* Order Search Box */}
      <div className="bg-ivory rounded-lg border border-ivory-400 p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchOrder} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. MHR-2415, MHR-2417)"
              className="w-full bg-ivory-100 border border-ivory-400 rounded pl-9 pr-3 py-2.5 text-xs sm:text-sm text-ink font-medium focus:outline-none focus:border-terracotta uppercase"
            />
          </div>
          <button
            type="submit"
            className="touch-tap-target px-5 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors"
          >
            Track
          </button>
        </form>

        {/* Quick Pick Chips */}
        {userOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ivory-300">
            <span className="text-xs text-ink-500">Recent demo orders:</span>
            {userOrders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => {
                  setActiveOrder(ord);
                  setOrderQuery(ord.id);
                  setSearchParams({ id: ord.id });
                }}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  activeOrder?.id === ord.id
                    ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                    : 'border-ivory-400 bg-ivory text-ink hover:border-ink-500'
                }`}
              >
                {ord.id} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Order Not Found State */}
      {!activeOrder && (
        <div className="bg-ivory rounded-lg border border-ivory-400 p-10 text-center space-y-3">
          <p className="font-serif text-lg text-ink">No order found with ID "{orderQuery}"</p>
          <p className="text-xs text-ink-500">
            Please check the spelling or select one of the recent demo orders above.
          </p>
        </div>
      )}

      {/* Active Order Tracking Display */}
      {activeOrder && (
        <div className="bg-ivory rounded-xl border border-ivory-400 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ivory-400">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl text-ink font-bold">
                  Order #{activeOrder.id}
                </h3>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    isCancelled
                      ? 'bg-red-100 text-red-800'
                      : activeOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-marigold/30 text-ink-900 border border-marigold/50'
                  }`}
                >
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-ink-500 mt-1">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })} • {activeOrder.items.length} Ensembles
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold block">
                Estimated Delivery
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-800">
                {activeOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 p-5 rounded-lg flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div className="text-xs text-red-800">
                <strong className="font-semibold text-sm">Order Cancelled</strong>
                <p className="mt-0.5">
                  This order was marked as cancelled. Any reserved inventory has been returned to stock.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {/* Stepper container */}
              <div className="relative">
                {/* Horizontal progress bar for desktop */}
                <div className="hidden md:block absolute top-6 left-6 right-6 h-1 bg-ivory-400 -z-0">
                  <div
                    className="h-full bg-terracotta transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, currentStatusIndex) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = currentStatusIndex >= idx;
                    const isCurrent = currentStatusIndex === idx;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 relative z-10"
                      >
                        {/* Circle marker */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                            isCompleted
                              ? 'bg-terracotta border-terracotta text-white'
                              : 'bg-ivory border-ivory-400 text-ink-400'
                          } ${isCurrent ? 'ring-4 ring-terracotta/20 scale-105' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Step details */}
                        <div className="flex-1 md:flex-none">
                          <p
                            className={`text-xs sm:text-sm font-serif font-medium ${
                              isCompleted ? 'text-ink font-semibold' : 'text-ink-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-0.5 text-[10px] bg-terracotta/10 text-terracotta font-bold px-1.5 py-0.2 rounded">
                              Current Stage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Activity Log / Status History */}
          <div className="bg-ivory-200 rounded-lg p-5 border border-ivory-300 space-y-3">
            <h4 className="font-serif text-sm font-medium text-ink">Boutique Log & Updates</h4>
            <div className="space-y-2 text-xs">
              {activeOrder.statusHistory.map((hist, i) => (
                <div key={i} className="flex items-start gap-2 text-ink-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-ink">{hist.status}</span>
                    <span className="text-ink-400 ml-2">
                      ({new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(hist.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                    </span>
                    {hist.note && <p className="text-ink-600 mt-0.5">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Order Ensembles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ivory-400 text-xs">
            {/* Address */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                Destination Address
              </span>
              <p className="font-serif text-sm font-medium text-ink">
                {activeOrder.address.fullName}
              </p>
              <p className="text-ink-600">{activeOrder.address.streetAddress}</p>
              <p className="text-ink-600">
                {activeOrder.address.city}, {activeOrder.address.state} - {activeOrder.address.pincode}
              </p>
              <p className="text-ink-600">Phone: +91 {activeOrder.address.phone}</p>
            </div>

            {/* Ensembles list */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-ink-500 font-bold block">
                Ensembles in Shipment
              </span>
              {activeOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-ivory-300 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-9 h-11 object-cover rounded aspect-[4/5] border border-ivory-300"
                    />
                    <div>
                      <span className="font-medium text-ink">{it.name}</span>
                      <span className="text-[10px] text-ink-500 block">
                        Size: {it.size} • Color: {it.color} • Qty: {it.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-ink">
                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="pt-2">
            <a
              href={getOrderWhatsAppUrl(activeOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-tap-target w-full py-2.5 px-4 rounded bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire About Order #{activeOrder.id} on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
