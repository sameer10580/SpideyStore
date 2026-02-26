import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store';
import { Package, MapPin, User, Settings, ChevronRight, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'motion/react';

export function DashboardPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-4">
            <div className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] text-center">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl font-black text-white mx-auto mb-6">
                {user?.name[0]}
              </div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
              <div className="inline-block px-4 py-1 rounded-full bg-red-600/10 border border-red-600/50 text-red-500 text-xs font-bold uppercase tracking-widest">
                {user?.role}
              </div>
            </div>

            <nav className="p-4 bg-zinc-900/50 border border-white/10 rounded-[2rem] space-y-2">
              {[
                { icon: Package, label: 'My Orders', active: true },
                { icon: MapPin, label: 'Addresses', active: false },
                { icon: User, label: 'Profile Info', active: false },
                { icon: Settings, label: 'Settings', active: false },
              ].map((item, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl transition-all group",
                    item.active ? "bg-red-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", item.active ? "text-white" : "text-gray-600")} />
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight">MY ORDERS</h1>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-900 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 bg-zinc-900/50 border border-white/10 rounded-[2.5rem] text-center">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-zinc-900/50 border border-white/10 rounded-[2.5rem] hover:border-red-500/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Order #{order.id}</span>
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/30">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-white text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-400 text-sm">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm font-bold mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-white">{formatPrice(order.total_amount)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
