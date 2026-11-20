import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Boxes,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  ArrowRight,
  Eye,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerStockPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, getProduct, updateStock, ownerUser } = useStore();

  const isOwner = ownerUser?.role === 'owner';

  // Fallback to first product if invalid ID
  const activeProduct = getProduct(id || '') || products[0];


  if (!activeProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="font-serif text-xl text-ink">No products found</p>
        <Link to="/owner/products" className="text-terracotta underline text-xs">
          Return to Inventory
        </Link>
      </div>
    );
  }

  const totalStock = Object.values(activeProduct.stock).reduce((a, b) => a + b, 0);

  const handleAdjustStock = (size: string, delta: number) => {
    if (!isOwner) return;
    const current = activeProduct.stock[size] ?? 0;
    const updated = Math.max(0, current + delta);
    updateStock(activeProduct.id, size, updated);
  };

  const handleDirectInput = (size: string, val: string) => {
    if (!isOwner) return;
    const num = parseInt(val, 10);
    const updated = isNaN(num) ? 0 : Math.max(0, num);
    updateStock(activeProduct.id, size, updated);
  };

  const handleSwitchProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/owner/products/${e.target.value}/stock`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-ink-500 mb-2">
          <Link to="/owner" className="hover:text-terracotta">Dashboard</Link>
          <span>/</span>
          <Link to="/owner/products" className="hover:text-terracotta">Inventory</Link>
          <span>/</span>
          <span className="text-ink font-medium">Stock Levels</span>
        </nav>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ivory-400">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              Per-Size Stock Management
            </h1>
            <p className="text-xs text-ink-500 mt-1">
              Adjust available inventory units in real-time. Zero stock prevents customer cart addition.
            </p>
          </div>

          {!isOwner && (
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded border border-amber-200">
              <Lock className="w-3.5 h-3.5" />
              <span>Read-only: Staff cannot modify stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Quick-Switch Dropdown */}
      <div className="bg-ivory rounded-lg border border-ivory-400 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <label className="text-xs font-semibold text-ink whitespace-nowrap">
          Select Ensemble to Manage:
        </label>
        <select
          value={activeProduct.id}
          onChange={handleSwitchProduct}
          className="w-full sm:w-auto flex-1 bg-ivory-100 border border-ivory-400 text-ink text-xs sm:text-sm rounded px-3 py-2 font-medium focus:outline-none focus:border-terracotta"
        >
          {products.map((p) => {
            const sum = Object.values(p.stock).reduce((a, b) => a + b, 0);
            return (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category}) — {sum === 0 ? 'SOLD OUT' : `${sum} in stock`}
              </option>
            );
          })}
        </select>
      </div>

      {/* Active Product Card Overview */}
      <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ivory-300">
          <div className="flex items-center gap-4">
            <img
              src={activeProduct.images[0]}
              alt={activeProduct.name}
              className="w-16 h-20 object-cover rounded aspect-[4/5] border border-ivory-300 shrink-0"
            />
            <div>
              <span className="text-[10px] text-terracotta uppercase tracking-wider font-semibold block">
                {activeProduct.category}
              </span>
              <h2 className="font-serif text-xl font-medium text-ink">
                {activeProduct.name}
              </h2>
              <span className="text-xs text-ink-500 block mt-0.5">
                ₹{activeProduct.price.toLocaleString('en-IN')} (MRP ₹{activeProduct.mrp.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-ink-500 uppercase tracking-wider block">
              Cumulative Inventory
            </span>
            <span
              className={`font-serif text-2xl font-bold ${
                totalStock === 0
                  ? 'text-red-700'
                  : totalStock <= 5
                  ? 'text-amber-700'
                  : 'text-emerald-700'
              }`}
            >
              {totalStock} Units
            </span>
          </div>
        </div>

        {/* Per-Size Steppers */}
        <div className="space-y-4">
          <h3 className="font-serif text-base text-ink font-medium">
            Available Sizes & Quantity Steppers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeProduct.sizes.map((sz) => {
              const currentStock = activeProduct.stock[sz] ?? 0;
              const isOut = currentStock === 0;

              return (
                <div
                  key={sz}
                  className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                    isOut
                      ? 'border-red-300 bg-red-50/50'
                      : currentStock <= 3
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-ivory-400 bg-ivory-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-ink">
                        Size {sz}
                      </span>
                      {isOut ? (
                        <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Out of Stock
                        </span>
                      ) : currentStock <= 3 ? (
                        <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          Low Stock ({currentStock})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          In Stock
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-ink-500 block mt-0.5">
                      Customer display: {isOut ? 'Disabled & struck-through' : `${currentStock} units available`}
                    </span>
                  </div>

                  {/* Stepper + Input */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!isOwner || currentStock <= 0}
                      onClick={() => handleAdjustStock(sz, -1)}
                      className="touch-tap-target w-8 h-8 rounded border border-ivory-400 bg-white hover:bg-ivory-200 text-ink flex items-center justify-center transition-colors disabled:opacity-40"
                      aria-label={`Decrease ${sz}`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="number"
                      min={0}
                      disabled={!isOwner}
                      value={currentStock}
                      onChange={(e) => handleDirectInput(sz, e.target.value)}
                      className="w-14 text-center font-bold text-sm bg-white border border-ivory-400 rounded py-1 text-ink focus:outline-none focus:border-terracotta disabled:opacity-60"
                    />

                    <button
                      type="button"
                      disabled={!isOwner}
                      onClick={() => handleAdjustStock(sz, 1)}
                      className="touch-tap-target w-8 h-8 rounded border border-ivory-400 bg-white hover:bg-ivory-200 text-ink flex items-center justify-center transition-colors disabled:opacity-40"
                      aria-label={`Increase ${sz}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Customer Preview Note */}
        <div className="p-4 bg-ivory-200 rounded-lg border border-ivory-300 flex items-center justify-between text-xs text-ink-700">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-terracotta" />
            <span>Check how this ensemble looks right now on the storefront:</span>
          </div>
          <Link
            to={`/product/${activeProduct.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Preview Product Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
