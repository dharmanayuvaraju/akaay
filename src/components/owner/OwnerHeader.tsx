import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OwnerHeader: React.FC = () => {
  const { ownerUser, ownerLogout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    ownerLogout();
    navigate('/owner/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-ink text-ivory border-b border-ink-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Back Office Badge */}
          <div className="flex items-center gap-3">
            <Link to="/owner" className="flex items-center gap-2 group">
              <span className="font-serif text-2xl tracking-tight text-ivory group-hover:text-marigold transition-colors">
                Akaay
              </span>
              <span className="h-4 w-px bg-ink-600" />
              <span className="text-xs uppercase tracking-wider text-marigold font-bold">
                Back Office
              </span>
            </Link>
          </div>

          {/* User Role Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {ownerUser && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="text-ivory-400">Signed in as:</span>
                <span className="font-medium text-ivory">{ownerUser.name}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${ownerUser.role === 'owner'
                    ? 'bg-marigold text-ink-900'
                    : 'bg-terracotta text-white'
                    }`}
                >
                  {ownerUser.role}
                </span>
              </div>
            )}

            {/* Link back to Customer Storefront */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="touch-tap-target text-xs px-3 py-1.5 rounded bg-ink-800 hover:bg-ink-700 text-ivory-300 hover:text-ivory flex items-center gap-1.5 border border-ink-600 transition-colors"
              title="Open customer boutique in new tab"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="touch-tap-target p-2 text-ivory-400 hover:text-red-400 transition-colors"
              title="Sign Out of Back Office"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
