import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink-900/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-ivory rounded-lg max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-ivory-400 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-ivory-400">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-lg font-medium text-ink">
              Size & Fit Guide ({category})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-ink-500 hover:text-terracotta"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-ink-500 my-3">
          All measurements are garment dimensions in <strong>inches</strong>. Our boutique silhouettes feature comfortable ease for graceful movement.
        </p>

        {category === 'Sarees' ? (
          <div className="bg-ivory-200 p-4 rounded border border-ivory-300 text-xs text-ink-700 space-y-2">
            <p><strong>Length:</strong> 5.5 Meters standard drape length.</p>
            <p><strong>Blouse Piece:</strong> 0.8 Meters unstitched running or contrast fabric included.</p>
            <p><strong>Width:</strong> 44 - 45 Inches standard fall width.</p>
            <p className="text-terracotta font-medium pt-1">
              • Need pre-stitched pleating or custom blouse tailoring? Message us on WhatsApp!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-ivory-300 text-ink-700 font-serif border-b border-ivory-400">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust (in)</th>
                  <th className="py-2.5 px-3">Waist (in)</th>
                  <th className="py-2.5 px-3">Hip (in)</th>
                  <th className="py-2.5 px-3">Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-300 text-ink">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-terracotta">S (Small)</td>
                  <td className="py-2.5 px-3">34 - 35"</td>
                  <td className="py-2.5 px-3">28 - 29"</td>
                  <td className="py-2.5 px-3">37 - 38"</td>
                  <td className="py-2.5 px-3">42 - 46"</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-terracotta">M (Medium)</td>
                  <td className="py-2.5 px-3">36 - 37"</td>
                  <td className="py-2.5 px-3">30 - 31"</td>
                  <td className="py-2.5 px-3">39 - 40"</td>
                  <td className="py-2.5 px-3">42 - 46"</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-terracotta">L (Large)</td>
                  <td className="py-2.5 px-3">38 - 40"</td>
                  <td className="py-2.5 px-3">32 - 34"</td>
                  <td className="py-2.5 px-3">41 - 43"</td>
                  <td className="py-2.5 px-3">43 - 47"</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-terracotta">XL (X-Large)</td>
                  <td className="py-2.5 px-3">41 - 43"</td>
                  <td className="py-2.5 px-3">35 - 37"</td>
                  <td className="py-2.5 px-3">44 - 46"</td>
                  <td className="py-2.5 px-3">43 - 47"</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-ivory-300 flex items-center justify-between text-xs text-ink-500">
          <span>Between sizes? We recommend sizing up for comfortable draping.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-terracotta font-semibold hover:underline"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
