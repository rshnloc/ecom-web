import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Search, X, Grid, RotateCcw } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';

interface ShopPageProps {
  initialCategory?: string;
  onNavigate: (page: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  onNavigate,
  onQuickView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 800]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function loadFilteredProducts() {
      setLoading(true);
      try {
        const prods = await api.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          max_price: priceRange[1],
          in_stock_only: inStockOnly,
          search: searchTerm || undefined,
          sort_by: sortBy || undefined,
        });
        setProducts(prods);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    const debounce = setTimeout(loadFilteredProducts, 150);
    return () => clearTimeout(debounce);
  }, [selectedCategory, priceRange, inStockOnly, sortBy, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 800]);
    setInStockOnly(false);
    setSortBy('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Explore Hardware & EDC Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse our full synthetic collection of acoustics, ergonomic peripherals, and smart gear.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-72">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Active Filter Chips & Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-700">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} found
              </span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {priceRange[1] < 800 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                  Under ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 800])}>
                    <X size={12} />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <span className="text-[11px] font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
              >
                <option value="">Default Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-slate-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try expanding your price range, searching for different keywords, or selecting "All Products".
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
              >
                <RotateCcw size={14} />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={onQuickView}
                  onSelectProduct={(prod) => onNavigate('product-detail', prod)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Filter Catalog</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(c) => {
                  setSelectedCategory(c);
                  setMobileFiltersOpen(false);
                }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                inStockOnly={inStockOnly}
                onToggleInStock={setInStockOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onReset={handleResetFilters}
              />
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-6 w-full py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
