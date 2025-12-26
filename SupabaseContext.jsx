import React, { createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const SupabaseContext = createContext();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SupabaseProvider = ({ children }) => {
  // وظائف البحث
  const searchPosts = async (query) => {
    try {
      const { data, error } = await supabase
        .rpc('search_posts', { search_query: query });
      
      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('خطأ في البحث');
      return [];
    }
  };

  // الحصول على المنشورات حسب الفئة
  const getPostsByCategory = async (category, page = 1, limit = 12) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data, total: count };
    } catch (error) {
      toast.error('خطأ في تحميل المنشورات');
      return { data: [], total: 0 };
    }
  };

  // زيادة المشاهدات
  const incrementViews = async (postId) => {
    await supabase.rpc('increment_post_views', { post_id: postId });
  };

  // زيادة التحميلات
  const incrementDownloads = async (postId) => {
    await supabase.rpc('increment_post_downloads', { post_id: postId });
  };

  // الحصول على الإحصائيات
  const getAnalytics = async () => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  };

  const value = {
    supabase,
    searchPosts,
    getPostsByCategory,
    incrementViews,
    incrementDownloads,
    getAnalytics,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('يجب استخدام useSupabase داخل SupabaseProvider');
  }
  return context;
};
