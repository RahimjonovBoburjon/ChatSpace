const API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'

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

let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const sendMessage = async (message, language = 'en') => {
  try {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1,
          return_full_text: false
        }
      })
    })

    lastRequestTime = Date.now()

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60
      await sleep(retryAfter * 1000)
      return sendMessage(message, language)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data[0]?.generated_text || ''
    const assistantResponse = generatedText.split('Assistant:').pop().trim()
    return assistantResponse || 'I apologize, but I could not generate a response at this time.'
  } catch (error) {
    console.error('Error sending message:', error)
    
    if (error.message.includes('API key')) {
      throw new Error('API key is not configured. Please check your .env file.')
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.')
    }
    if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
    }
    
    throw new Error('Failed to get response. Please try again.')
  }
}