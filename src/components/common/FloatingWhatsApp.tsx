import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={getBaseWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Akaay Boutique on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2 bg-[#25D366] text-white px-3.5 py-2.5 rounded-full shadow-md hover:bg-[#20ba59] transition-all transform active:scale-95 focus:outline-none"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-none" />
      <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pr-1">
        Boutique Help
      </span>
    </a>
  );
};
