FROM node:18-slim

# تثبيت الحزم الأساسية
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ ملفات الحزم أولاً
COPY package*.json ./

# تثبيت الاعتماديات
RUN npm install

# نسخ بقية الملفات
COPY . .

# توليد عميل Prisma بتحديد المسار الصريح
RUN npx prisma generate --schema=prisma/schema.prisma

# تشغيل البوت
CMD ["npm", "start"]
