import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Plus, Trash2, Edit, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export function AdminPanel() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Total Sales', value: '$12,450', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Orders', value: '156', icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Active Users', value: '1,240', icon: Users, color: 'text-purple-500' },
    { label: 'Inventory', value: products.length.toString(), icon: Package, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight">ADMIN COMMAND CENTER</h1>
          <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all">
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 bg-zinc-900/50 border border-white/10 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Product Management Table */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Inventory Management</h2>
            <div className="text-sm text-gray-500">Showing {products.length} products</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className="px-8 py-4">Product</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black border border-white/10">
                          <img src={product.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-white font-bold">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-red-600/10 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-600/30">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-white font-bold">{formatPrice(product.price)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", product.stock > 5 ? "bg-green-500" : "bg-red-500")} />
                        <span className="text-white font-medium">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 bg-red-600/10 hover:bg-red-600/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
