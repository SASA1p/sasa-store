// src/lib/warranty.js
const crypto = require('crypto');
const prisma = require('./prisma');

const SECRET_KEY = env.WARRANTY_HMAC_SECRET || 'sasa_ultra_secure_key_2026';

function generateWarrantySignature(userId, productId, timestamp) {
  const payload = `${userId}:${productId}:${timestamp}`;
  return crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
}

async function issueProductWarranty(userId, productId, productName, itemData, amount) {
  const timestamp = Date.now();
  const signature = `SASA-WARR-${generateWarrantySignature(userId, productId, timestamp).substring(0, 16).toUpperCase()}`;

  const receipt = await prisma.warrantyReceipt.create({
    data: {
      signature: signature,
      userId: userId,
      productId: productId,
      productName: productName,
      itemPayload: itemData, // Store encrypted payload
      purchaseAmount: BigInt(amount)
    }
  });

  return receipt;
}

module.exports = { issueProductWarranty };
