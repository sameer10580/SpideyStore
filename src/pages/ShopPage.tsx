import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    let result = products.filter((p: any) => 
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || p.category === category)
    );

    if (sortBy === 'price-low') result.sort((a: any, b: any) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a: any, b: any) => b.price - a.price);

    setFilteredProducts(result);
  }, [search, category, sortBy, products]);

  const categories = ['All', ...new Set(products.map((p: any) => p.category))];

  return (
    <div className="pt-24 pb-20 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">THE ARMORY</h1>
          <p className="text-gray-400">Equip yourself with the best gear from across the multiverse.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-red-600 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none pl-6 pr-12 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-6 pr-12 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-red-600 transition-colors cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
