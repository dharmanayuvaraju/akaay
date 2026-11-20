import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Ruler,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ZoomIn,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { SizeChartModal } from '../../components/common/SizeChartModal';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    getProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    setIsCartOpen,
    settings,
  } = useStore();

  const product = getProduct(id || '');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState<{
    desc: boolean;
    delivery: boolean;
    faqs: boolean;
  }>({
    desc: true,
    delivery: false,
    faqs: false,
  });

  // Reset defaults when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColor(product.colors[0]?.name || '');

      // Pick first available size with stock
      const firstAvailableSize =
        product.sizes.find((s) => (product.stock[s] ?? 0) > 0) || product.sizes[0] || '';
      setSelectedSize(firstAvailableSize);
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-ink">Ensemble Not Found</h2>
        <p className="text-xs text-ink-500">
          The requested boutique piece may have been updated or moved.
        </p>
        <Link
          to="/shop/all"
          className="inline-block bg-terracotta text-white px-5 py-2.5 rounded text-xs uppercase font-medium"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);

  // Discount calculation
  const discountOverride = settings.productDiscountOverrides[product.id];
  const discountPercent =
    discountOverride !== undefined
      ? discountOverride
      : Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Current stock for chosen size
  const stockForSelectedSize = selectedSize ? product.stock[selectedSize] ?? 0 : 0;
  const isSelectedSizeOutOfStock = stockForSelectedSize <= 0;
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isEntirelyOutOfStock = totalStock <= 0;

  // Similar products from same category
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product.id, selectedSize, selectedColor, 1);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    const added = addToCart(product.id, selectedSize, selectedColor, 1);
    if (added) {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };

  const whatsappStylistText = `Hi Akaay Boutique! I need personalized advice for "${product.name}" (ID: ${product.id}). Can you share sizing recommendations?`;
  const whatsappStylistUrl = `https://wa.me/917337422054?text=${encodeURIComponent(whatsappStylistText)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-ink-500">
        <Link to="/" className="hover:text-terracotta">Home</Link>
        <span>/</span>
        <Link to={`/shop/${product.category.toLowerCase().replace(' ', '-')}`} className="hover:text-terracotta">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Section (lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 rounded overflow-hidden border-2 transition-all shrink-0 ${
                  idx === selectedImageIndex
                    ? 'border-terracotta shadow'
                    : 'border-ivory-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} angle ${idx + 1}`}
                  className="w-full h-full object-cover aspect-[4/5]"
                />
              </button>
            ))}
          </div>

          {/* Main Photo with Zoom */}
          <div className="flex-1 relative bg-ivory-300 rounded-lg overflow-hidden border border-ivory-400 aspect-[4/5]">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              onClick={() => setIsZoomed(!isZoomed)}
              className={`w-full h-full object-cover object-top transition-transform duration-300 cursor-zoom-in ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
              }`}
            />

            {/* Zoom hint badge */}
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-3 right-3 bg-white/80 hover:bg-white text-ink text-xs px-2.5 py-1 rounded shadow-sm flex items-center gap-1 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomed ? 'Reset' : 'Zoom'}</span>
            </button>

            {/* Out of stock overlay */}
            {isEntirelyOutOfStock && (
              <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center">
                <span className="bg-ink-800 text-ivory text-sm font-bold uppercase tracking-wider px-4 py-2 rounded border border-ivory-400">
                  Currently Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Actions (lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
                {product.category}
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="touch-tap-target text-ink-600 hover:text-terracotta transition-colors flex items-center gap-1.5 text-xs"
              >
                <Heart
                  className={`w-4 h-4 ${isFavorited ? 'fill-terracotta stroke-terracotta' : ''}`}
                />
                <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-marigold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-marigold stroke-marigold'
                        : 'fill-transparent stroke-marigold/60'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-ink">{product.rating}</span>
              <span className="text-xs text-ink-400">({product.reviewCount} boutique reviews)</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-ivory-200 rounded-lg border border-ivory-300">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-ink">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm sm:text-base text-ink-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-marigold text-ink-900 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-ink-500 mt-1">
              Inclusive of all taxes • Free express shipping above ₹1,499
            </p>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                Color: <span className="font-normal text-ink-600">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`touch-tap-target p-1 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedColor === c.name
                      ? 'border-terracotta scale-105'
                      : 'border-transparent hover:border-ivory-400'
                  }`}
                  title={c.name}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink">
                Select Size: <span className="text-terracotta">*</span>
              </span>
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="text-terracotta font-semibold hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => {
                const stock = product.stock[sz] ?? 0;
                const isOutOfStock = stock <= 0;
                const isSelected = selectedSize === sz;

                return (
                  <button
                    key={sz}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(sz)}
                    className={`touch-tap-target min-w-12 px-3 py-2 text-xs font-semibold rounded border transition-all relative ${
                      isOutOfStock
                        ? 'border-ivory-400 text-ink-300 bg-ivory-300 line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-terracotta text-white border-terracotta shadow-sm'
                        : 'border-ivory-400 bg-ivory text-ink hover:border-terracotta'
                    }`}
                  >
                    <span>{sz}</span>
                    {stock > 0 && stock <= 3 && !isOutOfStock && (
                      <span className="absolute -top-1.5 -right-1.5 bg-marigold text-ink-900 text-[8px] font-bold px-1 rounded-full">
                        {stock} left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Low-Stock alert message */}
            {selectedSize && stockForSelectedSize > 0 && stockForSelectedSize <= 3 && (
              <p className="text-xs text-amber-700 font-medium">
                ⚡ Only {stockForSelectedSize} ensembles remaining in size {selectedSize}!
              </p>
            )}
            {selectedSize && isSelectedSizeOutOfStock && (
              <p className="text-xs text-red-600 font-medium">
                Size {selectedSize} is sold out. Please select another size or message us on WhatsApp for restock.
              </p>
            )}
          </div>

          {/* Add to Cart + Buy Now CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isEntirelyOutOfStock || isSelectedSizeOutOfStock}
                onClick={handleAddToCart}
                className="touch-tap-target py-3 px-4 rounded border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-colors text-xs sm:text-sm font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                disabled={isEntirelyOutOfStock || isSelectedSizeOutOfStock}
                onClick={handleBuyNow}
                className="touch-tap-target py-3 px-4 rounded bg-terracotta text-white hover:bg-terracotta-600 transition-colors text-xs sm:text-sm font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shadow"
              >
                Buy Now
              </button>
            </div>

            {/* WhatsApp Custom Stylist CTA */}
            <a
              href={whatsappStylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-tap-target w-full py-2.5 px-4 rounded bg-ivory-200 border border-ivory-400 hover:border-emerald-500 text-ink text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Need size help? Ask our Hyderabad Stylist on WhatsApp</span>
            </a>
          </div>

          {/* Accordions */}
          <div className="border-t border-ivory-400 pt-4 space-y-3 text-xs sm:text-sm">
            {/* Description */}
            <div className="border border-ivory-300 rounded bg-ivory">
              <button
                type="button"
                onClick={() =>
                  setAccordionOpen((prev) => ({ ...prev, desc: !prev.desc }))
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-serif font-medium text-ink"
              >
                <span>Fabric, Craft & Details</span>
                {accordionOpen.desc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {accordionOpen.desc && (
                <div className="px-3.5 pb-4 space-y-2 text-ink-600 border-t border-ivory-200 pt-2 text-xs">
                  <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                  <div className="pt-2 border-t border-ivory-200 space-y-1">
                    <p><strong>Fabric:</strong> {product.fabric}</p>
                    <p><strong>Care:</strong> {product.care}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className="border border-ivory-300 rounded bg-ivory">
              <button
                type="button"
                onClick={() =>
                  setAccordionOpen((prev) => ({ ...prev, delivery: !prev.delivery }))
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-serif font-medium text-ink"
              >
                <span>Delivery & 7-Day Returns</span>
                {accordionOpen.delivery ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {accordionOpen.delivery && (
                <div className="px-3.5 pb-4 space-y-2 text-ink-600 border-t border-ivory-200 pt-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Dispatches in 24 hours. Delivered in 3-5 business days across India.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>7-day easy returns and size exchanges with doorstep reverse pickup.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                    <span>Double quality check and anti-tarnish protective wrapping for zari pieces.</span>
                  </div>
                </div>
              )}
            </div>

            {/* FAQs */}
            <div className="border border-ivory-300 rounded bg-ivory">
              <button
                type="button"
                onClick={() =>
                  setAccordionOpen((prev) => ({ ...prev, faqs: !prev.faqs }))
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-serif font-medium text-ink"
              >
                <span>Frequently Asked Questions</span>
                {accordionOpen.faqs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {accordionOpen.faqs && (
                <div className="px-3.5 pb-4 space-y-3 text-ink-600 border-t border-ivory-200 pt-2 text-xs">
                  <div>
                    <h5 className="font-semibold text-ink">Can I request custom blouse tailoring?</h5>
                    <p className="mt-0.5">
                      Yes! Message us on WhatsApp right after placing your order with your specific bust and sleeve measurements.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-ink">Is Cash on Delivery available?</h5>
                    <p className="mt-0.5">
                      Yes, COD is available for all standard PIN codes across India.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Row */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-ivory-400 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-ink font-normal">
              Similar {product.category} Ensembles
            </h3>
            <Link
              to={`/shop/${product.category.toLowerCase().replace(' ', '-')}`}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              View Category →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        category={product.category}
      />
    </div>
  );
};
