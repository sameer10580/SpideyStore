import { useCartStore, useAuthStore } from '@/store';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export function CartPage() {
  const { items, setItems, removeItem } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setItems(data));
    }
  }, [token, setItems]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        removeItem(id);
        toast.success('Item removed');
      }
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-black flex flex-col items-center justify-center px-4">
        <div className="p-8 bg-zinc-900 rounded-[3rem] border border-white/10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-gray-400 mb-8">Looks like you haven't added any gear to your armory yet.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-white mb-12 tracking-tight">YOUR ARMORY</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-red-500 font-bold mb-4">{formatPrice(item.price)}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center bg-black rounded-xl border border-white/10 p-1">
                      <button className="p-2 text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                      <span className="w-10 text-center text-white font-bold">{item.quantity}</span>
                      <button className="p-2 text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-2xl font-black text-white">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-8">ORDER SUMMARY</h2>
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
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-red-500">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-gray-500 text-xs mt-6">
                Taxes calculated at checkout. Free shipping on orders over $100.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
