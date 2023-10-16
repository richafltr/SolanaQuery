import { NextRequest } from 'next/server';
import { codeBlock, oneLine } from 'common-tags';
import GPT3Tokenizer from 'gpt3-tokenizer';
import {
  CreateModerationResponse,
  ChatCompletionRequestMessage,
} from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { ApplicationError, UserError } from '@/lib/errors';
import { query as pineconeQuery } from './query';
import { openai } from './openaiClient';

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  try {
    if (!process.env.OPENAI_KEY) {
      throw new ApplicationError('Missing environment variable OPENAI_KEY')
    }

    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }

    const { prompt: query } = requestData

    if (!query) {
      throw new UserError('Missing query in request data')
    }

    // Moderate the content to comply with OpenAI T&C
    const sanitizedQuery = query.trim()
    const moderationResponse: CreateModerationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json())

    const [results] = moderationResponse.results

    if (results.flagged) {
      throw new UserError('Flagged content', {
        flagged: true,
        categories: results.categories,
      })
    }

  // Search embeddings in Pinecone
  // Search embeddings in Pinecone directly with the sanitized query
  

    const pageSections = await pineconeQuery(sanitizedQuery, 10);


    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    if (pageSections) {
    for (let i = 0; i < pageSections.length; i++) {
      const content = pageSections[i].text // Assuming the result contains a 'text' field
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length
      
      if (tokenCount >= 1500) {
        break
      }

      contextText += `${content.trim()}\n---\n`
    } }
    console.log(contextText)

    const prompt = codeBlock`
      ${oneLine`
      You are a very enthusiastic Sorban developer relationship expert who loves
      to help people! Given the following sections from the Soroba
      documentation, answer the question using only that information,
      outputted in markdown format."
      `}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """

      Answer as markdown (including related code snippets if available):
    `

    const chatMessage: ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0.2,
      stream: true,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApplicationError('Failed to generate completion', error)
    }

    // Transform the response into a readable stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      console.error(err)
    }

    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
