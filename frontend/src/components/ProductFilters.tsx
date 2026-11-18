import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category } from '../types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <SlidersHorizontal size={18} className="text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          Categories
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Products</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.name)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                selectedCategory === c.name
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {c.item_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-xs font-semibold text-indigo-600">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="800"
          step="25"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$0</span>
          <span>$400</span>
          <span>$800+</span>
        </div>
      </div>

      {/* In Stock Only */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-xs font-medium text-slate-700">In Stock Items Only</span>
        </label>
      </div>

      {/* Sort By Mobile/Compact */}
      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );
};
