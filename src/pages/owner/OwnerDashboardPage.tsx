import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertCircle,
  Boxes,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerDashboardPage: React.FC = () => {
  const { products, orders, ownerUser } = useStore();

  // Metrics computation
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const unitsSold = orders.reduce(
    (sum, o) =>
      sum + (o.status !== 'Cancelled' ? o.items.reduce((s, it) => s + it.quantity, 0) : 0),
    0
  );

  const totalProductsCount = products.length;

  // Products with total stock = 0
  const outOfStockProducts = products.filter((p) => {
    const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
    return totalStock === 0;
  });

  // Low-stock alerts: every size with stock <= 3 (including 0)
  const lowStockItems: {
    productId: string;
    productName: string;
    category: string;
    size: string;
    stock: number;
  }[] = [];

  products.forEach((p) => {
    Object.entries(p.stock).forEach(([size, stock]) => {
      if (stock <= 3) {
        lowStockItems.push({
          productId: p.id,
          productName: p.name,
          category: p.category,
          size,
          stock,
        });
      }
    });
  });

  // Latest 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top greeting bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-ivory-400">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Boutique Operations Overview
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
            Namaste, {ownerUser?.name || 'Store Manager'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/owner/orders"
            className="touch-tap-target text-xs px-3.5 py-2 rounded bg-terracotta text-white font-medium hover:bg-terracotta-600 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Process Orders ({orders.filter((o) => o.status === 'Placed').length} new)</span>
          </Link>
        </div>
      </div>

      {/* TODAY'S BIG METRIC NUMBERS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Orders */}
        <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-terracotta" />
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {totalOrdersCount}
            </span>
            <span className="block text-[11px] text-emerald-700 font-medium mt-0.5">
              Live customer sync
            </span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="block text-[11px] text-ink-500 mt-0.5">
              Simulated billing
            </span>
          </div>
        </div>

        {/* Metric 3: Units Sold */}
        <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Units Sold</span>
            <Package className="w-4 h-4 text-terracotta" />
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {unitsSold}
            </span>
            <span className="block text-[11px] text-ink-500 mt-0.5">
              Ensembles draped
            </span>
          </div>
        </div>

        {/* Metric 4: Total Products */}
        <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Catalog</span>
            <Boxes className="w-4 h-4 text-ink-600" />
          </div>
          <div className="mt-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              {totalProductsCount}
            </span>
            <span className="block text-[11px] text-ink-500 mt-0.5">
              Across 6 categories
            </span>
          </div>
        </div>

        {/* Metric 5: Out of Stock */}
        <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-ink-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span className={`font-serif text-2xl sm:text-3xl font-bold ${
              outOfStockProducts.length > 0 ? 'text-amber-700' : 'text-ink'
            }`}>
              {outOfStockProducts.length}
            </span>
            <span className="block text-[11px] text-ink-500 mt-0.5">
              Complete sellouts
            </span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: LOW STOCK ALERTS + RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Low Stock Alerts (7 cols) */}
        <div className="lg:col-span-7 bg-ivory rounded-xl border border-ivory-400 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-lg font-medium text-ink">
                Low-Stock Alerts ({lowStockItems.length})
              </h3>
            </div>
            <span className="text-xs text-ink-500 font-sans">
              Sizes with ≤ 3 units
            </span>
          </div>

          {lowStockItems.length === 0 ? (
            <p className="text-xs text-ink-500 py-6 text-center">
              All inventory levels are healthy! No low stock alerts.
            </p>
          ) : (
            <div className="divide-y divide-ivory-300 max-h-80 overflow-y-auto pr-1">
              {lowStockItems.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-terracotta uppercase tracking-wider block font-semibold">
                      {item.category}
                    </span>
                    <p className="font-serif font-medium text-ink text-sm truncate">
                      {item.productName}
                    </p>
                    <span className="text-ink-600">
                      Size: <strong>{item.size}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-xs ${
                        item.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.stock === 0 ? 'SOLD OUT' : `${item.stock} left`}
                    </span>
                    <Link
                      to={`/owner/products/${item.productId}/stock`}
                      className="touch-tap-target text-xs text-terracotta hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Adjust Stock</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders (5 cols) */}
        <div className="lg:col-span-5 bg-ivory rounded-xl border border-ivory-400 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <h3 className="font-serif text-lg font-medium text-ink">Recent Patron Orders</h3>
            <Link
              to="/owner/orders"
              className="text-xs font-semibold text-terracotta hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <Link
                key={ord.id}
                to="/owner/orders"
                className="block p-3 rounded-lg border border-ivory-400 bg-ivory-100 hover:bg-ivory-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-ink">{ord.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-marigold/30 text-ink-900 border border-marigold/50'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-ink-600">
                  <span className="truncate max-w-[160px] font-medium">
                    {ord.address.fullName}
                  </span>
                  <span className="font-bold text-ink">
                    ₹{ord.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-ink-400 flex items-center justify-between">
                  <span>{ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}</span>
                  <span>{ord.paymentMethod}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
