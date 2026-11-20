import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tag, Grid, Sparkles, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomBar: React.FC = () => {
  const { customerUser } = useStore();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Sale', path: '/offers', icon: Tag, badge: '50%' },
    { label: 'Categories', path: '/shop/all', icon: Grid },
    { label: 'New', path: '/new-arrivals', icon: Sparkles },
    { label: 'Profile', path: '/account', icon: User, isLogged: !!customerUser },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-ivory border-t border-ivory-400 py-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `touch-tap-target flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors relative ${
                  isActive ? 'text-terracotta font-semibold' : 'text-ink-600 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-3.5 bg-marigold text-ink-900 text-[8px] font-bold px-1 rounded-full leading-tight">
                        {item.badge}
                      </span>
                    )}
                    {item.isLogged && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-ivory" />
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
