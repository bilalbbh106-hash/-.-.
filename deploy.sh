#!/bin/bash

# بناء المشروع
npm run build

# الانتقال إلى مجلد البناء
cd dist

# إنشاء ملف .nojekyll لتجاهل معالجة Jekyll
touch .nojekyll

# تهيئة Git ونشر على GitHub Pages
git init
git add -A
git commit -m "Deploy Minecraft Mods Site"

# استبدل برابط مستودعك
git push -f git@github.com:username/repository.git main:gh-pages

cd -
