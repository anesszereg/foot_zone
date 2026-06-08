import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { getCartCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            La Selection
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/search" className="hover:text-gray-600 transition-all duration-300">Shoes</Link>
            <Link to="/search" className="hover:text-gray-600 transition-all duration-300">Clothing</Link>
            <Link to="/search" className="hover:text-gray-600 transition-all duration-300">Accessories</Link>
            <Link to="/landing" className="hover:text-gray-600 transition-all duration-300">Landing Page</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 relative">
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 md:hidden">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
