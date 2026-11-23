import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer
      className="bg-ink text-ivory border-t border-ink-700"
      style={{ paddingBlock: 'clamp(48px, 6vw, 96px)' }}
    >
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Blurb */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-terracotta text-ivory flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-terracotta/30 group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" aria-hidden="true">
                  <path d="M12 3L5 20H8.2L9.8 15.8H14.2L15.8 20H19L12 3ZM12 8.5L13.3 12.8H10.7L12 8.5Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-tight text-ivory">Akaay</span>
                <span className="text-[10px] uppercase tracking-widest text-marigold font-semibold">
                  Boutique
                </span>
              </div>
            </Link>
            <p className="text-sm text-ivory-400 leading-relaxed">
              Akaay Boutique curates heirloom handloom textiles, delicate artisanal embroideries, and
              mindful contemporary silhouettes for the modern Indian woman.
            </p>
            <div className="pt-1 text-xs text-ivory-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-marigold" />
              <span>100% Authentic Handcrafted Textiles</span>
            </div>
          </div>

          {/* Useful Links */}
          <div className="space-y-3">
            <h4
              className="font-serif text-ivory font-medium tracking-wide"
              style={{ fontSize: 'clamp(14px, 1vw, 18px)' }}
            >
              Useful Links
            </h4>
            <ul
              className="space-y-2 text-ivory-400"
              style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
            >
              <li>
                <Link to="/" className="hover:text-marigold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-marigold transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-marigold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-marigold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-marigold transition-colors">
                  Offers & Budget Finds
                </Link>
              </li>
              <li>
                <span className="text-ivory-500 hover:text-ivory-300 cursor-pointer">
                  Shipping & Delivery Policy
                </span>
              </li>
              <li>
                <span className="text-ivory-500 hover:text-ivory-300 cursor-pointer">
                  7-Day Returns & Exchanges
                </span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4
              className="font-serif text-ivory font-medium tracking-wide"
              style={{ fontSize: 'clamp(14px, 1vw, 18px)' }}
            >
              Collections
            </h4>
            <ul
              className="space-y-2 text-ivory-400"
              style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
            >
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/shop/${cat.slug}`}
                    className="hover:text-marigold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Block */}
          <div className="space-y-3">
            <h4
              className="font-serif text-ivory font-medium tracking-wide"
              style={{ fontSize: 'clamp(14px, 1vw, 18px)' }}
            >
              Akaay Boutique
            </h4>
            <ul
              className="space-y-2.5 text-ivory-400"
              style={{ fontSize: 'clamp(12px, 0.85vw, 15px)' }}
            >
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                <span>Road No. 12, Banjara Hills, Hyderabad, Telangana 500034</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-terracotta shrink-0" />
                <a
                  href="mailto:hello@akaayboutique.in"
                  className="hover:text-marigold transition-colors"
                >
                  hello@akaayboutique.in
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-terracotta shrink-0" />
                <a href="tel:+917337422054" className="hover:text-marigold transition-colors">
                  +91 73374 22054
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={getBaseWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-marigold transition-colors"
                >
                  WhatsApp: +91 73374 22054
                </a>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/owner/login"
                className="inline-flex items-center text-xs text-ivory-500 hover:text-marigold underline transition-colors"
              >
                Owner & Staff Back Office →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-500 gap-3">
          <p>© {new Date().getFullYear()} Akaay Boutique. All rights reserved. Handcrafted in India.</p>
          <div className="flex items-center gap-4">
            <span>Client Pitch Demo</span>
            <span>•</span>
            <span>Simulated E-Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
