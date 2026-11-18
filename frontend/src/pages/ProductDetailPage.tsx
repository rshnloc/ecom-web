import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  Share2,
  Send
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StarRating } from '../components/StarRating';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product: initialProduct,
  onNavigate,
  onQuickView,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImage, setSelectedImage] = useState<string>(initialProduct.image_url);
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Review form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(product.id);

  // When initialProduct changes
  useEffect(() => {
    setProduct(initialProduct);
    setSelectedImage(initialProduct.image_url);
    setQuantity(1);

    // Fetch live product, reviews & related
    async function loadData() {
      try {
        const [liveProd, revs, related] = await Promise.all([
          api.getProduct(initialProduct.id),
          api.getProductReviews(initialProduct.id),
          api.getProducts({ category: initialProduct.category }),
        ]);
        setProduct(liveProd);
        setReviews(revs);
        setRelatedProducts(related.filter((p) => p.id !== initialProduct.id).slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialProduct.id]);

  const images = [product.image_url, ...(product.gallery || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const added = await api.addReview(product.id, {
        user_name: newReviewAuthor.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
      });
      setReviews([added, ...reviews]);
      setNewReviewAuthor('');
      setNewReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
      // Refresh product for updated rating
      const updated = await api.getProduct(product.id);
      setProduct(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-600 transition-colors">
          Home
        </button>
        <ChevronRight size={12} />
        <button onClick={() => onNavigate('shop')} className="hover:text-indigo-600 transition-colors">
          Catalog
        </button>
        <ChevronRight size={12} />
        <button
          onClick={() => onNavigate('shop', { category: product.category })}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category}
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner relative group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {product.is_new && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow">
                New Arrival
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="font-medium text-slate-500">Brand: {product.brand}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3 font-display">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <StarRating rating={product.rating} reviewCount={product.review_count} showText={true} />
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Check size={14} />
                {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div className="py-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 font-display">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    Save ${(product.original_price - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {product.long_description || product.description}
            </p>

            {/* Key Feature Bullets */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Capabilities
                </h4>
                {product.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchasing Actions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity */}
              <div className="flex items-center bg-slate-100 rounded-xl px-3 py-2 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-slate-700 font-bold hover:text-indigo-600"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-2 text-slate-700 font-bold hover:text-indigo-600"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addItem(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${
                  isWished
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart size={20} className={isWished ? 'fill-rose-500' : ''} />
              </button>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <Truck size={16} className="text-indigo-600" />
                <span>Simulated Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw size={16} className="text-emerald-600" />
                <span>30-Day Test Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>Zero Real Charges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-display">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(product.specs).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <span className="font-semibold text-slate-600">{k}</span>
                <span className="font-bold text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews & Feedback Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified synthetic community feedback for {product.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
            <StarRating rating={product.rating} maxStars={5} size={16} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-6">
                No customer reviews yet. Be the first to leave test feedback below!
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-800">{rev.user_name}</span>
                      {rev.verified_purchase && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                          Verified Test Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {rev.created_at ? rev.created_at.slice(0, 10) : 'Recent'}
                    </span>
                  </div>
                  <StarRating rating={rev.rating} size={12} />
                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Leave a Review Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 h-fit">
            <h4 className="font-bold text-sm text-slate-800">Add a Test Review</h4>
            <form onSubmit={handleAddReview} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Your Synthetic Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charlie Tester"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectation</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Feedback</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share your thoughts on build quality, audio profile, or design..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <Send size={14} />
                <span>{submittingReview ? 'Submitting...' : 'Post Test Review'}</span>
              </button>

              {reviewSuccess && (
                <p className="text-xs font-medium text-emerald-600 text-center">
                  Review submitted and added to database!
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-display">Related Hardware</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onSelectProduct={(prod) => onNavigate('product-detail', prod)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
