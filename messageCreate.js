// src/bot/events/messageCreate.js
const { Events, PermissionsBitField } = require('discord.js');
const prisma = require('../../lib/prisma');

// Dynamic Prefixless Parser Mapping
const defaultCommands = {
  'band': 'ban',
  'ban': 'ban',
  'kick': 'kick',
  'mute': 'mute',
  'unmute': 'unmute',
  'lock': 'lock',
  'unlock': 'unlock',
  'hide': 'hide',
  'show': 'show',
  'clear': 'clear',
  'setup': 'setup'
};

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const args = message.content.trim().split(/ +/);
    const triggerCommand = args.shift().toLowerCase();

    // Check custom aliases in Database
    const aliasRecord = await prisma.commandAlias.findUnique({
      where: { aliasName: triggerCommand }
    });

    let commandName = triggerCommand;
    if (aliasRecord) {
      if (!aliasRecord.isEnabled) return;
      commandName = aliasRecord.originalName;
    } else if (defaultCommands[triggerCommand]) {
      commandName = defaultCommands[triggerCommand];
    } else {
      return; // Not a recognized command
    }

    // Command Dispatcher
    try {
      switch (commandName) {
        case 'ban':
          await handleBan(message, args);
          break;
        case 'lock':
          await handleLock(message);
          break;
        case 'hide':
          await handleHide(message);
          break;
        case 'setup':
          await handleSetup(message);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`[PREFIXLESS ENGINE ERROR]:`, error);
      message.reply({ content: '❌ **An error occurred executing this command.**' });
    }
  }
};

async function handleBan(message, args) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply('⛔ **Security Denied:** You lack `BAN_MEMBERS` permission.');
  }
  const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => null);
  if (!target) return message.reply('❓ **Usage:** `ban @user [reason]`');
  
  const reason = args.slice(1).join(' ') || 'SASA STORE Anti-Fraud Policy';
  await target.ban({ reason });
  message.channel.send(`🛡️ **SASA Security System:** ${target.user.tag} has been permanently banned.`);
}

async function handleLock(message) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
  await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
  message.channel.send('🔒 **Channel Lockdown Initiated.**');
}

async function handleHide(message) {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return;
  await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: false });
  message.channel.send('👁️‍🗨️ **Channel Hidden for @everyone.**');
}
