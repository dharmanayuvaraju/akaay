import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, settings } = useStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  // Check discount override from owner settings if present
  const discountOverride = settings.productDiscountOverrides[product.id];
  const discountPercent =
    discountOverride !== undefined
      ? discountOverride
      : Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Check if completely out of stock across all sizes
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock <= 0;

  // Default size for quick add
  const defaultSize = product.sizes.find((s) => (product.stock[s] ?? 0) > 0) || product.sizes[0];
  const defaultColor = product.colors[0]?.name || 'Standard';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addToCart(product.id, defaultSize, defaultColor, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col bg-ivory rounded-md overflow-hidden border border-ivory-400/60 hover:border-terracotta/40 transition-all duration-200">
      {/* Image container 4:5 ratio */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-ivory-300">
        {/* Skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-ivory-300 animate-pulse flex items-center justify-center">
            <span className="font-serif text-sm text-ink-400 italic">Akaay</span>
          </div>
        )}

        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width="400"
          height="500"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && !isOutOfStock && (
            <span className="bg-marigold text-ink-900 font-bold text-[11px] px-2 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && !isOutOfStock && (
            <span className="bg-terracotta text-white font-medium text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {product.isNew && !isOutOfStock && (
            <span className="bg-ink-800 text-ivory font-medium text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Out of Stock Ribbon */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center z-10">
            <span className="bg-ink-800 text-ivory text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-ivory-400">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist Heart button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`touch-tap-target absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            isFavorited
              ? 'bg-white text-terracotta'
              : 'bg-white/80 text-ink-600 hover:text-terracotta hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-terracotta stroke-terracotta' : ''}`} />
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-ivory">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-ink-500 font-sans block mb-0.5">
            {product.category}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="block font-serif text-sm sm:text-base text-ink font-medium leading-snug line-clamp-1 group-hover:text-terracotta transition-colors"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-2.5 pt-2 border-t border-ivory-300 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-ink">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-ink-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Free Express Shipping
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`touch-tap-target p-2 rounded-full border transition-all text-xs font-medium flex items-center justify-center ${
              isOutOfStock
                ? 'border-ivory-400 text-ink-400 cursor-not-allowed bg-ivory-300'
                : isAdding
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-terracotta text-terracotta hover:bg-terracotta hover:text-white active:scale-95'
            }`}
            title={isOutOfStock ? 'Sold Out' : `Quick Add (${defaultSize})`}
            aria-label="Add to Cart"
          >
            {isAdding ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
