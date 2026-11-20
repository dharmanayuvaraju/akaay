import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useLocation, Link } from 'react-router-dom';
import { Filter, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { CATEGORIES } from '../../data/products';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const ListingPage: React.FC = () => {
  const { category: categorySlug } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { products } = useStore();

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceBand, setSelectedPriceBand] = useState<number | null>(() => {
    const maxP = searchParams.get('maxPrice');
    return maxP ? parseInt(maxP, 10) : null;
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Determine current page mode
  const pathname = location.pathname;
  const isOffers = pathname.includes('/offers');
  const isNewArrivals = pathname.includes('/new-arrivals');
  const isBestSelling = pathname.includes('/best-selling');

  // Match category
  const activeCategory = CATEGORIES.find(
    (c) => c.slug.toLowerCase() === categorySlug?.toLowerCase()
  );

  let pageTitle = 'All Collections';
  let pageDescription = 'Explore our complete repertoire of handcrafted ethnic wear and tailored separates.';

  if (activeCategory) {
    pageTitle = activeCategory.name;
    pageDescription = `Handcrafted ${activeCategory.name} designed with artisanal detailing and timeless elegance.`;
  } else if (isOffers) {
    pageTitle = 'Boutique Offers & Budget Finds';
    pageDescription = 'Special limited-edition pricing on select handpicked silhouettes.';
  } else if (isNewArrivals) {
    pageTitle = 'New Arrivals';
    pageDescription = 'Freshly tailored ensembles from our master craftspeople in Hyderabad.';
  } else if (isBestSelling) {
    pageTitle = 'Best Selling Silhouettes';
    pageDescription = 'Most cherished designs favored by our discerning patrons nationwide.';
  }

  // Extract all available colors
  const allColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!colorMap.has(c.name)) {
          colorMap.set(c.name, c.hex);
        }
      });
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Page route filtering
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory.name);
    } else if (isNewArrivals) {
      result = result.filter((p) => p.isNew);
    } else if (isBestSelling) {
      result = result.filter((p) => p.isBestSeller);
    }

    // Price band filter
    if (selectedPriceBand) {
      result = result.filter((p) => p.price <= selectedPriceBand);
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    activeCategory,
    isNewArrivals,
    isBestSelling,
    selectedPriceBand,
    selectedColors,
    sortBy,
  ]);

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedPriceBand(null);
  };

  const hasActiveFilters = selectedColors.length > 0 || selectedPriceBand !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-ink-500 mb-2">
          <Link to="/" className="hover:text-terracotta">Home</Link>
          <span>/</span>
          <span className="text-ink font-medium">{pageTitle}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-ivory-400">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-xl">{pageDescription}</p>
          </div>
          <span className="text-xs sm:text-sm text-ink-500 font-medium shrink-0">
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'ensemble' : 'ensembles'}
          </span>
        </div>
      </div>

      {/* Category Pills Navigation if on shop/all or category */}
      {!isOffers && !isNewArrivals && !isBestSelling && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <Link
            to="/shop/all"
            className={`text-xs px-4 py-2 rounded-full border transition-colors whitespace-nowrap font-medium ${
              !activeCategory
                ? 'bg-ink text-ivory border-ink'
                : 'bg-ivory border-ivory-400 text-ink hover:border-terracotta'
            }`}
          >
            All Pieces
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className={`text-xs px-4 py-2 rounded-full border transition-colors whitespace-nowrap font-medium ${
                activeCategory?.slug === cat.slug
                  ? 'bg-ink text-ivory border-ink'
                  : 'bg-ivory border-ivory-400 text-ink hover:border-terracotta'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-ivory-400">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-terracotta" />
              <h3 className="font-serif text-base text-ink font-medium">Refine Ensembles</h3>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Price Bands Filter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-ink-600 font-bold">
              Price Range
            </h4>
            <div className="flex flex-col space-y-2">
              {[
                { label: 'All Prices', val: null },
                { label: 'Under ₹499', val: 499 },
                { label: 'Under ₹699', val: 699 },
                { label: 'Under ₹899', val: 899 },
                { label: 'Under ₹999', val: 999 },
                { label: 'Under ₹1,499', val: 1499 },
                { label: 'Under ₹2,499', val: 2499 },
              ].map((item) => (
                <button
                  key={String(item.val)}
                  type="button"
                  onClick={() => setSelectedPriceBand(item.val)}
                  className={`text-left text-xs px-3 py-1.5 rounded transition-colors flex items-center justify-between ${
                    selectedPriceBand === item.val
                      ? 'bg-terracotta text-white font-medium'
                      : 'hover:bg-ivory-300 text-ink'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedPriceBand === item.val && <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-3 pt-3 border-t border-ivory-300">
            <h4 className="text-xs uppercase tracking-wider text-ink-600 font-bold">
              Hue & Palette
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allColors.slice(0, 14).map((c) => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      isSelected
                        ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                        : 'border-ivory-400 bg-ivory text-ink hover:border-ink-400'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile Filter Bar & Sort Selector */}
          <div className="flex items-center justify-between gap-3 bg-ivory-200 p-3 rounded-lg border border-ivory-400">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden touch-tap-target text-xs font-semibold text-ink flex items-center gap-1.5 px-3 py-1.5 bg-ivory border border-ivory-400 rounded shadow-sm"
            >
              <Filter className="w-3.5 h-3.5 text-terracotta" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-terracotta" />
              )}
            </button>

            {/* Active filter badges indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {selectedPriceBand && (
                <span className="bg-ivory px-2.5 py-1 rounded-full border border-ivory-400 flex items-center gap-1 text-ink">
                  Under ₹{selectedPriceBand}
                  <button onClick={() => setSelectedPriceBand(null)}>
                    <X className="w-3 h-3 text-ink-400 hover:text-ink" />
                  </button>
                </span>
              )}
              {selectedColors.map((c) => (
                <span
                  key={c}
                  className="bg-ivory px-2.5 py-1 rounded-full border border-ivory-400 flex items-center gap-1 text-ink"
                >
                  {c}
                  <button onClick={() => toggleColor(c)}>
                    <X className="w-3 h-3 text-ink-400 hover:text-ink" />
                  </button>
                </span>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-ink-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-ivory text-ink text-xs py-1.5 px-3 rounded border border-ivory-400 focus:outline-none focus:border-terracotta font-medium"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Grid of Products (2-col mobile, 3-col sm, 4-col desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="bg-ivory rounded-lg border border-ivory-400 p-12 text-center space-y-3">
              <p className="font-serif text-lg text-ink">No ensembles match your selected criteria</p>
              <p className="text-xs text-ink-500">
                Try widening your price range or clearing color selections to discover more pieces.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-2 text-xs uppercase tracking-wider font-semibold bg-terracotta text-white px-4 py-2 rounded hover:bg-terracotta-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-up Sheet */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-ink-900/60"
            onClick={() => setIsFilterDrawerOpen(false)}
          />
          <div className="relative bg-ivory rounded-t-xl p-5 max-h-[80vh] overflow-y-auto space-y-5 z-10 border-t border-ivory-400">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-400">
              <h3 className="font-serif text-lg font-medium text-ink">Filter Ensembles</h3>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 text-ink-500 hover:text-ink touch-tap-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider text-ink-600 font-bold">
                Price Budget
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'All', val: null },
                  { label: 'Under ₹499', val: 499 },
                  { label: 'Under ₹699', val: 699 },
                  { label: 'Under ₹899', val: 899 },
                  { label: 'Under ₹999', val: 999 },
                  { label: 'Under ₹1,499', val: 1499 },
                  { label: 'Under ₹2,499', val: 2499 },
                ].map((item) => (
                  <button
                    key={String(item.val)}
                    type="button"
                    onClick={() => setSelectedPriceBand(item.val)}
                    className={`text-xs p-2.5 rounded border text-left flex items-center justify-between ${
                      selectedPriceBand === item.val
                        ? 'bg-terracotta text-white border-terracotta font-semibold'
                        : 'border-ivory-400 bg-ivory-100 text-ink'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedPriceBand === item.val && <span className="text-[10px] font-bold">Selected</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2 pt-3 border-t border-ivory-300">
              <h4 className="text-xs uppercase tracking-wider text-ink-600 font-bold">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {allColors.slice(0, 12).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                      selectedColors.includes(c.name)
                        ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                        : 'border-ivory-400 bg-ivory text-ink'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-ivory-400 flex items-center gap-3">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 rounded border border-ivory-400 text-xs font-semibold uppercase text-ink"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-1/2 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
