import React from 'react';
import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OwnerHeader } from './OwnerHeader';
import { OwnerBottomBar } from './OwnerBottomBar';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Boxes,
  Users,
  Percent,
  Sparkles,
} from 'lucide-react';

export const OwnerLayout: React.FC = () => {
  const { ownerUser, products, orders } = useStore();
  const location = useLocation();

  if (!ownerUser || !ownerUser.isLoggedIn) {
    return <Navigate to="/owner/login" replace state={{ from: location }} />;
  }

  const isOwner = ownerUser.role === 'owner';
  const firstProductId = products[0]?.id || 'aky-01';

  const pendingOrdersCount = orders.filter((o) => o.status === 'Placed' || o.status === 'Packed').length;

  const desktopNavLinks = [
    { label: 'Dashboard', path: '/owner', icon: LayoutDashboard, end: true },
    { label: 'Orders', path: '/owner/orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { label: 'Inventory', path: '/owner/products', icon: Layers },
    { label: 'Stock Manager', path: `/owner/products/${firstProductId}/stock`, icon: Boxes },
    ...(isOwner
      ? [
          { label: 'Staff Access', path: '/owner/staff', icon: Users },
          { label: 'Offers & Banners', path: '/owner/offers', icon: Percent },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col font-sans">
      <OwnerHeader />

      {/* Desktop Sub-navigation bar */}
      <div className="hidden md:block bg-ivory-200 border-b border-ivory-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-4 py-2">
            {desktopNavLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                      isActive
                        ? 'bg-ink text-ivory shadow-sm'
                        : 'text-ink-700 hover:bg-ivory-300 hover:text-ink'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-terracotta text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Back Office Body with safe-bottom padding on mobile */}
      <main className="flex-1 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Tab Bar */}
      <OwnerBottomBar />

      {/* Required Back Office Footer Line */}
      <footer className="bg-ivory-300 border-t border-ivory-400 py-3 text-center text-xs text-ink-500 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-marigold animate-pulse" />
          <span className="font-serif text-ink font-medium">Akaay Boutique Back Office</span>
          <span>•</span>
          <span className="font-sans">Demo data - simulated store</span>
        </div>
      </footer>
    </div>
  );
};
