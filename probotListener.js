// src/bot/events/probotListener.js
const prisma = require('../../lib/prisma');

const PROBOT_ID = '282859044593598464';
const TARGET_PAYEE_ID = '860295635093946399';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Only parse messages from ProBot
    if (message.author.id !== PROBOT_ID) return;

    // Pattern matching ProBot credit transfer success
    // Example: ":moneybag: | USER, has transferred `$95` to <@860295635093946399>"
    const transferRegex = /:\$?\s*has transferred `\$?([0-9]+)` to <@!?860295635093946399>/i;
    
    if (message.content.includes(TARGET_PAYEE_ID)) {
      const match = message.content.match(/`\$?([0-9]+)`/);
      const payerMention = message.mentions.users.first();

      if (match && payerMention) {
        const grossAmount = BigInt(match[1]);
        // Calculate ProBot 5% tax deduction logic
        const netAmount = BigInt(Math.floor(Number(grossAmount) * 0.95));

        // Update User Balance in DB
        await prisma.user.upsert({
          where: { id: payerMention.id },
          update: { creditsBalance: { increment: netAmount } },
          create: { id: payerMention.id, username: payerMention.username, discriminator: payerMention.discriminator, creditsBalance: netAmount }
        });

        // Record Transaction
        await prisma.transaction.create({
          data: {
            userId: payerMention.id,
            amount: grossAmount,
            taxAmount: grossAmount - netAmount,
            netAmount: netAmount,
            probotMessageId: message.id
          }
        });

        message.channel.send(`💳 **Payment Confirmed!** Deposited **${netAmount} Credits** (5% Tax Deducted) into <@${payerMention.id}>'s SASA Wallet.`);
      }
    }
  }
};
