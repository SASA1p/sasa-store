// src/bot/services/rotator.js
const fancyDesigns = [
  'S̶A̶S̶A̶ ̶S̶T̶O̶R̶E̶ ⚡ #1 Digital Hub',
  '⚡ 𝒮𝒜𝒮𝒜 𝒮𝒯𝒪𝑅𝐸 ⚡ | Ultra Secure',
  'S A S A  S T O R E 💎 Next-Gen Store',
  '🛡️ SASA STORE | AI & KYC Protected'
];

function startRotators(client) {
  let bioIndex = 0;
  
  // Presence Loop (Every 30s)
  setInterval(() => {
    const statusList = [
      { name: 'SASA STORE Dashboard', type: 3 }, // Watching
      { name: 'Crypto Warranty Engine', type: 0 }, // Playing
      { name: 'AI KYC Verification', type: 5 }  // Competing
    ];
    const current = statusList[Math.floor(Math.random() * statusList.length)];
    client.user.setPresence({
      activities: [{ name: current.name, type: current.type }],
      status: 'dnd'
    });
  }, 30000);

  // Bio Update Loop via User Profile API (Every 60s)
  setInterval(async () => {
    try {
      const bioText = fancyDesigns[bioIndex % fancyDesigns.length];
      bioIndex++;
      // Executed using Discord REST API for Custom Bot Profiles
      await client.rest.patch('/users/@me', {
        body: { bio: `${bioText}\n\n🔗 Powered by SASA Ecosystem` }
      });
    } catch (err) {
      // Handles API rate limits gracefully
    }
  }, 60000);
}

module.exports = { startRotators };
