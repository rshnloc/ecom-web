import React, { useState } from 'react';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Check,
  Tag,
  AlertCircle,
  Lock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShippingAddress, Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigate }) => {
  const { items, subtotal, discountAmount, shippingFee, taxAmount, total, coupon, clearCart } =
    useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState<ShippingAddress>({
    full_name: user?.full_name || 'Alice Demo',
    address_line: '100 Silicon Boulevard, Suite 500',
    city: 'San Francisco',
    state: 'CA',
    postal_code: '94105',
    country: 'United States',
    phone: '+1-555-0199',
  });

  const [email, setEmail] = useState(user?.email || 'testcustomer@example.com');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrefillTestData = () => {
    setAddress({
      full_name: 'Jordan Synthetic',
      address_line: '456 Innovation Parkway, Suite 2B',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'United States',
      phone: '+1-555-0144',
    });
    setEmail('testshopper@example.com');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const orderData = {
        customer_name: address.full_name,
        customer_email: email,
        shipping_address: address,
        items: items.map((i) => ({
          product_id: i.product_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image_url: i.image_url,
          selected_variant: i.selected_variant,
        })),
        coupon_code: coupon?.code || undefined,
        payment_method:
          paymentMethod === 'card'
            ? 'Mock Test Card (ending in 4242)'
            : paymentMethod === 'wallet'
            ? 'Mock Digital Wallet'
            : 'Simulated Cash On Delivery',
      };

      const order = await api.createOrder(orderData);
      clearCart();
      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Simulated Test Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          Zero real transactions or personal data. Pure test environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Step 1: Customer Contact & Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-bold text-base text-slate-900">
                    Shipping Details (Synthetic)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handlePrefillTestData}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Sparkles size={13} />
                  Fill Random Test Data
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Synthetic Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.full_name}
                    onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Synthetic Email (For Test Receipt)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Test Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address_line}
                    onChange={(e) => setAddress({ ...address, address_line: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={address.postal_code}
                      onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900">Delivery Speed</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-indigo-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Standard Test Ground</p>
                      <p className="text-[11px] text-slate-500">3-5 Simulated Business Days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    shippingMethod === 'express'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-purple-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Expedited Air Rush</p>
                      <p className="text-[11px] text-slate-500">1-2 Simulated Days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Included</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Simulated Payment</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Lock size={12} />
                  <span>Sandbox Test Mode</span>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard size={18} />
                  <span>Test Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles size={18} />
                  <span>Mock Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Truck size={18} />
                  <span>Test COD</span>
                </button>
              </div>

              {/* Simulated Card Fields */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Card Information</span>
                    <span className="font-mono text-emerald-600 font-bold">4242 Sandbox</span>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Lock size={16} />
                <span>{isSubmitting ? 'Simulating Payment...' : `Complete Test Order • $${total.toFixed(2)}`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.product_id} className="flex gap-3 text-xs">
                  <img
                    src={i.image_url}
                    alt={i.name}
                    className="w-14 h-14 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{i.name}</p>
                    <p className="text-slate-400 mt-0.5">Qty: {i.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({coupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">Free</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (7%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                <span>Total</span>
                <span className="text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
              <strong>Simulated Guarantee:</strong> This purchase creates a valid tracking record in the local database. You can track this order in the <strong>My Orders</strong> tab or inspect it via the <strong>Admin Portal</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
