import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { getBaseWhatsAppUrl } from '../../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Thank you! Your message has been sent to our boutique stylists.');
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-1">
          Contact Akaay Boutique
        </h1>
        <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-xl">
          We are delighted to assist with bulk festive orders, custom sizing consultations, or bridal trousseau inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Information & Studio Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-ivory rounded-xl border border-ivory-400 p-6 shadow-sm space-y-6">
            <h3 className="font-serif text-xl text-ink font-medium pb-3 border-b border-ivory-300">
              Hyderabad Studio & Flagship
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-ink-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-serif text-ink text-sm">Flagship Boutique:</strong>
                  <span>Plot 42, Road No. 12, Banjara Hills, Hyderabad, Telangana 500034, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-serif text-ink text-sm">Client Concierge:</strong>
                  <a href="tel:+917337422054" className="hover:text-terracotta transition-colors">
                    +91 73374 22054
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-serif text-ink text-sm">Email Inquiries:</strong>
                  <a href="mailto:hello@akaayboutique.in" className="hover:text-terracotta transition-colors">
                    hello@akaayboutique.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-serif text-ink text-sm">Boutique Hours:</strong>
                  <span>Tuesday to Sunday: 11:00 AM – 8:00 PM (IST)</span>
                  <span className="block text-[11px] text-ink-500">Mondays closed for studio curation.</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="bg-[#25D366]/15 border border-[#25D366]/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-ink font-serif font-semibold text-sm">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Instant WhatsApp Concierge</span>
              </div>
              <p className="text-xs text-ink-600">
                Prefer immediate chat? Connect directly with our lead master stylist for video calls or sizing verification.
              </p>
              <a
                href={getBaseWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="touch-tap-target w-full py-2.5 rounded bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-colors"
              >
                <span>Chat on WhatsApp (+91 73374 22054)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Simulated Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-ivory rounded-xl border border-ivory-400 p-6 sm:p-8 shadow-sm space-y-5">
            <h3 className="font-serif text-xl text-ink font-medium pb-2 border-b border-ivory-300">
              Send an Atelier Inquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Radhika Menon"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-ink">Contact Phone (+91)</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="73374 22054"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="radhika@example.com"
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-ink">Message or Styling Request</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about the ensemble you are looking for, bridal dates, or custom sizing requirements..."
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="touch-tap-target py-3 px-6 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center justify-center gap-2 shadow"
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Inquiry Transmitted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Studio</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
