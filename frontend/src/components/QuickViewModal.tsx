import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Check, Star, Shield, RotateCcw, Truck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StarRating } from './StarRating';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewDetails: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewDetails,
}) => {
  if (!product) return null;

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImg, setSelectedImg] = useState(product.image_url);
  const [quantity, setQuantity] = useState(1);
  const isWished = isInWishlist(product.id);

  const images = [product.image_url, ...(product.gallery || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow transition-colors"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Section */}
            <div className="p-6 bg-slate-50 flex flex-col justify-between">
              <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-sm mb-4">
                <img
                  src={selectedImg}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImg === img
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span>{product.brand}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={product.rating} showText reviewCount={product.review_count} />
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check size={12} /> {product.stock} Units in stock
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Features Highlights */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-1.5 mb-6">
                    {product.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check size={14} className="text-indigo-600 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <div className="flex items-center bg-slate-100 rounded-xl px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-2 py-1 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      addItem(product, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow hover:shadow-indigo-500/25 transition-all"
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-xl border transition-all ${
                      isWished
                        ? 'border-rose-200 bg-rose-50 text-rose-500'
                        : 'border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-slate-50'
                    }`}
                  >
                    <Heart size={18} className={isWished ? 'fill-rose-500' : ''} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onViewDetails(product);
                  }}
                  className="w-full text-center text-xs text-indigo-600 hover:text-indigo-800 font-semibold py-1 transition-colors"
                >
                  View full product specifications & reviews &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
