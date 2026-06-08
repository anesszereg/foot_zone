import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';

const LandingPage = () => {
  const brands = [
    {
      name: 'ADIDAS',
      items: '7 Items & 9 Sports',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
    },
    {
      name: 'PUMA',
      items: '7 Items & 9 Sports',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    },
    {
      name: 'NEW BALANCE',
      items: 'Latest & Rare',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    },
  ];

  const products = [
    {
      name: 'Adidas X 18.1 FG/AG',
      price: '14,500 DZD',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80',
      badge: null,
    },
    {
      name: 'Puma Future Ultimate',
      price: '22,000 DZD',
      image: 'https://images.unsplash.com/photo-1628253747716-bc8e0b3c0e0e?w=400&q=80',
      badge: 'HOT',
    },
    {
      name: 'Nike Mercurial Vapor V7 Pro',
      price: '18,900 DZD',
      image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&q=80',
      badge: null,
    },
    {
      name: 'Adidas Predator Elite',
      price: '26,000 DZD',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      badge: 'NEW',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
            >
              LA SÉLECTION
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-xl mb-8 tracking-widest uppercase"
            >
              Premium Football Gear
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-red-700 transition shadow-xl"
            >
              SHOP NOW
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-red-600 text-white py-3 overflow-hidden"
      >
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-sm font-semibold tracking-wider"
        >
          PREMIUM GEAR • TOP BRANDS • LA SÉLECTION • ELITE PERFORMANCE • PREMIUM GEAR • TOP BRANDS • LA SÉLECTION • ELITE PERFORMANCE • PREMIUM GEAR • TOP BRANDS • LA SÉLECTION • ELITE PERFORMANCE •
        </motion.div>
      </motion.div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">TOP BRANDS</h2>
          <p className="text-gray-600 text-lg">Discover our curated selection from the world's best</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-900">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{brand.name}</h3>
                <p className="text-white/80 mb-4">{brand.items}</p>
                <div className="flex items-center text-sm font-semibold">
                  <span>EXPLORE</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition" size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-12"
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2">LATEST DROPS</h2>
              <p className="text-gray-600">Fresh arrivals from the pitch to the streets</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="px-6 py-2 border-2 border-black font-semibold hover:bg-black hover:text-white transition">
                All
              </button>
              <button className="px-6 py-2 border-2 border-gray-300 font-semibold hover:border-black transition">
                NEW
              </button>
              <button className="px-6 py-2 border-2 border-gray-300 font-semibold hover:border-black transition">
                HOT
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4">
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition z-10">
                    <Heart size={18} />
                  </button>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-xl font-bold">{product.price}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-black px-10 py-4 rounded-full font-bold hover:bg-black hover:text-white transition inline-flex items-center gap-2"
            >
              FILTER BY PRODUCT
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
