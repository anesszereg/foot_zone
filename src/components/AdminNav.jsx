import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const links = [
    { label: 'Dashboard', to: '/admin/dashboard', Icon: LayoutDashboard },
    { label: 'Orders',    to: '/admin/orders',    Icon: Package },
    { label: 'Products',  to: '/admin/products',  Icon: ShoppingCart },
  ];

  const isActive = (to) => location.pathname.startsWith(to);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="text-xl font-bold tracking-tight">
              Foot Zone <span className="text-fz-green">Admin</span>
            </Link>
            <div className="hidden md:flex gap-1">
              {links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive(to)
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 text-gray-600 hover:text-black transition rounded-lg"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-gray-50 border-t px-4 py-3 space-y-1">
          {links.map(({ label, to, Icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition ${
                isActive(to)
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
