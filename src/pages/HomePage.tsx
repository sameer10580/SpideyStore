import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.filter((p: any) => p.is_featured).slice(0, 4)));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/spidey-hero/1920/1080?blur=2"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-red-600/20 border border-red-600/50 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
              New Collection 2026
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tighter">
              BEYOND THE <br />
              <span className="text-red-600">SPIDER-VERSE</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
              Gear up with the most exclusive Spider-Man merchandise. From high-tech suits to limited edition collectibles, we have everything a web-slinger needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all transform hover:scale-105"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/categories"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                View Categories
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-20 top-1/4 hidden lg:block"
        >
          <div className="w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "Web-speed shipping to your doorstep." },
              { icon: Shield, title: "Secure Payment", desc: "Your transactions are protected by Stark Tech." },
              { icon: Truck, title: "Free Shipping", desc: "On all orders over $100 across the multiverse." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-red-500/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-red-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-4">FEATURED GEAR</h2>
              <div className="h-1 w-20 bg-red-600 rounded-full" />
            </div>
            <Link to="/shop" className="text-red-500 font-bold flex items-center gap-2 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Comic Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[3rem] overflow-hidden bg-red-600 p-12 md:p-20">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">JOIN THE <br /> SPIDER-ARMY</h2>
                <p className="text-white/80 text-lg mb-8">Sign up for our newsletter and get 20% off your first order. Plus, exclusive access to limited drops.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 bg-white rounded-xl text-black font-medium focus:outline-none" />
                  <button className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-900 transition-colors">Subscribe</button>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30"
              >
                <Spider className="w-32 h-32 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Spider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2v10M12 12l-4 4M12 12l4 4M12 12l-4-4M12 12l4-4M12 12H4M12 12h8M8 2l4 4M16 2l-4 4M8 22l4-4M16 22l-4-4" />
    </svg>
  );
}
