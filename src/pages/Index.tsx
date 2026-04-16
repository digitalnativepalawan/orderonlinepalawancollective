import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

export default function Index() {
  const { products, adminMode } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // Filter products - only show available products with stock
  const filtered = useMemo(() => {
    let list = products.filter(p => p.isAvailable === true && p.inventory > 0);
    
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== 'all') {
      list = list.filter(p => p.category === category);
    }
    
    return list;
  }, [products, search, category]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          JayCee Trading & Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Supporting local farmers and artisans in Palawan through fresh, 
          organic products delivered straight to your door.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
          {adminMode && (
            <p className="text-sm text-muted-foreground mt-2">
              Admin tip: Check that products are marked as "Available" in the admin panel.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
