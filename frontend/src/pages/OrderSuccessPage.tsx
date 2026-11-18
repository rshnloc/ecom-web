import React from 'react';
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  ExternalLink,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order;
  onNavigate: (page: string, data?: any) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Celebration Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle size={36} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-display">
          Thank You! Your Test Order is Confirmed
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          We have generated your synthetic receipt and recorded this order in the SQLite test database.
        </p>

        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 border border-slate-200">
          <span>Order #{order.order_number}</span>
        </div>
      </div>

      {/* Simulated Live Tracking Progress */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm mb-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900">Simulated Fulfillment Timeline</h3>

        <div className="grid grid-cols-4 gap-2 relative">
          {/* Step 1 */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
              <CheckCircle size={18} />
            </div>
            <p className="text-xs font-bold text-slate-800">Order Placed</p>
            <p className="text-[10px] text-slate-400">Recorded</p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
              <CheckCircle size={18} />
            </div>
            <p className="text-xs font-bold text-slate-800">Payment Paid</p>
            <p className="text-[10px] text-slate-400">Sandbox OK</p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow animate-pulse">
              <Package size={18} />
            </div>
            <p className="text-xs font-bold text-indigo-600">Processing</p>
            <p className="text-[10px] text-slate-400">Warehouse Prep</p>
          </div>

          {/* Step 4 */}
          <div className="text-center space-y-2 opacity-50">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
              <Truck size={18} />
            </div>
            <p className="text-xs font-bold text-slate-600">Shipped</p>
            <p className="text-[10px] text-slate-400">Dispatched</p>
          </div>
        </div>
      </div>

      {/* Receipt Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Recipient</p>
            <p className="text-sm font-bold text-slate-800">{order.customer_name}</p>
            <p className="text-xs text-slate-500">{order.customer_email}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Destination</p>
            <p className="text-xs font-bold text-slate-800">
              {order.shipping_address?.address_line || '100 Silicon Boulevard'}
            </p>
            <p className="text-xs text-slate-500">
              {order.shipping_address?.city}, {order.shipping_address?.state}{' '}
              {order.shipping_address?.postal_code}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Payment Summary</p>
            <p className="text-xs font-bold text-slate-800">{order.payment_method}</p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
              Paid Full
            </span>
          </div>
        </div>

        {/* Itemized List */}
        <div className="p-6 divide-y divide-slate-100 space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                />
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-slate-400">Quantity: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total Calculations */}
        <div className="p-6 bg-slate-50/70 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Applied Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span>{order.shipping_fee === 0 ? 'FREE' : `$${order.shipping_fee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Sales Tax (7%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
            <span>Total Paid</span>
            <span className="text-indigo-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('orders')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
        >
          <Package size={16} />
          <span>View All Orders</span>
        </button>

        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Printer size={16} />
          <span>Print Test Receipt</span>
        </button>

        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
