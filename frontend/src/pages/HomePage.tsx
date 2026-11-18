import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Zap,
  Tag,
  CheckCircle2,
  Layers,
  Award,
  Headphones,
  Laptop,
  Home,
  Monitor
} from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, featured, news] = await Promise.all([
          api.getCategories(),
          api.getProducts({ featured: true }),
          api.getProducts({ is_new: true }),
        ]);
        setCategories(cats);
        setFeaturedProducts(featured.slice(0, 4));
        setNewArrivals(news.slice(0, 4));
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-900/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80")',
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 lg:py-28 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 w-fit mb-6">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Next-Gen Audio & Workstation Hardware</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-2xl font-display leading-[1.1] mb-6">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">Pure Precision</span> and Performance.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed mb-8">
            Experience our flagship ANC headphones, CNC-machined mechanical keyboards, and 4K curved displays. Clean architecture, high responsiveness, and zero real credentials required.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <ShoppingBag size={16} />
              <span>Explore Entire Catalog</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('shop', { category: 'Workstation & Desk' })}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Workstation Upgrades
            </button>
          </div>

          {/* Quick test stats */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl text-left">
            <div>
              <p className="text-2xl font-extrabold text-white font-display">12+</p>
              <p className="text-xs text-slate-400">Curated Test Items</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white font-display">FastAPI</p>
              <p className="text-xs text-slate-400">Python 3.10 Backend</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white font-display">React 18</p>
              <p className="text-xs text-slate-400">TypeScript + Vite</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white font-display">0 Docker</p>
              <p className="text-xs text-slate-400">Zero Setup Friction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Browse Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            All Categories &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.name })}
              className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {cat.name.includes('Audio') && <Headphones size={22} />}
                {cat.name.includes('Gaming') && <Laptop size={22} />}
                {cat.name.includes('Living') && <Home size={22} />}
                {cat.name.includes('Desk') && <Monitor size={22} />}
                {cat.name.includes('Apparel') && <Layers size={22} />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{cat.item_count} items</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Featured Flagships
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View More &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onSelectProduct={(prod) => onNavigate('product-detail', prod)}
            />
          ))}
        </div>
      </section>

      {/* Promo Coupon Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Zap size={14} /> Instant Simulated Discount
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              Take 10% Off Your Entire Test Order
            </h3>
            <p className="text-indigo-200 text-xs sm:text-sm">
              Use code <strong className="text-white underline">SAVE10</strong> at checkout on orders over $50. Or use <strong className="text-white underline">TEST20</strong> for 20% off orders over $100.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl font-mono text-sm tracking-wider font-bold flex items-center gap-3">
              <Tag size={16} className="text-emerald-400" />
              <span>SAVE10</span>
            </div>
            <button
              onClick={() => handleCopyCoupon('SAVE10')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              {copiedCoupon ? 'Copied Code!' : 'Copy Code'}
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Fresh Drops
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Explore All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onSelectProduct={(prod) => onNavigate('product-detail', prod)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
