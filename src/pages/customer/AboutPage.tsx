import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, HeartHandshake, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Editorial Header */}
      <section className="bg-ivory-200 border-b border-ivory-400 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Our Atelier & Story
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
            Crafted with Devotion, Draped with Grace
          </h1>
          <div className="w-16 h-0.5 bg-terracotta/40 mx-auto" />
          <p className="text-sm sm:text-base text-ink-600 max-w-2xl mx-auto leading-relaxed">
            Akaay was born out of a quiet longing for textiles that celebrate Indian artisanal heritage without compromising on daily comfort, effortless drape, and honest pricing.
          </p>
        </div>
      </section>

      {/* Main Narrative with Photography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5 text-ink-700 leading-relaxed text-sm sm:text-base">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              From Master Looms to Your Celebrations
            </h2>
            <p>
              Nestled in Banjara Hills, Hyderabad, our boutique studio works closely with artisan cooperatives across Varanasi, Lucknow, Chanderi, and Bengal. Rather than chasing fleeting factory trends, each ensemble in our collection is woven in small, mindful batches.
            </p>
            <p>
              We believe genuine luxury lies in the feel of hand-twisted zari that never scratches, pure mulmul lining that breathes in southern heat, and silhouettes tailored with generous seam margins so every garment fits as if it were sculpted just for you.
            </p>
            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl font-bold text-terracotta">24+</span>
                <span className="block text-xs text-ink-500 uppercase tracking-wider mt-0.5">
                  Artisan Guilds
                </span>
              </div>
              <div className="h-10 w-px bg-ivory-400" />
              <div>
                <span className="font-serif text-3xl font-bold text-terracotta">100%</span>
                <span className="block text-xs text-ink-500 uppercase tracking-wider mt-0.5">
                  Natural Fibers
                </span>
              </div>
              <div className="h-10 w-px bg-ivory-400" />
              <div>
                <span className="font-serif text-3xl font-bold text-terracotta">Hyderabad</span>
                <span className="block text-xs text-ink-500 uppercase tracking-wider mt-0.5">
                  Flagship Studio
                </span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-ivory-400 shadow-sm bg-ivory-300">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Akaay Boutique Artisanal Weaving"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-ivory/95 p-3.5 rounded border border-ivory-400 text-xs">
              <span className="font-serif font-semibold text-ink block">Handloom Preservation</span>
              <span className="text-ink-600">Preserving centuries-old jacquard weaving traditions in Varanasi & Telangana.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique Values */}
      <section className="bg-ivory-200 border-y border-ivory-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
              The Akaay Guarantee
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">
              Guiding Principles of Our Studio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ivory p-6 rounded-lg border border-ivory-400 space-y-3">
              <Sparkles className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-lg text-ink font-medium">True-to-Skin Comfort</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                We reject stiff synthetic stiffeners. All our suits and co-ords feature gentle pre-washed cotton linings and skin-friendly dyes.
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-lg border border-ivory-400 space-y-3">
              <ShieldCheck className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-lg text-ink font-medium">Ethical Artisan Remuneration</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                By maintaining direct ties with master weavers, we ensure fair compensation without layered middleman markups.
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-lg border border-ivory-400 space-y-3">
              <HeartHandshake className="w-6 h-6 text-terracotta" />
              <h4 className="font-serif text-lg text-ink font-medium">Personalized WhatsApp Care</h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Whether you need blouse sizing advice, sleeve alterations, or video consultation, our team is one WhatsApp message away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Studio CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <MapPin className="w-8 h-8 text-terracotta mx-auto" />
        <h3 className="font-serif text-2xl text-ink font-normal">Visit Our Hyderabad Atelier</h3>
        <p className="text-xs sm:text-sm text-ink-600 max-w-lg mx-auto">
          Road No. 12, Banjara Hills, Hyderabad, Telangana 500034.
          Open Tuesday through Sunday, 11:00 AM to 8:00 PM.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop/all"
            className="touch-tap-target px-6 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors"
          >
            Explore Collections
          </Link>
          <a
            href={getBaseWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-tap-target px-5 py-2.5 rounded border border-ivory-400 bg-ivory text-ink hover:border-terracotta text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Book Studio Appointment
          </a>
        </div>
      </section>
    </div>
  );
};
