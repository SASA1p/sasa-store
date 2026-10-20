FROM node:18-slim

# تثبيت الحزم الأساسية لنظام التشغيل
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# نسخ ملفات الاعتماديات
COPY package*.json ./

# تثبيت الحزم
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# توليد عميل Prisma بالمسار الصحيح
RUN npx prisma generate --schema=prisma/schema.prisma

# مزامنة قاعدة البيانات ثم تشغيل البوت مباشرة
CMD npx prisma db push --schema=prisma/schema.prisma && npm start
