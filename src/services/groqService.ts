import axios from 'axios';

import { getApiUrl } from '@/lib/getApiUrl';
const API_URL = getApiUrl();

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  response: string;
}

export interface ContextResponse {
  context: string;
}

/**
 * Get AI context (company/product knowledge base)
 */
export async function getAIContext(): Promise<string> {
  try {
    const response = await axios.get<ContextResponse>(`${API_URL}/api/ai/context`);
    return response.data.context;
  } catch (error) {
    console.error('Error fetching AI context:', error);
    throw new Error('Failed to load AI context');
  }
}

/**
 * Send chat message to AI assistant
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const response = await axios.post<ChatResponse>(
      `${API_URL}/api/ai/chat`,
      { message, conversationHistory }
    );
    return response.data.response;
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    throw new Error(error.response?.data?.error || 'Failed to get AI response');
  }
}

