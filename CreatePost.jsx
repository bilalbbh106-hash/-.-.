import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Link as LinkIcon, Tag } from 'lucide-react';
import { supabase } from '../context/SupabaseContext';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    download_url: '',
    category: 'mods',
    version_compatibility: ['1.20.1'],
    is_premium: false,
    ad_link: '',
    keywords: [],
    images: []
  });

  const categories = [
    { value: 'mods', label: 'المودات', icon: '⚡' },
    { value: 'maps', label: 'المابات', icon: '🗺️' },
    { value: 'skins', label: 'الملابس', icon: '👕' },
    { value: 'versions', label: 'الإصدارات', icon: '📦' },
    { value: 'premium', label: 'المدفوعة', icon: '👑' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        // تحديث المنشور
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', id);

        if (error) throw error;
        toast.success('تم تحديث المنشور بنجاح!');
      } else {
        // إنشاء منشور جديد
        const { error } = await supabase
          .from('posts')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم إنشاء المنشور بنجاح!');
      }

      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('حدث خطأ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files) => {
    // هنا يمكنك رفع الصور إلى Supabase Storage
    const uploadedUrls = [];
    
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file);

      if (data) {
        const url = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName).data.publicUrl;
        uploadedUrls.push(url);
      }
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...uploadedUrls]
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold mb-6">
          {id ? 'تعديل المنشور' : 'إنشاء منشور جديد'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* العنوان */}
          <div>
            <label className="block text-sm font-medium mb-2">عنوان المنشور</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-minecraft-green focus:ring-2 focus:ring-minecraft-green/50 transition-all"
              required
            />
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-minecraft-green focus:ring-2 focus:ring-minecraft-green/50 transition-all"
              required
            />
          </div>

          {/* القسم */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <label
                key={cat.value}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                  formData.category === cat.value
                    ? 'bg-minecraft-green/20 border-2 border-minecraft-green'
                    : 'bg-gray-800 border border-gray-700 hover:border-minecraft-green'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="hidden"
                />
                <span className="text-2xl mb-2">{cat.icon}</span>
                <span>{cat.label}</span>
              </label>
            ))}
          </div>

          {/* روابط التحميل */}
          {formData.category === 'premium' ? (
            <div>
              <label className="block text-sm font-medium mb-2">رابط الإعلان (Smart Link)</label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <LinkIcon className="text-gray-400" />
                <input
                  type="url"
                  value={formData.ad_link}
                  onChange={(e) => setFormData({...formData, ad_link: e.target.value})}
                  placeholder="https://ad.link/..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-minecraft-green focus:ring-2 focus:ring-minecraft-green/50 transition-all"
                  required
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                سيظهر رابط التحميل بعد النقر على هذا الرابط الإعلاني
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">رابط التحميل</label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <LinkIcon className="text-gray-400" />
                <input
                  type="url"
                  value={formData.download_url}
                  onChange={(e) => setFormData({...formData, download_url: e.target.value})}
                  placeholder="https://download.link/..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-minecraft-green focus:ring-2 focus:ring-minecraft-green/50 transition-all"
                  required
                />
              </div>
            </div>
          )}

          {/* الكلمات المفتاحية */}
          <div>
            <label className="block text-sm font-medium mb-2">الكلمات المفتاحية</label>
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <Tag className="text-gray-400" />
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      keywords: [...formData.keywords, e.target.value.trim()]
                    });
                    e.target.value = '';
                  }
                }}
                placeholder="أضف كلمة مفتاحية ثم اضغط Enter"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-minecraft-green focus:ring-2 focus:ring-minecraft-green/50 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-minecraft-green/20 text-minecraft-green"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => {
                      const newKeywords = [...formData.keywords];
                      newKeywords.splice(idx, 1);
                      setFormData({...formData, keywords: newKeywords});
                    }}
                    className="mr-2 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* رفع الصور */}
          <div>
            <label className="block text-sm font-medium mb-2">الصور</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-minecraft-green transition-all">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-2">اسحب وأفلت الصور هنا أو انقر للرفع</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-6 py-2 bg-minecraft-green text-white rounded-lg cursor-pointer hover:bg-minecraft-green/90 transition-all"
              >
                اختيار الصور
              </label>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...formData.images];
                      newImages.splice(idx, 1);
                      setFormData({...formData, images: newImages});
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* زر النشر */}
          <div className="flex justify-end space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-minecraft-green to-emerald-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري النشر...' : id ? 'تحديث' : 'نشر'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
