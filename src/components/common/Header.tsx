import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';

export const Header: React.FC = () => {
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, customerUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF7F0] opacity-100 border-b border-ivory-400">
      <div className="w-full px-3 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-1.5 min-[360px]:gap-2" style={{ height: 'var(--header-h)' }}>
          {/* Mobile menu trigger button */}
          <div className="flex items-center md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 min-w-10 min-h-10 p-0 flex items-center justify-center text-ink hover:text-terracotta focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo / Wordmark */}
          <div className="min-w-0 flex-1 md:flex-none text-left">
            <Link to="/" className="inline-flex items-center gap-2 group py-1 max-w-full">
              {/* Refined 'A' Monogram Seal: violet circle with white letter */}
              <div
                className="w-9 h-9 min-w-9 min-h-9 rounded-full bg-[#3B1F5E] text-white flex items-center justify-center shadow-sm ring-2 ring-[#3B1F5E]/20 group-hover:scale-105 transition-transform shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" aria-hidden="true">
                  <path d="M12 3L5 20H8.2L9.8 15.8H14.2L15.8 20H19L12 3ZM12 8.5L13.3 12.8H10.7L12 8.5Z" />
                </svg>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-baseline gap-1 min-[360px]:gap-1.5 whitespace-nowrap">
                  <span
                    className="font-serif font-semibold tracking-tight text-ink group-hover:text-terracotta transition-colors leading-none text-[18px] min-[390px]:text-[20px] md:text-2xl"
                  >
                    Akaay
                  </span>
                  <span className="text-[9px] min-[390px]:text-[10px] tracking-[0.18em] text-terracotta font-semibold uppercase leading-none">
                    Boutique
                  </span>
                </div>
                <span className="text-[9px] tracking-[0.2em] text-ink-500 uppercase font-sans mt-0.5 hidden min-[480px]:block truncate">
                  Hyderabad • Handcrafted
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center font-medium text-ink"
            style={{
              gap: 'clamp(16px, 2vw, 40px)',
              fontSize: 'clamp(13px, 0.9vw, 16px)',
            }}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              Home
            </NavLink>

            {/* Shop with Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => navigate('/shop/all')}
                className="inline-flex items-center gap-1 text-ink group-hover:text-terracotta transition-colors"
              >
                <span>Shop</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-60 bg-ivory rounded-b-md shadow-md border border-ivory-400 py-3 z-50">
                  <Link
                    to="/shop/all"
                    onClick={() => setShopDropdownOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold text-terracotta uppercase tracking-wider hover:bg-ivory-300 transition-colors"
                  >
                    View All Collections
                  </Link>
                  <div className="h-px bg-ivory-300 my-1" />
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop/${cat.slug}`}
                      onClick={() => setShopDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-ink hover:text-terracotta hover:bg-ivory-300 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/new-arrivals"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              New Arrivals
            </NavLink>

            <NavLink
              to="/best-selling"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              Best Selling
            </NavLink>

            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              <span className="relative">
                Offers
                <span className="absolute -top-2.5 -right-5 bg-marigold text-ink-900 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  SALE
                </span>
              </span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 text-ink shrink-0">
            {/* Search */}
            <button
              type="button"
              onClick={handleSearchClick}
              className="w-10 h-10 min-w-10 min-h-10 p-0 hover:text-terracotta transition-colors flex items-center justify-center"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="w-10 h-10 min-w-10 min-h-10 p-0 hover:text-terracotta transition-colors relative flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account - safely moved to hamburger menu below 400px so Cart is NEVER hidden */}
            <Link
              to="/account"
              className="hidden min-[400px]:flex w-10 h-10 min-w-10 min-h-10 p-0 hover:text-terracotta transition-colors relative items-center justify-center"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
              {customerUser && (
                <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </Link>

            {/* Cart with count badge - ALWAYS visible at every viewport width */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="w-10 h-10 min-w-10 min-h-10 p-0 hover:text-terracotta transition-colors relative flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF7F0] border-b border-ivory-400 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-base font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              Home
            </Link>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink flex items-center justify-between"
            >
              <span>{customerUser ? `My Account (${customerUser.name || 'Member'})` : 'Account / Sign In'}</span>
              <User className="w-4 h-4 text-ink-600" />
            </Link>
            <div className="border-l-2 border-terracotta/40 pl-3 my-1 space-y-1">
              <span className="text-xs uppercase tracking-wider text-ink-500 font-semibold block px-1 py-1">
                Categories
              </span>
              <Link
                to="/shop/all"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-sm text-terracotta font-medium hover:bg-ivory-300 rounded"
              >
                All Collections
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/shop/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-2 py-1.5 text-sm text-ink-700 hover:text-terracotta hover:bg-ivory-300 rounded"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              to="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              New Arrivals
            </Link>
            <Link
              to="/best-selling"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              Best Selling
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink flex items-center justify-between"
            >
              <span>Offers & Deals</span>
              <span className="bg-marigold text-ink-900 text-xs px-2 py-0.5 rounded-full font-bold">
                SALE
              </span>
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              Track Order
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              About Akaay
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
