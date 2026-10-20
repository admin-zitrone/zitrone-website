import { embed } from "ai"
import { openai } from "@ai-sdk/openai"

const EMBEDDING_MODEL = "text-embedding-3-small"

let warnedNoCredentials = false

export async function embedText(text: string): Promise<number[] | null> {
  const trimmed = text.trim()
  if (!trimmed) return null
  if (!process.env.OPENAI_API_KEY) {
    if (!warnedNoCredentials) {
      console.warn(
        "[ai/embeddings] embedding skipped — OPENAI_API_KEY is not configured.",
      )
      warnedNoCredentials = true
    }
    return null
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding(EMBEDDING_MODEL),
      value: trimmed,
    })
    return embedding
  } catch (error) {
    if (!warnedNoCredentials) {
      console.warn(
        "[ai/embeddings] embedding skipped — provider unavailable. " +
          "Run `vercel env pull .env.local` to provision OIDC credentials.",
        error,
      )
      warnedNoCredentials = true
    }
    return null
  }
}
