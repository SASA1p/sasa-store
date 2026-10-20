// src/bot/commands/setup.js
const { ChannelType, PermissionFlagsBits, RoleManager } = require('discord.js');

async function handleSetup(message) {
  if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return message.reply('⛔ **Only Admins can initiate Hyper Setup.**');
  }

  const guild = message.guild;
  const statusMsg = await message.reply('⚡ **Initializing SASA STORE Auto-Build Engine...**');

  // 1. Roles Creation
  const rolesData = [
    { name: '👑 SASA | Founder', color: 0xFFD700, permissions: [PermissionFlagsBits.Administrator] },
    { name: '🔱 SASA | Executive Manager', color: 0x8A2BE2, permissions: [PermissionFlagsBits.ManageGuild] },
    { name: '🛡️ SASA | Chief Security Officer', color: 0x00D2FF, permissions: [PermissionFlagsBits.ModerateMembers] },
    { name: '⚡ SASA | Elite Seller', color: 0x00FF7F, permissions: [] },
    { name: '🌟 SASA | Premium Member', color: 0xFF1493, permissions: [] },
    { name: '🤖 Verified Citizen', color: 0xA9A9A9, permissions: [] }
  ];

  const createdRoles = {};
  for (const r of rolesData) {
    let existing = guild.roles.cache.find(role => role.name === r.name);
    if (!existing) {
      existing = await guild.roles.create({ name: r.name, color: r.color, permissions: r.permissions });
    }
    createdRoles[r.name] = existing;
  }

  // 2. Categories & Channels Setup
  const categories = [
    {
      name: '🛒 SASA STORE MAIN',
      channels: ['🛒・متجر-sasa', '📜・القوانين-والاثباتات', '💳・شحن-الرصيد', '🎫・الدعم-الفني']
    },
    {
      name: '🔒 STAFF ADMINISTRATION',
      secret: true,
      channels: ['🔒・ادارة-المتجر', '💬・شات-الاستاف', '📊・سجل-المبيعات', '🚨・سجل-الحماية']
    }
  ];

  for (const cat of categories) {
    const parent = await guild.channels.create({
      name: cat.name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: cat.secret ? [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: createdRoles['👑 SASA | Founder'].id, allow: [PermissionFlagsBits.ViewChannel] }
      ] : []
    });

    for (const ch of cat.channels) {
      await guild.channels.create({
        name: ch,
        type: ChannelType.GuildText,
        parent: parent.id
      });
    }
  }

  await statusMsg.edit('✅ **SASA STORE Hyper Setup Completed Successfully! All Channels & Roles Initialized.**');
}

module.exports = { handleSetup };
