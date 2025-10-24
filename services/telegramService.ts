
export const sendTelegramMessage = async (
  token: string,
  chatId: string,
  text: string
): Promise<void> => {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.description || 'Failed to send message to Telegram.');
    }
  } catch (error) {
    console.error("Telegram API error:", error);
    throw new Error("Could not connect to Telegram API. Check your Bot Token and network.");
  }
};
