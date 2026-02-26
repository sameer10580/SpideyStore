import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shirt, Watch, ToyBrick, Image as ImageIcon, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Clothing', icon: Shirt, count: 12, color: 'bg-red-600', image: 'https://picsum.photos/seed/cat1/800/600' },
  { name: 'Accessories', icon: Watch, count: 8, color: 'bg-blue-600', image: 'https://picsum.photos/seed/cat2/800/600' },
  { name: 'Toys', icon: ToyBrick, count: 15, color: 'bg-zinc-800', image: 'https://picsum.photos/seed/cat3/800/600' },
  { name: 'Posters', icon: ImageIcon, count: 20, color: 'bg-red-900', image: 'https://picsum.photos/seed/cat4/800/600' },
];

export function CategoriesPage() {
  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">CATEGORIES</h1>
          <p className="text-gray-400">Explore gear from every corner of the multiverse.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-80 rounded-[2.5rem] overflow-hidden border border-white/10"
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", cat.color)}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">{cat.name.toUpperCase()}</h3>
                <p className="text-gray-400 mb-6">{cat.count} Items Available</p>
                <Link 
                  to={`/shop?category=${cat.name}`}
                  className="inline-flex items-center gap-2 text-white font-bold group/btn"
                >
                  Explore Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
