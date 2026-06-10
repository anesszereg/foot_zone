import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const brands = [
    {
      name: 'ADIDAS',
      tag: 'CONTRÔLE DE PRÉCISION',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
    },
    {
      name: 'PUMA',
      tag: 'VITESSE EXPLOSIVE',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    },
    {
      name: 'NEW BALANCE',
      tag: 'CONFORT ULTIME',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    },
  ];

  const products = [
    {
      name: 'Adidas X Speedportal',
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
      name: 'Adidas Predator Elite',
      price: '18,900 DZD',
      image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&q=80',
      badge: null,
    },
    {
      name: 'New Balance Furon',
      price: '26,000 DZD',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      badge: 'NEW',
    },
  ];

  const perks = [
    { icon: <Truck size={22} />, title: 'Livraison Gratuite', desc: 'Pour les commandes supérieures à 5 000 DZD' },
    { icon: <Shield size={22} />, title: '100% Authentique', desc: 'Produits officiels des marques' },
    { icon: <Zap size={22} />, title: 'Expédition Rapide', desc: 'Expédié en moins de 24 heures' },
    { icon: <Star size={22} />, title: 'Très bien Noté', desc: '4,9★ basé sur 2 000+ avis' },
  ];

  const ticker = 'FOOT ZONE • ÉQUIPEMENT PREMIUM • TOP MARQUES • PERFORMANCE ÉLITE • ALGÉRIE • ';

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-screen max-h-[90vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-fz-dark/90 via-fz-dark/60 to-transparent" />

        <div className="relative h-full flex items-center px-6 sm:px-12 lg:px-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-fz-green/20 border border-fz-green/40 text-fz-green text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            >
              <Zap size={12} /> Nouvelle Saison 2025
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-black text-white leading-none mb-6"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            >
              FOOT<br />
              <span className="text-fz-green">ZONE</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-white/70 text-lg md:text-xl mb-10 max-w-md leading-relaxed"
            >
              La référence algérienne en crampons de football premium. Conçu pour les joueurs qui dominent chaque match.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-fz-green text-fz-dark px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-fz-neon transition-colors duration-200 inline-flex items-center gap-2"
                >
                  Acheter Maintenant <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:border-white transition-colors duration-200"
                >
                  Voir Tout
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* floating stat */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-12 right-8 md:right-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white hidden md:block"
        >
          <p className="text-3xl font-display font-black text-fz-green">500+</p>
          <p className="text-white/60 text-sm mt-1">Produits Disponibles</p>
        </motion.div>
      </motion.section>

      {/* ── TICKER ── */}
      <div className="bg-fz-green text-fz-dark py-3 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap font-display font-black text-sm uppercase tracking-widest inline-flex"
        >
          {ticker.repeat(6)}
        </motion.div>
      </div>

      {/* ── PERKS ── */}
      <section className="bg-fz-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="text-fz-green mt-0.5 shrink-0">{perk.icon}</div>
              <div>
                <p className="text-white font-bold text-sm">{perk.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 sm:mb-14"
        >
          <div>
            <p className="text-fz-green text-xs font-bold uppercase tracking-widest mb-2">Nos Partenaires</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase">Top Marques</h2>
          </div>
          <Link to="/search" className="inline-flex items-center gap-2 text-sm font-bold hover:text-fz-green transition-colors">
            Voir Tout <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4]"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fz-dark via-fz-dark/30 to-transparent" />
              <div className="absolute inset-0 bg-fz-green/0 group-hover:bg-fz-green/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-fz-green text-xs font-bold uppercase tracking-widest mb-2">{brand.tag}</p>
                <h3 className="font-display font-black text-white text-4xl mb-4">{brand.name}</h3>
                <div className="flex items-center gap-2 text-white/70 text-sm font-semibold group-hover:text-fz-green transition-colors">
                  <span>EXPLORER</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED DROPS ── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 sm:mb-14"
          >
            <div>
              <p className="text-fz-green text-xs font-bold uppercase tracking-widest mb-2">Nouvelles Arrivées</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase">Dernières Sorties</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {product.badge && (
                    <span className={`absolute top-3 left-3 text-white text-xs font-black px-2.5 py-1 rounded-full z-10 ${product.badge === 'HOT' ? 'bg-fz-red' : 'bg-fz-green text-fz-dark'}`}>
                      {product.badge}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{product.name}</h3>
                  <p className="font-display font-black text-xl">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/search">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="bg-fz-dark text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-fz-gray transition-colors inline-flex items-center gap-2"
              >
                Voir Tous les Produits <ArrowRight size={18} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden bg-fz-dark py-16 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-white text-4xl sm:text-5xl md:text-7xl uppercase mb-6 leading-none"
          >
            Prêt à<br /><span className="text-fz-green">Dominer ?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg mb-10"
          >
            Procurez-vous l'équipement en qui les meilleurs joueurs algériens ont confiance. Livraison gratuite disponible.
          </motion.p>
          <Link to="/search">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-fz-green text-fz-dark px-12 py-5 rounded-xl font-black text-base uppercase tracking-wider hover:bg-fz-neon transition-colors duration-200 inline-flex items-center gap-2"
            >
              Acheter la Collection <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
