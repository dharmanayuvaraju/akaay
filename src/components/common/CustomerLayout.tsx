import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomBar } from './MobileBottomBar';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { CartDrawer } from './CartDrawer';
import { SearchOverlay } from './SearchOverlay';
import { Toast } from './Toast';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory text-ink flex flex-col font-sans selection:bg-terracotta/20 selection:text-terracotta">
      {/* Global Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Header with Wordmark, Nav, Search, Wishlist, Account, Cart */}
      <Header />

      {/* Main Page Content with safe padding above mobile bottom bar */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom-Right WhatsApp button */}
      <FloatingWhatsApp />

      {/* Mobile Bottom Tab Bar (<768px) */}
      <MobileBottomBar />

      {/* Site-wide Sliding Cart Drawer */}
      <CartDrawer />

      {/* Search Overlay */}
      <SearchOverlay />

      {/* Notification Toast Stack */}
      <Toast />
    </div>
  );
};
