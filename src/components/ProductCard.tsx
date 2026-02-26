import React from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatPrice } from '@/lib/utils';
import { useCartStore, useAuthStore } from '@/store';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  rating: number;
  reviews_count: number;
}

export function ProductCard({ product }: { product: Product; key?: any }) {
  const { addItem } = useCartStore();
  const { token } = useAuthStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });

      if (res.ok) {
        addItem({
          id: Math.random(), // Temp ID for local state
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url
        });
        toast.success('Added to cart!');
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] overflow-hidden relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform" onClick={handleAddToCart}>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-red-600 transition-colors">
              <Eye className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-gray-400">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-white font-bold truncate mb-2">{product.name}</h3>
          <p className="text-xl font-black text-white">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
