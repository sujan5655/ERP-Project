import { api } from "../../services/api";

import type { AIChatRequest, AIChatResponse, AIConversation } from "./types";

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<AIConversation[], void>({
      query: () => "ai/conversations/",
      providesTags: ["AIConversation"],
    }),
    getConversation: builder.query<AIConversation, number>({
      query: (id) => `ai/conversations/${id}/`,
      providesTags: (_result, _error, id) => [
        {
          type: "AIConversation",
          id,
        },
      ],
    }),
    chatWithAI: builder.mutation<AIChatResponse, AIChatRequest>({
      query: (body) => ({
        url: "ai/chat/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AIConversation"],
    }),
    deleteConversation: builder.mutation<
      {
        success: boolean;
        message: string;
      },
      number
    >({
      query: (id) => ({
        url: `ai/conversations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AIConversation"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useChatWithAIMutation,
  useDeleteConversationMutation,
} = aiApi;
