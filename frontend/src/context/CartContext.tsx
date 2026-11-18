import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CouponValidation } from '../types';
import { api } from '../services/api';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariant?: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  subtotal: number;
  itemCount: number;
  coupon: CouponValidation | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('apex_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState<CouponValidation | null>(() => {
    const saved = localStorage.getItem('apex_coupon');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('apex_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('apex_coupon');
    }
  }, [coupon]);

  const addItem = (product: Product, quantity = 1, selectedVariant?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product_id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIndex].quantity + quantity, product.stock);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      } else {
        return [
          ...prev,
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: Math.min(quantity, product.stock),
            selected_variant: selectedVariant,
            stock: product.stock,
          },
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          const max = item.stock || 99;
          return { ...item, quantity: Math.min(quantity, max) };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate discount based on active coupon
  let discountAmount = 0;
  if (coupon && coupon.valid) {
    if (coupon.discount_type === 'percent' && coupon.discount_value) {
      discountAmount = (subtotal * coupon.discount_value) / 100;
    } else if (coupon.discount_type === 'fixed' && coupon.discount_value) {
      discountAmount = Math.min(coupon.discount_value, subtotal);
    }
  }

  // Free shipping over $100 after discount, else $12
  const netBeforeShipping = Math.max(0, subtotal - discountAmount);
  const shippingFee = items.length === 0 || netBeforeShipping >= 100 ? 0 : 12;
  const taxAmount = Math.round(netBeforeShipping * 0.07 * 100) / 100;
  const total = Math.round((netBeforeShipping + shippingFee + taxAmount) * 100) / 100;

  const applyCoupon = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        setCoupon(res);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      return { success: false, message: 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        subtotal,
        itemCount,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
