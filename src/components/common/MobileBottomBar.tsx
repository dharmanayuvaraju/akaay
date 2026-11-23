import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tag, Grid, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomBar: React.FC = () => {
  const { customerUser, cartCount, setIsCartOpen } = useStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FBF7F0] border-t border-ivory-400 py-1 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `touch-tap-target min-h-[48px] flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-terracotta font-semibold' : 'text-ink-600 hover:text-ink-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
            </>
          )}
        </NavLink>

        {/* Sale */}
        <NavLink
          to="/offers"
          className={({ isActive }) =>
            `touch-tap-target min-h-[48px] flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-terracotta font-semibold' : 'text-ink-600 hover:text-ink-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Tag className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="absolute -top-1 -right-3.5 bg-marigold text-ink-900 text-[10px] font-bold px-1 rounded-full leading-tight">
                  50%
                </span>
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Sale</span>
            </>
          )}
        </NavLink>

        {/* Categories */}
        <NavLink
          to="/shop/all"
          className={({ isActive }) =>
            `touch-tap-target min-h-[48px] flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-terracotta font-semibold' : 'text-ink-600 hover:text-ink-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Grid className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
            </>
          )}
        </NavLink>

        {/* Cart - Always reachable on mobile */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="touch-tap-target min-h-[48px] flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative text-ink-600 hover:text-ink-900"
          aria-label="View Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-[22px] h-[22px] stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-terracotta text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-tight">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* Profile */}
        <NavLink
          to="/account"
          className={({ isActive }) =>
            `touch-tap-target min-h-[48px] flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors relative ${
              isActive ? 'text-terracotta font-semibold' : 'text-ink-600 hover:text-ink-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <User className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {customerUser && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-ivory" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
