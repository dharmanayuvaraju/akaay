import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  return (
    <div
      className="bg-ink text-ivory px-4 font-medium transition-colors flex items-center justify-center"
      style={{ minHeight: 'clamp(32px, 4vh, 44px)' }}
    >
      <div
        className="site-container flex items-center justify-center gap-2 text-center"
        style={{ fontSize: 'clamp(11px, 0.8vw, 14px)' }}
      >
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-marigold animate-pulse" />
        <a
          href={getBaseWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-marigold transition-colors inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{settings.announcementText || 'For bulk & boutique orders, message us on WhatsApp'}</span>
        </a>
      </div>
    </div>
  );
};
