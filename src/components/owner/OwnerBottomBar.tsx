import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Layers, Boxes, Sliders } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerBottomBar: React.FC = () => {
  const { products, orders } = useStore();

  const firstProductId = products[0]?.id || 'aky-01';

  // Count active orders
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const navItems = [
    { label: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { label: 'Orders', path: '/owner/orders', icon: ShoppingBag, badge: activeOrdersCount || undefined },
    { label: 'Products', path: '/owner/products', icon: Layers },
    { label: 'Stock', path: `/owner/products/${firstProductId}/stock`, icon: Boxes },
    { label: 'Offers', path: '/owner/offers', icon: Sliders },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-ink text-ivory border-t border-ink-700 py-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Owner Back Office Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/owner'}
              className={({ isActive }) =>
                `touch-tap-target flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors relative ${
                  isActive ? 'text-marigold font-semibold' : 'text-ivory-400 hover:text-ivory'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-terracotta text-white text-[8px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
