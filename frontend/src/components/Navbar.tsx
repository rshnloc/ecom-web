import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Shield,
  Package,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product } from '../types';

interface NavbarProps {
  onNavigate: (page: string, data?: any) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, quickLogin, isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await api.getProducts({ search: searchQuery.trim() });
        setSearchResults(results.slice(0, 5));
      } catch (e) {
        setSearchResults([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    onNavigate('product-detail', product);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Test Environment Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Sparkles size={12} />
          Synthetic Store Simulation
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-400">
          No real credentials or PII used. Try test promo code: <strong className="text-white">SAVE10</strong>
        </span>
        <span className="hidden md:inline text-slate-500">•</span>
        <span className="hidden md:inline text-slate-400">Zero charges • Free shipping over $100</span>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag size={18} />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
                  APEX<span className="text-indigo-600 font-light">STORE</span>
                </span>
                <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-1">
                  Synthetic E-Com
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === 'home'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === 'shop'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Shop Catalog
              </button>
              <button
                onClick={() => onNavigate('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === 'orders'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Track Orders
              </button>
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                    currentPage === 'admin'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Shield size={13} />
                  Admin Portal
                </button>
              )}
            </nav>
          </div>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-md relative hidden sm:block">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search headphones, keyboards, 4K displays..."
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-indigo-500 rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 overflow-hidden">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Quick Results
                </div>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {product.category} • ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowSearchDropdown(false);
                      onNavigate('shop');
                    }}
                    className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1"
                  >
                    View all catalog results &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Icon */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-full relative transition-colors"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full relative transition-colors"
              title="Cart"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Quick Login Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-medium text-slate-800"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.full_name.charAt(0)}
                  </div>
                  <span className="hidden lg:inline">{user.full_name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
                >
                  <User size={15} />
                  <span>Test Login</span>
                  <ChevronDown size={13} />
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user.full_name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                          Role: {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('orders');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Package size={14} className="text-slate-400" />
                          My Order History
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              onNavigate('admin');
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-purple-700 font-semibold hover:bg-purple-50 flex items-center gap-2"
                          >
                            <Shield size={14} className="text-purple-600" />
                            Admin Dashboard
                          </button>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">Quick Test Accounts</p>
                        <p className="text-[11px] text-slate-400">
                          One-click instant login with synthetic test roles:
                        </p>
                      </div>
                      <div className="p-2 space-y-1.5">
                        <button
                          onClick={() => {
                            quickLogin('customer');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Demo Customer</span>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              Shopper
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Browse, cart, coupons & checkout
                          </p>
                        </button>

                        <button
                          onClick={() => {
                            quickLogin('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Demo Administrator</span>
                            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                              Admin
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Manage stock, orders & analytics
                          </p>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/80 space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              My Orders
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50"
              >
                Admin Dashboard
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
