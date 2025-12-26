import React, { useState } from 'react';
import { ExternalLink, Lock, Download } from 'lucide-react';

const PremiumDownload = ({ adLink, downloadUrl }) => {
  const [showDownload, setShowDownload] = useState(false);

  const handleAdClick = () => {
    // افتح رابط الإعلان في نافذة جديدة
    window.open(adLink, '_blank');
    // أظهر رابط التحميل بعد 3 ثواني
    setTimeout(() => {
      setShowDownload(true);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-900/30 to-red-900/30 border-2 border-yellow-500 rounded-xl p-6 text-center">
      <Lock className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
      
      <h3 className="text-xl font-bold mb-2">هذا المحتوى مخصص للأعضاء المميزين</h3>
      <p className="text-gray-300 mb-6">
        يجب مشاهدة إعلان قصير للوصول إلى رابط التحميل
      </p>

      {!showDownload ? (
        <button
          onClick={handleAdClick}
          className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2 space-x-reverse mx-auto"
        >
          <ExternalLink size={20} />
          <span>مشاهدة الإعلان للتحميل</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-500">
            <Download size={24} />
            <span className="text-lg font-bold">جاهز للتحميل!</span>
          </div>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            تحميل الآن
          </a>
          <p className="text-sm text-gray-400">
            شكرًا لدعمك! رابط التحميل صالح لمدة 24 ساعة
          </p>
        </div>
      )}
    </div>
  );
};

export default PremiumDownload;
