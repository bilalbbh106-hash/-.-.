import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import PostCard from '../components/PostCard';
import AdBanner from '../components/AdBanner';

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    // منشورات مميزة
    const { data: featured } = await supabase
      .from('posts')
      .select('*')
      .order('views', { ascending: false })
      .limit(6);

    // أحدث المنشورات
    const { data: latest } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    setFeaturedPosts(featured || []);
    setLatestPosts(latest || []);
  };

  const categories = [
    {
      name: 'المودات',
      count: latestPosts.filter(p => p.category === 'mods').length,
      icon: '⚡',
      color: 'from-blue-500 to-cyan-400',
      path: '/category/mods'
    },
    {
      name: 'الخريط',
      count: latestPosts.filter(p => p.category === 'maps').length,
      icon: '🗺️',
      color: 'from-green-500 to-emerald-400',
      path: '/category/maps'
    },
    {
      name: 'السكنات',
      count: latestPosts.filter(p => p.category === 'skins').length,
      icon: '👕',
      color: 'from-purple-500 to-pink-400',
      path: '/category/skins'
    },
    {
      name: 'الإصدارات',
      count: latestPosts.filter(p => p.category === 'versions').length,
      icon: '📦',
      color: 'from-orange-500 to-yellow-400',
      path: '/category/versions'
    },
    {
      name: 'المميزة',
      count: latestPosts.filter(p => p.category === 'premium').length,
      icon: '👑',
      color: 'from-red-500 to-pink-500',
      path: '/category/premium'
    },
  ];

  return (
    <div className="space-y-12">
      {/* قسم الهيرو مع أنيميشن */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="animated-bg rounded-2xl p-8 md:p-12">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-center"
            >
              <span className="bg-gradient-to-r from-minecraft-green via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                مكتبة مودات ماينكرافت العربية
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-center text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              أكبر مكتبة عربية تحتوي على أحدث المودات، الخرائط، السكنات، والإصدارات الخاصة بلعبة ماينكرافت
            </motion.p>
            
            {/* أنيميشن كتل ماينكرافت */}
            <div className="flex justify-center space-x-4 space-x-reverse mb-8">
              {['🪓', '⛏️', '🗡️', '🌳', '💎'].map((icon, idx) => (
                <motion.div
                  key={idx}
                  animate={{ 
                    y: [0, -20, 0],
                    rotateY: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: idx * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="text-4xl"
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* بانر إعلانات */}
      <AdBanner />

      {/* الأقسام */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">الأقسام</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={cat.path}
                className={`block p-6 rounded-xl bg-gradient-to-br ${cat.color} text-white text-center hover:shadow-xl hover:scale-105 transition-all duration-300`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
                <p className="text-sm opacity-90">{cat.count} عنصر</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* سلايدر المنشورات المميزة */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">منشورات مميزة ✨</h2>
          <Link 
            to="/category/premium" 
            className="flex items-center space-x-1 space-x-reverse text-minecraft-green hover:underline"
          >
            <span>عرض الكل</span>
            <span>→</span>
          </Link>
        </div>
        
        <Swiper
          modules={[Autoplay, EffectCreative]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          autoplay={{ delay: 3000 }}
          effect="creative"
          creativeEffect={{
            prev: { translate: [0, 0, -400] },
            next: { translate: ['100%', 0, 0] }
          }}
          className="rounded-2xl overflow-hidden"
        >
          {featuredPosts.map((post) => (
            <SwiperSlide key={post.id}>
              <PostCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* أحدث المنشورات */}
      <section>
        <h2 className="text-3xl font-bold mb-6">أحدث المنشورات 📢</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {latestPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
