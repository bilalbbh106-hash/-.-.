import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Users, Download, Eye, 
  Edit, Trash2, Plus, LogOut 
} from 'lucide-react';
import { useSupabase } from '../context/SupabaseContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { supabase, getAnalytics } = useSupabase();
  const { logout } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // تحميل الإحصائيات
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);

      // تحميل جميع المنشورات
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      setPosts(postsData || []);
    } catch (error) {
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('تم حذف المنشور بنجاح');
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      toast.error('خطأ في حذف المنشور');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-minecraft-green"></div>
      </div>
    );
  }

  const totalStats = analytics?.reduce((acc, day) => ({
    views: acc.views + day.page_views,
    visitors: acc.visitors + day.unique_visitors,
    downloads: acc.downloads + day.total_downloads
  }), { views: 0, visitors: 0, downloads: 0 });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة التحكم الإدارية</h1>
        <div className="flex space-x-4 space-x-reverse">
          <Link
            to="/admin/create"
            className="flex items-center space-x-1 space-x-reverse px-4 py-2 bg-minecraft-green text-white rounded-lg hover:bg-minecraft-green/90"
          >
            <Plus size={20} />
            <span>منشور جديد</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-1 space-x-reverse px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
          >
            <LogOut size={20} />
            <span>تسجيل خروج</span>
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">إجمالي المشاهدات</p>
              <p className="text-3xl font-bold">{totalStats?.views.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">الزوار الفريدين</p>
              <p className="text-3xl font-bold">{totalStats?.visitors.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">إجمالي التحميلات</p>
              <p className="text-3xl font-bold">{totalStats?.downloads.toLocaleString()}</p>
            </div>
            <Download className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* قائمة المنشورات */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">جميع المنشورات ({posts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-right">العنوان</th>
                <th className="p-4 text-right">القسم</th>
                <th className="p-4 text-right">المشاهدات</th>
                <th className="p-4 text-right">التحميلات</th>
                <th className="p-4 text-right">التاريخ</th>
                <th className="p-4 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {post.images[0] && (
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-400 truncate max-w-xs">
                          {post.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      post.category === 'premium' 
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-minecraft-green/20 text-minecraft-green'
                    }`}>
                      {post.category === 'mods' && 'مود'}
                      {post.category === 'maps' && 'خريطة'}
                      {post.category === 'skins' && 'سكن'}
                      {post.category === 'versions' && 'إصدار'}
                      {post.category === 'premium' && 'مميز'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 space-x-reverse text-blue-400">
                      <Eye size={16} />
                      <span>{post.views}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 space-x-reverse text-green-400">
                      <Download size={16} />
                      <span>{post.downloads}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    {new Date(post.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2 space-x-reverse">
                      <Link
                        to={`/admin/edit/${post.id}`}
                        className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
