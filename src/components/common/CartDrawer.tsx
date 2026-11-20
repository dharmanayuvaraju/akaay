import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getCartWhatsAppUrl } from '../../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    products,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Compute bill
  let totalMrp = 0;
  let subtotal = 0;

  const cartDetailed = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const itemPrice = product?.price ?? 0;
    const itemMrp = product?.mrp ?? itemPrice;
    const stockAvailable = product?.stock[item.size] ?? 0;

    totalMrp += itemMrp * item.quantity;
    subtotal += itemPrice * item.quantity;

    return {
      ...item,
      product,
      itemPrice,
      itemMrp,
      stockAvailable,
    };
  });

  const discount = Math.max(0, totalMrp - subtotal);
  const shipping = subtotal > 0 ? (subtotal >= 1499 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const whatsappUrl = getCartWhatsAppUrl(cart, products, total);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-900/60 transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-ivory h-full shadow-2xl flex flex-col z-10 border-l border-ivory-400">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-ivory-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-terracotta" />
            <h2 className="font-serif text-lg font-medium text-ink">Boutique Bag</h2>
            <span className="text-xs bg-ivory-300 px-2 py-0.5 rounded-full text-ink-600 font-semibold">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-ink-500 hover:text-terracotta transition-colors touch-tap-target"
            aria-label="Close cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal > 0 && (
          <div className="bg-ivory-200 px-4 py-2 text-xs border-b border-ivory-300">
            {subtotal >= 1499 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                ✓ You have unlocked FREE Express Delivery!
              </span>
            ) : (
              <span className="text-ink-600">
                Add <strong className="text-terracotta">₹{(1499 - subtotal).toLocaleString('en-IN')}</strong> more for FREE Shipping!
              </span>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag className="w-12 h-12 text-ink-300 stroke-[1.5]" />
              <p className="font-serif text-lg text-ink">Your bag is currently empty</p>
              <p className="text-xs text-ink-500 max-w-xs">
                Explore our festive sarees, pure chikankari sets, and breezy linen co-ords.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop/all');
                }}
                className="mt-2 text-xs font-semibold uppercase tracking-wider bg-terracotta text-white px-5 py-2.5 rounded hover:bg-terracotta-600 transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cartDetailed.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3 bg-ivory p-3 rounded-lg border border-ivory-400 relative"
              >
                <img
                  src={item.product?.images[0]}
                  alt={item.product?.name || 'Item'}
                  className="w-20 h-25 object-cover rounded aspect-[4/5] shrink-0 border border-ivory-300"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-sm font-medium text-ink leading-snug line-clamp-1">
                        {item.product?.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-ink-400 hover:text-red-600 p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-ink-500 mt-1">
                      <span>Size: <strong>{item.size}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.color}</strong></span>
                    </div>

                    {/* Prepaid demo order tag */}
                    <div className="mt-1">
                      <span className="inline-block text-[10px] bg-marigold/20 text-ink-800 border border-marigold/40 px-1.5 py-0.5 rounded font-medium">
                        Prepaid demo order
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-ivory-300">
                    {/* Stepper */}
                    <div className="flex items-center border border-ivory-400 rounded bg-ivory-100">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center text-ink hover:text-terracotta transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.size,
                            item.color,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity >= item.stockAvailable}
                        className={`w-7 h-7 flex items-center justify-center text-ink transition-colors ${
                          item.quantity >= item.stockAvailable
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:text-terracotta'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line item price */}
                    <div className="text-right">
                      <span className="text-sm font-bold text-ink">
                        ₹{(item.itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.itemMrp > item.itemPrice && (
                        <span className="text-xs text-ink-400 line-through block">
                          ₹{(item.itemMrp * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill & Checkout CTAs */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-ivory-400 bg-ivory-100 space-y-3">
            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-ink-600">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMrp.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Boutique Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-700 uppercase">FREE</strong>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-ivory-300 flex justify-between text-sm font-bold text-ink">
                <span>Estimated Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Order on WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full touch-tap-target py-2.5 px-4 rounded bg-[#25D366] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp (Instant Assist)</span>
            </a>

            {/* Proceed to Buy */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full touch-tap-target py-3 px-4 rounded bg-terracotta text-white text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-terracotta-600 active:scale-[0.99] transition-all shadow"
            >
              <span>Proceed to Buy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
