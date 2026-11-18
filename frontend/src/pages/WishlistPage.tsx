import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface WishlistPageProps {
  onNavigate: (page: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onQuickView }) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product: Product) => {
    addItem(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
          <Heart size={20} className="fill-rose-500" />
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-400 mx-auto">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any product in the catalog to save it to your wishlist.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all"
            >
              <div
                className="aspect-square relative bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => onNavigate('product-detail', product)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-full hover:bg-white shadow"
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h4
                    onClick={() => onNavigate('product-detail', product)}
                    className="font-bold text-xs text-slate-800 line-clamp-2 hover:text-indigo-600 cursor-pointer mt-1"
                  >
                    {product.name}
                  </h4>
                  <p className="text-sm font-extrabold text-slate-900 mt-2">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
