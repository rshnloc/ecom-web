import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface OrdersPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      setOrders(res);
      if (res.length > 0 && expandedId === null) {
        setExpandedId(res[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAdvanceStatus = async (order: Order) => {
    const sequence: Record<string, 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'> = {
      Processing: 'Shipped',
      Shipped: 'Delivered',
      Delivered: 'Processing',
      Cancelled: 'Processing',
    };
    const nextStatus = sequence[order.status] || 'Processing';
    try {
      await api.updateOrderStatus(order.id, nextStatus);
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Order Tracking & History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status updates and delivery tracking for all test purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search order number..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            onClick={fetchOrders}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-36 border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any test orders yet. Browse the catalog to simulate a purchase.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 font-mono">
                          {order.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Shipped'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Placed on {order.created_at ? order.created_at.slice(0, 16) : 'Recent'} • {order.items.length} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">
                        ${order.total.toFixed(2)}
                      </span>
                      <p className="text-[11px] text-emerald-600 font-medium">Paid via Card</p>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-6">
                    {/* Status Step Indicator */}
                    <div className="bg-white p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-slate-700">Fulfillment Status</span>
                        <button
                          onClick={() => handleAdvanceStatus(order)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg"
                        >
                          <RefreshCw size={11} />
                          Advance State: {order.status} &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div
                          className={`p-2 rounded-lg ${
                            ['Processing', 'Shipped', 'Delivered'].includes(order.status)
                              ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          1. Processing
                        </div>
                        <div
                          className={`p-2 rounded-lg ${
                            ['Shipped', 'Delivered'].includes(order.status)
                              ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          2. Shipped
                        </div>
                        <div
                          className={`p-2 rounded-lg ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          3. Delivered
                        </div>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-slate-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address and Cost Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-bold text-slate-700 block mb-1">
                          Delivery Address
                        </span>
                        <p className="font-semibold text-slate-800">{order.customer_name}</p>
                        <p className="text-slate-500">
                          {order.shipping_address?.address_line || '100 Silicon Blvd'}
                        </p>
                        <p className="text-slate-500">
                          {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
                          {order.shipping_address?.postal_code}
                        </p>
                        <p className="text-slate-400">{order.shipping_address?.phone}</p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span className="font-semibold text-slate-800">
                            ${order.subtotal.toFixed(2)}
                          </span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Discount</span>
                            <span>-${order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500">
                          <span>Shipping</span>
                          <span>
                            {order.shipping_fee === 0 ? 'FREE' : `$${order.shipping_fee.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-100">
                          <span>Total</span>
                          <span className="text-indigo-600">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
