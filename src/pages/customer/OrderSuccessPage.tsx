import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getOrderWhatsAppUrl } from '../../utils/whatsapp';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'MHR-2417';
  const { getOrder } = useStore();

  const order = getOrder(orderId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-ivory rounded-xl border border-ivory-400 p-6 sm:p-10 shadow-sm text-center space-y-6">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Order Confirmed (Demo)
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-2">
            Your simulated order has been registered in the boutique catalog and synced with the Owner Back Office.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-ivory-200 border border-ivory-300 rounded-lg p-5 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-ink-500 uppercase tracking-wider text-[10px] block font-semibold">
              Order Identifier
            </span>
            <span className="font-serif text-lg font-bold text-ink mt-0.5 block">
              {order?.id || orderId}
            </span>
          </div>
          <div>
            <span className="text-ink-500 uppercase tracking-wider text-[10px] block font-semibold">
              Estimated Delivery
            </span>
            <span className="text-sm font-semibold text-emerald-800 mt-0.5 block">
              {order?.estimatedDelivery || 'In 3-5 Business Days'}
            </span>
          </div>
          <div>
            <span className="text-ink-500 uppercase tracking-wider text-[10px] block font-semibold">
              Payment Method
            </span>
            <span className="text-sm font-semibold text-ink mt-0.5 block">
              {order?.paymentMethod || 'UPI (Simulated)'}
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        {order && (
          <div className="border-t border-ivory-300 pt-5 text-left space-y-3">
            <h4 className="font-serif text-sm font-medium text-ink">Ensembles in this Order:</h4>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-10 h-12 object-cover rounded aspect-[4/5] border border-ivory-300"
                    />
                    <div>
                      <span className="font-serif font-medium text-ink">{it.name}</span>
                      <span className="text-[11px] text-ink-500 block">
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

            <div className="pt-3 border-t border-ivory-200 flex justify-between text-sm font-bold text-ink">
              <span>Total Value:</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* WhatsApp Notification CTA */}
        {order && (
          <div className="pt-2">
            <a
              href={getOrderWhatsAppUrl(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-tap-target w-full py-3 px-4 rounded bg-[#25D366] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Share Order on WhatsApp with Boutique</span>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/track-order?id=${order?.id || orderId}`}
            className="touch-tap-target w-full sm:w-auto px-6 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>

          <Link
            to="/account"
            className="touch-tap-target w-full sm:w-auto px-5 py-2.5 rounded border border-ivory-400 bg-ivory text-ink hover:border-terracotta text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <User className="w-4 h-4" />
            <span>View in Account</span>
          </Link>

          <Link
            to="/"
            className="touch-tap-target w-full sm:w-auto px-5 py-2.5 text-xs text-ink-600 hover:text-terracotta transition-colors flex items-center justify-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
