import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Shield, Truck, RotateCcw, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { formatPrice } from '@/lib/utils';
import { useAuthStore, useCartStore } from '@/store';
import toast from 'react-hot-toast';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Product not found');
        navigate('/shop');
      });
  }, [id, navigate]);

  const handleAddToCart = async () => {
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
        body: JSON.stringify({ product_id: product.id, quantity })
      });

      if (res.ok) {
        addItem({
          id: Math.random(),
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url
        });
        toast.success('Added to cart!');
      }
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Spider className="w-12 h-12 text-red-600 animate-pulse" /></div>;

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/10"
          >
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="text-sm font-black text-red-600 uppercase tracking-[0.2em] mb-4 block">{product.category}</span>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-600")} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">({product.reviews_count} Reviews)</span>
              </div>
            </div>

            <p className="text-4xl font-black text-white mb-8">{formatPrice(product.price)}</p>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              {product.description || "Experience the ultimate web-slinging adventure with this premium gear. Crafted with precision and inspired by the legendary hero, this item is a must-have for any true fan."}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-zinc-900 rounded-2xl border border-white/10 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center text-xl font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-5 bg-red-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-all transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Armory
                </button>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-white/10">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5">
                <Shield className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Authentic Gear</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5">
                <Truck className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5">
                <RotateCcw className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Spider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v10M12 12l-4 4M12 12l4 4M12 12l-4-4M12 12l4-4M12 12H4M12 12h8M8 2l4 4M16 2l-4 4M8 22l4-4M16 22l-4-4" />
    </svg>
  );
}
