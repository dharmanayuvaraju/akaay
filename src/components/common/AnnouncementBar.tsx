import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="bg-ink text-ivory text-xs sm:text-sm font-medium py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
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
