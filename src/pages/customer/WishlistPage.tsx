import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <nav className="flex items-center gap-2 text-xs text-ink-500 mb-2">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <span className="text-ink font-medium">Saved Ensembles</span>
        </nav>
        <div className="flex items-center justify-between pb-4 border-b border-ivory-400">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">My Wishlist</h1>
            <p className="text-xs text-ink-600 mt-1">
              Your curated wishlist of handcrafted festive drapes and daily separates.
            </p>
          </div>
          <span className="text-xs sm:text-sm text-ink-500 font-medium">
            {savedProducts.length} {savedProducts.length === 1 ? 'ensemble' : 'ensembles'} saved
          </span>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-ivory rounded-xl border border-ivory-400 p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-ink-300 mx-auto stroke-[1.5]" />
          <h3 className="font-serif text-xl text-ink">Your wishlist is currently empty</h3>
          <p className="text-xs text-ink-500 max-w-sm mx-auto">
            Tap the heart icon on any saree, suit, or dress to save it for your celebratory wardrobe.
          </p>
          <Link
            to="/shop/all"
            className="inline-flex items-center gap-2 touch-tap-target px-6 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors"
          >
            <span>Explore Ensembles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
