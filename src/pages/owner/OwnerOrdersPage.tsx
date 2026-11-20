import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  CheckCircle2,
  Package,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { getOwnerCustomerWhatsAppUrl } from '../../utils/whatsapp';

const NEXT_STATUS_MAP: Record<OrderStatus, OrderStatus | null> = {
  Placed: 'Packed',
  Packed: 'Shipped',
  Shipped: 'Out for delivery',
  'Out for delivery': 'Delivered',
  Delivered: null,
  Cancelled: null,
};

export const OwnerOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.status === statusFilter;
  });

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    const next = NEXT_STATUS_MAP[currentStatus];
    if (next) {
      updateOrderStatus(orderId, next);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}? This will restore garment stock.`)) {
      updateOrderStatus(orderId, 'Cancelled', 'Cancelled by boutique back office manager');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ivory-400">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Order Fulfillment
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Advance order status stage-by-stage. Updates reflect live on the patron's tracking screen.
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          'All',
          'Placed',
          'Packed',
          'Shipped',
          'Out for delivery',
          'Delivered',
          'Cancelled',
        ].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`touch-tap-target text-xs px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap font-medium ${
              statusFilter === st
                ? 'bg-ink text-ivory border-ink'
                : 'bg-ivory border-ivory-400 text-ink hover:border-terracotta'
            }`}
          >
            <span>{st}</span>
            <span className="ml-1.5 opacity-60">
              ({st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-ivory rounded-xl border border-ivory-400 p-12 text-center space-y-3">
          <p className="font-serif text-lg text-ink">No orders matching filter "{statusFilter}"</p>
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className="text-xs text-terracotta font-semibold hover:underline"
          >
            Show All Orders
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const nextStatus = NEXT_STATUS_MAP[order.status];
            const isFinished = order.status === 'Delivered' || order.status === 'Cancelled';
            const whatsappUrl = getOwnerCustomerWhatsAppUrl(order);

            return (
              <div
                key={order.id}
                className="bg-ivory rounded-xl border border-ivory-400 p-5 sm:p-6 shadow-sm space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-ivory-300">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-bold text-ink">{order.id}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-marigold/30 text-ink-900 border border-marigold/50'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-ink-400 hidden sm:inline">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-ink">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-ink-500 bg-ivory-200 px-2 py-0.5 rounded font-medium">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items and Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Items (7 cols) */}
                  <div className="md:col-span-7 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 block">
                      Ordered Ensembles:
                    </span>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-10 h-12 object-cover rounded aspect-[4/5] border border-ivory-300 shrink-0"
                            />
                            <div>
                              <span className="font-serif font-medium text-ink block">{it.name}</span>
                              <span className="text-[11px] text-ink-500">
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

                  {/* Customer Address (5 cols) */}
                  <div className="md:col-span-5 space-y-1.5 md:border-l md:border-ivory-300 md:pl-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-500 block">
                      Delivery Destination:
                    </span>
                    <p className="font-serif font-medium text-ink text-sm">
                      {order.address.fullName}
                    </p>
                    <p className="text-ink-600 leading-snug">{order.address.streetAddress}</p>
                    <p className="text-ink-600">
                      {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                    <p className="text-ink-600">
                      Mobile: <strong>+91 {order.address.phone}</strong>
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Advance Status + WhatsApp */}
                <div className="pt-3 border-t border-ivory-300 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Advance Step CTA */}
                    {nextStatus && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(order.id, order.status)}
                        className="touch-tap-target px-4 py-2 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center gap-1.5 shadow"
                      >
                        <span>Mark as {nextStatus}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Cancel CTA */}
                    {!isFinished && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        className="touch-tap-target px-3 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50 text-xs font-medium transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* WhatsApp Customer Update CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-tap-target px-3.5 py-2 rounded bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#20ba59] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Patron ({order.address.phone})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
