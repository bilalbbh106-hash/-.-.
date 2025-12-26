import React from 'react';

const AdBanner = () => {
  return (
    <div className="my-8">
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-xl p-4 text-center">
        <p className="text-sm text-purple-300 mb-2">الإعلانات تساعدنا على الاستمرار</p>
        <div className="h-24 flex items-center justify-center bg-black/30 rounded-lg">
          {/* هنا ضع كود الإعلان من الشركة الإعلانية */}
          <div className="text-gray-500">
            مساحة الإعلانات - أضف كود الإعلان هنا
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          الدعم يساعدنا على تقديم المزيد من المحتوى المجاني
        </p>
      </div>
    </div>
  );
};

export default AdBanner;
