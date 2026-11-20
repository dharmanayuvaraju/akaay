import React, { useState } from 'react';
import { Percent, Sparkles, MessageCircle, Save, Check, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerOffersPage: React.FC = () => {
  const { settings, updateSettings, products, ownerUser } = useStore();

  const isOwner = ownerUser?.role === 'owner';

  const [announcement, setAnnouncement] = useState(settings.announcementText);
  const [heroOffer, setHeroOffer] = useState(settings.heroOfferText);
  const [overrides, setOverrides] = useState<Record<string, number>>(
    settings.productDiscountOverrides || {}
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    updateSettings({
      announcementText: announcement,
      heroOfferText: heroOffer,
      productDiscountOverrides: overrides,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleOverrideChange = (productId: string, val: string) => {
    if (!isOwner) return;
    const num = parseInt(val, 10);
    const updated = { ...overrides };
    if (isNaN(num) || num < 0) {
      delete updated[productId];
    } else {
      updated[productId] = Math.min(90, num);
    }
    setOverrides(updated);
  };

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-ink">Owner Access Only</h2>
        <p className="text-xs text-ink-500 max-w-sm mx-auto">
          Staff accounts cannot edit site-wide promotional announcements or discount overrides.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-ivory-400">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Promotional Controls
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
          Offers & Announcement Banners
        </h1>
        <p className="text-xs text-ink-500 mt-1">
          Changes update immediately on the customer-facing top announcement bar, hero banners, and listing pages.
        </p>
      </div>

      <form onSubmit={handleSaveGeneral} className="space-y-8">
        {/* Site-wide Banner Settings */}
        <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-medium text-ink pb-3 border-b border-ivory-300">
            Global Announcement & Hero Offer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Top Announcement Bar Text (Site-wide)
              </label>
              <input
                type="text"
                required
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. For bulk & boutique orders, message us on WhatsApp"
                className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
              />
              <span className="text-[11px] text-ink-500 block">
                Shown at the very top of all customer pages.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">
                Hero Banner Discount Highlight
              </label>
              <input
                type="text"
                required
                value={heroOffer}
                onChange={(e) => setHeroOffer(e.target.value)}
                placeholder="e.g. up to 50% off"
                className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
              />
              <span className="text-[11px] text-ink-500 block">
                Pill badge highlighted on homepage hero banners.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="touch-tap-target px-5 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center gap-2 shadow"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Changes Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Banners</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Per-Product Discount Overrides */}
        <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
            <div>
              <h3 className="font-serif text-lg font-medium text-ink">
                Per-Ensemble Discount Overrides
              </h3>
              <p className="text-xs text-ink-500">
                Override the mathematically computed discount badge % with a custom promotional badge. Leave empty to use auto-calculated discount.
              </p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-ivory-300 pr-1">
            {products.map((p) => {
              const defaultDiscount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
              const currentOverride = overrides[p.id];

              return (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-12 object-cover rounded aspect-[4/5] border border-ivory-300 shrink-0"
                    />
                    <div>
                      <span className="font-serif font-medium text-ink">{p.name}</span>
                      <span className="text-xs text-ink-500 block">
                        ₹{p.price.toLocaleString('en-IN')} (MRP ₹{p.mrp.toLocaleString('en-IN')}) • Auto: {defaultDiscount}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-600">Badge %:</span>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      placeholder={String(defaultDiscount)}
                      value={currentOverride !== undefined ? currentOverride : ''}
                      onChange={(e) => handleOverrideChange(p.id, e.target.value)}
                      className="w-16 bg-ivory-100 border border-ivory-400 rounded px-2 py-1 text-ink text-center font-bold focus:outline-none focus:border-terracotta"
                    />
                    <span className="text-xs font-semibold text-terracotta">% OFF</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-ivory-300">
            <button
              type="submit"
              className="touch-tap-target px-5 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Apply Discount Overrides</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
