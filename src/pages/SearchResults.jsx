import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Grid, List } from 'lucide-react';
import API_BASE_URL from '../config/api';

const SearchResults = () => {
  const [searchQuery] = useState('Football Gear');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const brands = ['Adidas', 'Puma', 'New Balance'];
  const categories = ['All', 'Shoes', 'Balls', 'Socks', 'Apparel'];
  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = products.filter(product => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const price = product.price;
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];
    const sizeMatch = selectedSizes.length === 0 || product.sizes.some(sizeObj => {
      const size = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
      return selectedSizes.includes(size);
    });
    return brandMatch && categoryMatch && priceMatch && sizeMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory('All');
    setPriceRange([0, 50000]);
    setSelectedSizes([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Search results for "{searchQuery}"</h1>
          <p className="text-gray-600">{sortedProducts.length} Results Found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-300"
          >
            Clear All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-card p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">BRAND</h4>
                {brands.map(brand => (
                  <label key={brand} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 mr-2"
                    />
                    <span className="text-sm">{brand}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      ({products.filter(p => p.brand === brand).length})
                    </span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">CATEGORY</h4>
                {categories.filter(c => c !== 'All').map(cat => (
                  <label key={cat} className="flex items-center mb-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 mr-2"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">PRICE (DZD)</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">SIZE (EU)</h4>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white'}`}
                >
                  <List size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-card overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'flex gap-4' : ''
                  }`}
                >
                  <Link to={`/product/${product._id}`} className={viewMode === 'list' ? 'w-48' : 'block'}>
                    <div className={`relative bg-gray-100 overflow-hidden ${viewMode === 'list' ? 'h-full' : 'aspect-square'}`}>
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                          {product.badge}
                        </span>
                      )}
                      <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all z-10">
                        <Heart size={18} />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                      />
                    </div>
                  </Link>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-gray-600 transition">{product.name}</h3>
                    </Link>
                    <p className="text-2xl font-bold mb-2">{product.price.toLocaleString()} DZD</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                    </div>
                    {viewMode === 'list' && (
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.slice(0, 4).map((sizeObj, idx) => {
                        const size = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-md"
                          >
                            {size}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">No products found matching your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="flex justify-center gap-2 mt-8">
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    page === 1 ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
