# استخدم Node 20 على أساس Alpine Linux
FROM node:20-alpine

# تثبيت MySQL Client
RUN apk add --no-cache mysql-client

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات package.json و package-lock.json من المجلد الجذر
COPY package*.json ./

# تثبيت الحزم
RUN npm install

# نسخ بقية ملفات المشروع
COPY . .

# بناء التطبيق
RUN npm run build

# فتح المنفذ 3000
EXPOSE 3000

# تشغيل التطبيق
CMD ["npm", "start"]
