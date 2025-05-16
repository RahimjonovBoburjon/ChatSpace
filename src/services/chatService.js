const API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta'

const SYSTEM_PROMPT = `You are Chatspace, Uzbekistan's first AI-powered chatbot platform. 
You communicate in both Uzbek and English languages. 
Your responses should be friendly, helpful, and culturally aware of Uzbek context.
When responding in Uzbek, use proper Uzbek language and cultural references.
When responding in English, maintain a professional yet friendly tone.
Always identify yourself as Chatspace, not ChatGPT or any other AI assistant.`

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