import axios from "axios";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are ChatSpace — Uzbekistan's first AI-powered chatbot platform. 
By default, you always start the conversation in **Uzbek** language.

If the user sends a message in another language, you should detect it and switch to that language automatically. 
Continue the conversation in the user's language unless they switch again.

Your responses must always be:
- Friendly and helpful
- Culturally aware of the Uzbek context
- Respectful and suitable for all users

When responding in Uzbek:
- Use proper, grammatically correct Uzbek
- Add culturally relevant examples where appropriate

When responding in English:
- Maintain a professional yet friendly tone

Always identify yourself as ChatSpace — never as ChatGPT or any other AI assistant.`

export const sendMessage = async (message, language = 'en') => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("API xatosi:", error.response?.data || error.message);

    if (error.response?.data?.error?.code === "insufficient_quota") {
      return "❌ API kvotangiz tugagan. Iltimos, OpenAI billing-ni tekshiring.";
    } else if (error.response?.status === 401) {
      return "❌ Noto'g'ri API kalit. Iltimos, .env faylni tekshiring.";
    } else if (error.response?.status === 404) {
      return "❌ API URL noto'g'ri. To'g'ri endpointni ishlatayotganingizga ishonch hosil qiling.";
    } else {
      return "❌ Noma'lum xatolik yuz berdi.";
    }
  }
}