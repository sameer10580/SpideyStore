import { motion } from 'motion/react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '@/store';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-red-600 rounded-lg group-hover:rotate-12 transition-transform">
              <SpiderIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">SPIDEY<span className="text-red-600">STORE</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Shop</Link>
            <Link to="/categories" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Categories</Link>
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    {user.name[0]}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Dashboard</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5">Admin Panel</Link>}
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}
            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-zinc-900 border-b border-white/10"
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          <Link to="/shop" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-red-500">Shop</Link>
          <Link to="/categories" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-red-500">Categories</Link>
          <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-red-500">About</Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-red-500">Contact</Link>
        </div>
      </motion.div>
    </nav>
  );
}

function SpiderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v10M12 12l-4 4M12 12l4 4M12 12l-4-4M12 12l4-4M12 12H4M12 12h8M8 2l4 4M16 2l-4 4M8 22l4-4M16 22l-4-4" />
    </svg>
  );
}
