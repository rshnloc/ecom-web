import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onViewProduct?: (productId: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onViewProduct,
}) => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);
    setCouponMsg(null);
    const result = await applyCoupon(couponInput.trim());
    setLoadingCoupon(false);
    if (result.success) {
      setCouponMsg({ text: result.message, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: result.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-800">Your Shopping Cart</h2>
              <span className="bg-indigo-50 text-indigo-600 font-bold text-xs px-2.5 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Explore our test catalog and discover premium audio, gear, and workstation upgrades.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 group hover:border-slate-200 transition-colors"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onViewProduct?.(item.product_id);
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4
                        className="font-semibold text-xs text-slate-800 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => {
                          setIsDrawerOpen(false);
                          onViewProduct?.(item.product_id);
                        }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold text-slate-900 mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
              {/* Promo code input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo code (try SAVE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingCoupon}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>

                {couponMsg && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponMsg.error ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}

                {coupon && coupon.valid && (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-medium">
                    <span>Applied: {coupon.code} (-${discountAmount.toFixed(2)})</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-rose-600 font-bold ml-2"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-[11px]">
                        Free (Over $100)
                      </span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (7%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Simulated Test Gateway • Zero Real Cards Charged</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
