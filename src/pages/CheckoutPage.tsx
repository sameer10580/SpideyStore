import React, { useState } from 'react';
import { useCartStore, useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          total_amount: total,
          address: '123 Spidey Lane, Queens, NY', // Mock address
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }))
        })
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
        toast.success('Order placed successfully!');
      }
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black flex flex-col items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-12 bg-zinc-900 rounded-[3rem] border border-white/10 text-center max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">ORDER CONFIRMED!</h1>
          <p className="text-gray-400 mb-10 text-lg">Your gear is being prepared for web-speed delivery. Check your dashboard for updates.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-white mb-12 tracking-tight">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
            <section className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Shipping Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-red-600 outline-none" defaultValue={user?.name.split(' ')[0]} />
                <input type="text" placeholder="Last Name" className="p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-red-600 outline-none" defaultValue={user?.name.split(' ')[1]} />
                <input type="text" placeholder="Address" className="md:col-span-2 p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-red-600 outline-none" />
                <input type="text" placeholder="City" className="p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-red-600 outline-none" />
                <input type="text" placeholder="Zip Code" className="p-4 bg-black/50 border border-white/10 rounded-xl text-white focus:border-red-600 outline-none" />
              </div>
            </section>

            <section className="p-8 bg-zinc-900/50 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-red-600/10 border border-red-600/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-4 border-red-600" />
                    <span className="text-white font-bold">Credit / Debit Card</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-white/20 rounded" />
                    <div className="w-8 h-5 bg-white/20 rounded" />
                  </div>
                </div>
                <div className="p-4 bg-black/50 border border-white/10 rounded-xl flex items-center gap-3 opacity-50">
                  <div className="w-4 h-4 rounded-full border border-gray-600" />
                  <span className="text-gray-400 font-bold">PayPal (Coming Soon)</span>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-12">
            <div className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-8">YOUR ORDER</h2>
              <div className="max-h-64 overflow-y-auto mb-8 space-y-4 pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/5">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-2xl font-black">
                  <span className="text-white">Total</span>
                  <span className="text-red-500">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Purchase'}
                <ShieldCheck className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
