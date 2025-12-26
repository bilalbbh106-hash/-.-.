import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Home, Download, Shirt, Map, Crown, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const categories = [
    { name: 'الاصدارات', icon: <Home />, path: '/category/versions' },
    { name: 'المودات', icon: <Download />, path: '/category/mods' },
    { name: 'الملابس', icon: <Shirt />, path: '/category/skins' },
    { name: 'المابات', icon: <Map />, path: '/category/maps' },
    { name: 'المدفوعة', icon: <Crown />, path: '/category/premium' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-minecraft-dark/90 backdrop-blur-lg border-b-2 border-minecraft-green">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <Link to="/" className="flex items-center space-x-3 space-x-reverse">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-minecraft-green to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-minecraft text-xl">M</span>
              </div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-minecraft-green to-emerald-400 bg-clip-text text-transparent">
                مكتبة المودات العربية
              </h1>
              <p className="text-xs text-gray-400">Minecraft Mods Library</p>
            </div>
          </Link>

          {/* شريط البحث */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مود، خريطة، سكن..."
                className="w-full px-6 py-3 pr-12 bg-gray-900 border-2 border-minecraft-stone rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-minecraft-green transition-all"
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-minecraft-stone hover:text-minecraft-green"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* أقسام التنقل */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="hidden md:flex space-x-2 space-x-reverse">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="flex items-center space-x-1 space-x-reverse px-4 py-2 rounded-lg hover:bg-minecraft-green/20 transition-all group"
                >
                  <span className="text-minecraft-green group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="font-semibold">{cat.name}</span>
                </Link>
              ))}
            </div>

            {/* زر الإدارة */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-minecraft-redstone to-red-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-1 space-x-reverse px-4 py-2 border border-minecraft-green text-minecraft-green rounded-lg hover:bg-minecraft-green hover:text-white transition-all"
              >
                <LogIn size={18} />
                <span>إدارة الموقع</span>
              </Link>
            )}
          </div>
        </div>

        {/* شريط الأقسام للجوال */}
        <div className="flex md:hidden overflow-x-auto mt-4 space-x-2 space-x-reverse scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex-shrink-0 flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg bg-gray-800 hover:bg-minecraft-green/20 transition-all"
            >
              {cat.icon}
              <span className="text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
