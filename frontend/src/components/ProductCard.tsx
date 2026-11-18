import React from 'react';
import { ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StarRating } from './StarRating';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectProduct?.(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent && discountPercent > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-500 text-white rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.is_new && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white rounded-full shadow-sm">
              New
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-white rounded-full shadow-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Action Buttons Floating Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isWished
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
          >
            <Heart size={16} className={isWished ? 'fill-rose-500' : ''} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              title="Quick view"
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
            >
              <Eye size={16} />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-slate-900 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-indigo-600 uppercase tracking-wider">{product.category}</span>
          <span>{product.brand}</span>
        </div>

        <h3
          onClick={() => onSelectProduct?.(product)}
          className="font-semibold text-slate-800 text-sm line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug mb-2"
        >
          {product.name}
        </h3>

        <div className="mb-3">
          <StarRating rating={product.rating} reviewCount={product.review_count} showText={true} />
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <Check size={12} /> In stock ({product.stock})
            </p>
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-indigo-600 text-white shadow hover:shadow-indigo-500/25 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
