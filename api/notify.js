export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return res.status(500).json({ success: false, error: "Server not configured" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const answer = body.answer || "YES";
    const name = body.name || "Special Person";

    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown";

    const userAgent = req.headers["user-agent"] || "Unknown";

    const message = `
❤️ SHE SAID YES ❤️

Answer: ${answer}
Person: ${name}

Time:
${new Date().toLocaleString()}

IP:
${ip}

Browser:
${userAgent}

Debre Zeyit Birthday Invitation Accepted 🎉
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      },
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData);
      return res.status(502).json({ success: false, error: "Telegram delivery failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
