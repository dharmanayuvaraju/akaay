import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CustomerLayout } from './components/common/CustomerLayout';
import { OwnerLayout } from './components/owner/OwnerLayout';

// Customer Pages (Lazy loaded for high performance and sub-200KB initial chunk)
const HomePage = lazy(() => import('./pages/customer/HomePage').then((m) => ({ default: m.HomePage })));
const ListingPage = lazy(() => import('./pages/customer/ListingPage').then((m) => ({ default: m.ListingPage })));
const ProductDetailPage = lazy(() => import('./pages/customer/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/customer/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/customer/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const TrackOrderPage = lazy(() => import('./pages/customer/TrackOrderPage').then((m) => ({ default: m.TrackOrderPage })));
const WishlistPage = lazy(() => import('./pages/customer/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const AccountPage = lazy(() => import('./pages/customer/AccountPage').then((m) => ({ default: m.AccountPage })));
const AboutPage = lazy(() => import('./pages/customer/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/customer/ContactPage').then((m) => ({ default: m.ContactPage })));

// Owner Pages
const OwnerLoginPage = lazy(() => import('./pages/owner/OwnerLoginPage').then((m) => ({ default: m.OwnerLoginPage })));
const OwnerDashboardPage = lazy(() => import('./pages/owner/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage })));
const OwnerProductsPage = lazy(() => import('./pages/owner/OwnerProductsPage').then((m) => ({ default: m.OwnerProductsPage })));
const OwnerStockPage = lazy(() => import('./pages/owner/OwnerStockPage').then((m) => ({ default: m.OwnerStockPage })));
const OwnerOrdersPage = lazy(() => import('./pages/owner/OwnerOrdersPage').then((m) => ({ default: m.OwnerOrdersPage })));
const OwnerStaffPage = lazy(() => import('./pages/owner/OwnerStaffPage').then((m) => ({ default: m.OwnerStaffPage })));
const OwnerOffersPage = lazy(() => import('./pages/owner/OwnerOffersPage').then((m) => ({ default: m.OwnerOffersPage })));

const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 bg-ivory">
    <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
    <span className="font-serif text-xs text-ink-500 tracking-wider">Loading Akaay Atelier...</span>
  </div>
);

export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ListingPage />} />
              <Route path="/shop/:category" element={<ListingPage />} />
              <Route path="/new-arrivals" element={<ListingPage />} />
              <Route path="/best-selling" element={<ListingPage />} />
              <Route path="/offers" element={<ListingPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Owner Login (Standalone) */}
            <Route path="/owner/login" element={<OwnerLoginPage />} />

            {/* Owner Protected Routes */}
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<OwnerDashboardPage />} />
              <Route path="products" element={<OwnerProductsPage />} />
              <Route path="products/:id/stock" element={<OwnerStockPage />} />
              <Route path="orders" element={<OwnerOrdersPage />} />
              <Route path="staff" element={<OwnerStaffPage />} />
              <Route path="offers" element={<OwnerOffersPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
