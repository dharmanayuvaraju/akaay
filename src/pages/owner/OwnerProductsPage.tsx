import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Boxes,
  X,
  Check,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Category, ProductColor } from '../../types';
import { CATEGORIES } from '../../data/products';

export const OwnerProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, ownerUser } = useStore();

  const isOwner = ownerUser?.role === 'owner';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('Sarees');
  const [formPrice, setFormPrice] = useState<number>(999);
  const [formMrp, setFormMrp] = useState<number>(1799);
  const [formDescription, setFormDescription] = useState('');
  const [formFabric, setFormFabric] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formImages, setFormImages] = useState<string>('');
  const [formColors, setFormColors] = useState<string>('');
  const [formSizes, setFormSizes] = useState<string>('');
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(true);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleOpenAdd = () => {
    if (!isOwner) return;
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Sarees');
    setFormPrice(999);
    setFormMrp(1799);
    setFormDescription('Artisanal boutique ensemble crafted in limited quantities with pure natural fibers.');
    setFormFabric('Handloom Pure Cotton');
    setFormCare('Dry clean only or gentle hand wash.');
    setFormImages('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80');
    setFormColors('Terracotta:#C05621, Ivory:#FBF7F0');
    setFormSizes('Free Size');
    setFormIsBestSeller(false);
    setFormIsNew(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    if (!isOwner) return;
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormMrp(product.mrp);
    setFormDescription(product.description);
    setFormFabric(product.fabric);
    setFormCare(product.care);
    setFormImages(product.images.join('\n'));
    setFormColors(product.colors.map((c) => `${c.name}:${c.hex}`).join(', '));
    setFormSizes(product.sizes.join(', '));
    setFormIsBestSeller(!!product.isBestSeller);
    setFormIsNew(!!product.isNew);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!isOwner) return;
    if (window.confirm(`Are you sure you want to delete "${name}" from the boutique catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    // Parse images
    const imagesArray = formImages
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (imagesArray.length === 0) {
      imagesArray.push(
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
      );
    }

    // Parse colors
    const colorsArray: ProductColor[] = formColors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const parts = pair.split(':');
        return {
          name: parts[0]?.trim() || 'Color',
          hex: parts[1]?.trim() || '#C05621',
        };
      });

    // Parse sizes
    const sizesArray = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Initial stock mapping if new sizes added
    const initialStock: Record<string, number> = editingProduct ? { ...editingProduct.stock } : {};
    sizesArray.forEach((sz) => {
      if (initialStock[sz] === undefined) {
        initialStock[sz] = 6;
      }
    });

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName,
        category: formCategory,
        price: formPrice,
        mrp: formMrp,
        description: formDescription,
        fabric: formFabric,
        care: formCare,
        images: imagesArray,
        colors: colorsArray.length > 0 ? colorsArray : [{ name: 'Standard', hex: '#C05621' }],
        sizes: sizesArray.length > 0 ? sizesArray : ['Free Size'],
        stock: initialStock,
        isBestSeller: formIsBestSeller,
        isNew: formIsNew,
      };
      updateProduct(updated);
    } else {
      addProduct({
        slug,
        name: formName,
        category: formCategory,
        price: formPrice,
        mrp: formMrp,
        description: formDescription,
        fabric: formFabric,
        care: formCare,
        images: imagesArray,
        colors: colorsArray.length > 0 ? colorsArray : [{ name: 'Standard', hex: '#C05621' }],
        sizes: sizesArray.length > 0 ? sizesArray : ['Free Size'],
        stock: initialStock,
        rating: 4.8,
        reviewCount: 95,
        isBestSeller: formIsBestSeller,
        isNew: formIsNew,
      });
    }

    setIsModalOpen(false);
  };

  // Auto-calculated discount percent
  const computedDiscount =
    formMrp > formPrice ? Math.round(((formMrp - formPrice) / formMrp) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-ivory-400">
        <div>
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-0.5">
            Boutique Ensembles ({products.length})
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            All additions and modifications sync immediately with the live customer catalog.
          </p>
        </div>

        {isOwner ? (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="touch-tap-target px-4 py-2.5 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 transition-colors flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ensemble</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded border border-amber-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Role: Catalog edits are read-only</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-ivory rounded-lg border border-ivory-400 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ensemble name, category or ID..."
            className="w-full bg-ivory-100 border border-ivory-400 rounded pl-9 pr-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:border-terracotta"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-ivory-100 border border-ivory-400 text-ink text-xs sm:text-sm rounded px-3 py-2 focus:outline-none focus:border-terracotta font-medium"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-ivory rounded-xl border border-ivory-400 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-ivory-200 text-ink-700 font-serif border-b border-ivory-400">
                <th className="py-3 px-4">Ensemble</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Sizes & Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-300">
              {filteredProducts.map((p) => {
                const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
                const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

                return (
                  <tr key={p.id} className="hover:bg-ivory-100 transition-colors">
                    {/* Ensemble info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-11 h-14 object-cover rounded aspect-[4/5] border border-ivory-300 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-medium text-ink text-sm sm:text-base block">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-ink-400 uppercase tracking-wider">
                            ID: {p.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-xs bg-ivory-300 px-2 py-0.5 rounded font-medium text-ink">
                        {p.category}
                      </span>
                    </td>

                    {/* Price / MRP */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-ink block">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-ink-400 line-through">
                          ₹{p.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-terracotta font-semibold ml-1">
                          ({discount}% OFF)
                        </span>
                      </div>
                    </td>

                    {/* Sizes & Stock */}
                    <td className="py-3 px-4">
                      <div>
                        <span
                          className={`font-semibold text-xs ${
                            totalStock === 0
                              ? 'text-red-700'
                              : totalStock <= 5
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {totalStock === 0 ? 'Out of Stock' : `${totalStock} units available`}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.sizes.map((s) => (
                            <span
                              key={s}
                              className={`text-[10px] px-1.5 py-0.2 rounded border ${
                                (p.stock[s] ?? 0) === 0
                                  ? 'border-red-300 text-red-600 bg-red-50'
                                  : 'border-ivory-400 bg-ivory-200 text-ink'
                              }`}
                            >
                              {s}: {p.stock[s] ?? 0}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          to={`/owner/products/${p.id}/stock`}
                          className="touch-tap-target p-1.5 text-ink-600 hover:text-terracotta transition-colors"
                          title="Manage Stock"
                        >
                          <Boxes className="w-4 h-4" />
                        </Link>

                        {isOwner && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="touch-tap-target p-1.5 text-ink-600 hover:text-ink-900 transition-colors"
                              title="Edit Ensemble"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.name)}
                              className="touch-tap-target p-1.5 text-ink-400 hover:text-red-600 transition-colors"
                              title="Delete Ensemble"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT / ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink-900/60"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-ivory rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-ivory-400 z-10 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-400">
              <h3 className="font-serif text-xl font-medium text-ink">
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Ensemble'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-ink-500 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Ensemble Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Rohini Chanderi Silk Saree"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Category)}
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-ink">Original MRP (₹)</label>
                    <span className="text-[11px] text-terracotta font-bold">
                      {computedDiscount}% Discount
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min={formPrice}
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Fabric & Weave</label>
                <input
                  type="text"
                  required
                  value={formFabric}
                  onChange={(e) => setFormFabric(e.target.value)}
                  placeholder="e.g. 100% Handloom Cotton Mulmul"
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Care Instructions</label>
                <input
                  type="text"
                  required
                  value={formCare}
                  onChange={(e) => setFormCare(e.target.value)}
                  placeholder="e.g. Gentle cold hand wash, dry in shade"
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">
                  Image URLs (1 per line, 4:5 aspect ratio)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formImages}
                  onChange={(e) => setFormImages(e.target.value)}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink font-mono text-xs focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">
                    Colors (Format: Name:#HEX, Name:#HEX)
                  </label>
                  <input
                    type="text"
                    required
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Maroon:#6b1724, Ivory:#FBF7F0"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink">
                    Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="Free Size OR S, M, L, XL"
                    className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink">Boutique Description</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-ivory-100 border border-ivory-400 rounded px-3 py-2 text-ink focus:outline-none focus:border-terracotta"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="accent-terracotta"
                  />
                  <span>Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="accent-terracotta"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-ivory-400 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-ivory-400 text-xs text-ink hover:bg-ivory-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-600 shadow"
                >
                  Save Ensemble
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
