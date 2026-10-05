export interface AIChatRequest {
  question: string;
  conversation_id?: number;
}

export interface AIChatResponse {
  conversation_id: number;
  question: string;
  answer: string;
  title: string;
}

export interface AIMessage {
  id: number;
  role: "USER" | "ASSISTANT";
  content: string;
  created_at: string;
}

export interface AIConversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: AIMessage[];
}
