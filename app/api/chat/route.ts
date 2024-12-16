import { HfInference } from '@huggingface/inference'
import { HuggingFaceStream, StreamingTextResponse } from 'ai'
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts'

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = Hf.textGenerationStream({
    model: 'meta-llama/Llama-3.2-1B',
    inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200, 
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false
    },
    options: { stream: true } 
  })

  const stream = HuggingFaceStream(response)
  return new StreamingTextResponse(stream)
}
