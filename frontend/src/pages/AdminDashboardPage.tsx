import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { Product, Order, DashboardStats } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, isAdmin, quickLogin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics'>('inventory');
  const [loading, setLoading] = useState(true);

  // New product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Audio & Electronics');
  const [newProdBrand, setNewProdBrand] = useState('ApexLab');
  const [newProdPrice, setNewProdPrice] = useState(199.99);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState(
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
  );

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [dashStats, prods, ords] = await Promise.all([
        api.getDashboardStats(),
        api.getProducts(),
        api.getOrders(),
      ]);
      setStats(dashStats);
      setProducts(prods);
      setOrders(ords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim()) return;

    try {
      await api.createProduct({
        name: newProdName.trim(),
        category: newProdCategory,
        brand: newProdBrand,
        price: Number(newProdPrice),
        stock: Number(newProdStock),
        description: newProdDesc.trim(),
        image_url: newProdImg,
        is_featured: true,
        is_new: true,
      });
      setShowAddModal(false);
      setNewProdName('');
      setNewProdDesc('');
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this test product?')) return;
    try {
      await api.deleteProduct(id);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStock = async (id: number, delta: number, current: number) => {
    const newStock = Math.max(0, current + delta);
    try {
      await api.updateProduct(id, { stock: newStock });
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
              <Shield size={14} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Administrative Control Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Store Operations & Metrics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-white">{user?.full_name || 'Admin Tester'}</strong> • Synthetic Sandbox Mode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-colors"
          >
            <Plus size={15} />
            <span>Add Test Product</span>
          </button>
          <button
            onClick={loadAdminData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            ${stats?.total_revenue?.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Simulated Gross</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {stats?.total_orders || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Orders recorded in SQLite</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">Catalog SKUs</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {stats?.total_products || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active items in catalog</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span className="font-semibold text-slate-600 uppercase tracking-wider">Low Stock</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-display">
            {stats?.low_stock_count || 0}
          </div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">&le; 15 units remaining</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Order Dispatcher ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Category Metrics
        </button>
      </div>

      {/* Tab 1: Product Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate max-w-xs">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(p.id, -5, p.stock)}
                          className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-600"
                        >
                          -
                        </button>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            p.stock <= 5
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 15
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(p.id, 5, p.stock)}
                          className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded font-bold text-slate-600"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      ★ {p.rating} ({p.review_count})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Dispatcher */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {o.order_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{o.customer_name}</p>
                      <p className="text-[11px] text-slate-400">{o.customer_email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {o.shipping_address?.city}, {o.shipping_address?.state}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Category Distribution
            </h3>
            <div className="space-y-3">
              {stats.category_distribution.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-slate-400">{cat.count} items (Avg ${cat.avg_price})</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (cat.count / stats.total_products) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 font-display">
              Architecture & Security Compliance
            </h3>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100">
                <strong>Zero Credentials Required:</strong> All authentication sessions use local deterministic mock tokens. Zero external auth providers, private API keys, or live payment keys exist in this codebase.
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-900 rounded-xl border border-indigo-100">
                <strong>No Docker Overhead:</strong> Runs directly via standard Python 3 `uvicorn` and Node.js `vite`. Database is a standalone zero-config SQLite file.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Add New Test Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Ultra Wireless Mouse"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="Audio & Electronics">Audio & Electronics</option>
                    <option value="Computing & Gaming">Computing & Gaming</option>
                    <option value="Smart Living">Smart Living</option>
                    <option value="Workstation & Desk">Workstation & Desk</option>
                    <option value="Apparel & Everyday Carry">Apparel & Everyday Carry</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={newProdImg}
                  onChange={(e) => setNewProdImg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Overview of specifications and design..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
