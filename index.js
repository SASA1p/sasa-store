require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const prisma = require('./prisma');
const { startRotators } = require('./rotator');
const messageCreateEvent = require('./messageCreate');
const probotListenerEvent = require('./probotListener');

// إنشاء العميل مع التفعيل الكامل للإنترنتس (Intents)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ]
});

// عند جاهزية البوت وتدشينه
client.once('ready', () => {
  console.log(`[SASA STORE] Bot is online as ${client.user.tag}! 🚀`);
  
  // تشغيل نظام تدوير البايو والحالة تلقائياً
  startRotators(client);
});

// معالج الرسائل والأوامر بدون برفكس + استماع بروبوت
client.on('messageCreate', async (message) => {
  try {
    await messageCreateEvent.execute(message, client);
    await probotListenerEvent.execute(message, client);
  } catch (error) {
    console.error('Error in message handler:', error);
  }
});

// تسجيل الدخول باستخدام التوكن من ملف البيئة .env
client.login(process.env.DISCORD_TOKEN);
