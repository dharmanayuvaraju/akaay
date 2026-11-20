import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const quickPicks = [
    'Banarasi Silk',
    'Chikankari Kurta',
    'Linen Co-ord',
    'Organza Saree',
    'Mirror Lehenga',
    'Smocked Tops',
  ];

  const searchClean = query.trim().toLowerCase();

  const filtered = searchClean
    ? products.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(searchClean);
        const matchesCat = p.category.toLowerCase().includes(searchClean);
        const matchesFabric = p.fabric.toLowerCase().includes(searchClean);
        const matchesColor = p.colors.some((c) => c.name.toLowerCase().includes(searchClean));
        return matchesName || matchesCat || matchesFabric || matchesColor;
      })
    : [];

  const handleSelectProduct = (id: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${id}`);
  };

  const handleQuickChip = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/70 flex flex-col justify-start pt-4 sm:pt-16 px-4">
      <div className="bg-ivory rounded-lg max-w-2xl w-full mx-auto shadow-2xl border border-ivory-400 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-ivory-400 flex items-center gap-3">
          <Search className="w-5 h-5 text-terracotta shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, chikankari, linen sets, lehengas..."
            className="w-full bg-transparent text-ink placeholder-ink-400 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-ink-500 hover:text-ink"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-ink-600 hover:text-terracotta ml-1"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-4 border-b border-ivory-300">
            <span className="text-xs uppercase tracking-wider text-ink-500 font-semibold block mb-2">
              Popular Boutique Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  type="button"
                  onClick={() => handleQuickChip(pick)}
                  className="text-xs bg-ivory-300 hover:bg-terracotta/10 hover:text-terracotta text-ink px-3 py-1.5 rounded-full border border-ivory-400 transition-colors"
                >
                  {pick}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-ivory-300">
          {query && filtered.length === 0 && (
            <div className="text-center py-12 text-ink-500">
              <p className="font-serif text-lg text-ink">No ensembles found for "{query}"</p>
              <p className="text-xs mt-1 text-ink-400">
                Try searching for 'Silk', 'Organza', 'Midi', 'Cotton', or browse all categories.
              </p>
            </div>
          )}

          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectProduct(item.id)}
              className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-ivory-200 px-2 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-12 h-15 object-cover rounded border border-ivory-400 shrink-0 aspect-[4/5]"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-terracotta font-semibold block">
                    {item.category}
                  </span>
                  <p className="font-serif text-sm font-medium text-ink leading-tight">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-500 line-clamp-1">{item.fabric}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-bold text-ink">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-ink-400 line-through block">
                  ₹{item.mrp.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}

          {!query && (
            <div className="py-6 text-center text-xs text-ink-500">
              <span>Start typing to explore all 24 handcrafted designer silhouettes.</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-ivory-300 border-t border-ivory-400 flex items-center justify-between text-xs text-ink-600">
          <span>{products.length} artisanal products in catalog</span>
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(false);
              navigate('/shop/all');
            }}
            className="text-terracotta font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
