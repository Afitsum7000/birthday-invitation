export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed",
    });
  }

  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const body = req.body || {};

    const name = body.name || "Unknown";

    const ip =
      req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown";

    const userAgent = req.headers["user-agent"] || "Unknown";

    const message = `
❤️ SHE SAID YES ❤️

Person: ${name}

Time:
${new Date().toLocaleString()}

IP:
${ip}

Browser:
${userAgent}

Debre Zeyit Birthday Invitation Accepted 🎉
`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
    });
  }
}
