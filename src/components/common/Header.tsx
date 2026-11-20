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
    <header className="sticky top-0 z-40 bg-ivory/95 border-b border-ivory-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Mobile menu trigger button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="touch-tap-target p-2 text-ink hover:text-terracotta focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo / Wordmark */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3 group py-1">
              {/* Refined 'A' Monogram Seal */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-terracotta text-ivory flex items-center justify-center shadow-sm ring-2 ring-terracotta/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M12 3L5 20H8.2L9.8 15.8H14.2L15.8 20H19L12 3ZM12 8.5L13.3 12.8H10.7L12 8.5Z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-ink group-hover:text-terracotta transition-colors leading-none">
                    Akaay
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-terracotta font-semibold uppercase">
                    Boutique
                  </span>
                </div>
                <span className="text-[9px] tracking-[0.2em] text-ink-500 uppercase font-sans mt-0.5">
                  Hyderabad • Handcrafted
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-ink">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
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
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
              }
            >
              New Arrivals
            </NavLink>

            <NavLink
              to="/best-selling"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
              }
            >
              Best Selling
            </NavLink>

            <NavLink
              to="/offers"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
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
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors hover:text-terracotta py-2 ${isActive ? 'text-terracotta font-semibold' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3 text-ink">
            {/* Search */}
            <button
              type="button"
              onClick={handleSearchClick}
              className="touch-tap-target p-2 hover:text-terracotta transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="touch-tap-target p-2 hover:text-terracotta transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to="/account"
              className="touch-tap-target p-2 hover:text-terracotta transition-colors relative"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
              {customerUser && (
                <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </Link>

            {/* Cart with count badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="touch-tap-target p-2 hover:text-terracotta transition-colors relative"
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
        <div className="md:hidden bg-ivory border-b border-ivory-400 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-base font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-ivory-300 text-ink"
            >
              Home
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
