import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Header = () => {
  const { getCartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Shop', to: '/search' },
    { label: 'Adidas', to: '/search' },
    { label: 'Puma', to: '/search' },
    { label: 'New Balance', to: '/search' },
  ];

  return (
    <header className="bg-fz-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <Logo size="md" theme="dark" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                className="text-white/70 hover:text-fz-green text-sm font-semibold uppercase tracking-wider transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 text-white/80 hover:text-fz-green transition-colors duration-200"
            >
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-fz-green text-fz-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-white/80 hover:text-white transition md:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-fz-gray border-t border-white/10 px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-white/80 hover:text-fz-green font-semibold uppercase tracking-wider text-sm py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="block text-white/80 hover:text-fz-green font-semibold uppercase tracking-wider text-sm py-2 transition-colors"
          >
            Cart {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
