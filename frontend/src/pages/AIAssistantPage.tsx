import { useEffect, useState, useRef } from "react";
import {
  useChatWithAIMutation,
  useDeleteConversationMutation,
  useGetConversationsQuery,
} from "../features/ai/api";
import type { AIConversation, AIMessage } from "../features/ai/types";

const suggestions = [
  "What are my total sales?",
  "What are my top selling products?",
  "Which products are low in stock?",
];

const AIAssistantPage = () => {
  const { data: conversations = [], isLoading: conversationsLoading } =
    useGetConversationsQuery();

  const [chatWithAI, { isLoading: isSending }] = useChatWithAIMutation();

  const [deleteConversation] = useDeleteConversationMutation();

  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);

  const [question, setQuestion] = useState("");
  const hasInitialized = useRef(false);

  // Automatically select the first conversation
  useEffect(() => {
    if (!conversationsLoading && !hasInitialized.current) {
      if (conversations.length > 0) {
        setActiveConversationId(conversations[0].id);
      }

      hasInitialized.current = true;
    }
  }, [conversations, conversationsLoading]);

  const activeConversation: AIConversation | undefined = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const messages: AIMessage[] = activeConversation?.messages || [];

  const handleNewChat = () => {
    setActiveConversationId(null);
    setQuestion("");
  };

  const handleSendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) {
      return;
    }

    try {
      const response = await chatWithAI({
        question: trimmedQuestion,
        ...(activeConversationId !== null && {
          conversation_id: activeConversationId,
        }),
      }).unwrap();

      setActiveConversationId(response.conversation_id);
      setQuestion("");
    } catch (error) {
      console.error("AI chat error:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await deleteConversation(conversationId).unwrap();

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={handleNewChat}
            className="w-full rounded-lg bg-black px-4 py-3 text-white hover:bg-gray-800"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {conversationsLoading && (
            <p className="p-3 text-sm text-gray-500">
              Loading conversations...
            </p>
          )}

          {!conversationsLoading && conversations.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No conversations yet.</p>
          )}

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group mb-2 flex items-center rounded-lg ${
                activeConversationId === conversation.id
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <button
                onClick={() => setActiveConversationId(conversation.id)}
                className="flex-1 truncate px-3 py-3 text-left text-sm"
              >
                {conversation.title}
              </button>

              <button
                onClick={() => handleDeleteConversation(conversation.id)}
                className="mr-2 hidden text-gray-400 hover:text-red-500 group-hover:block"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <h1 className="text-xl font-semibold">AI Business Assistant</h1>

          <p className="text-sm text-gray-500">
            Ask questions about your ERP data.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-2xl pt-20 text-center">
              <h2 className="mb-3 text-2xl font-semibold">How can I help?</h2>

              <p className="mb-8 text-gray-500">
                Ask me about your sales, inventory, and business data.
              </p>

              <div className="grid gap-3 md:grid-cols-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuestion(suggestion)}
                    className="rounded-xl border bg-white p-4 text-left text-sm hover:bg-gray-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "USER"
                      ? "bg-black text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border bg-white px-4 py-3 text-gray-500">
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="mx-auto flex max-w-3xl gap-3">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your ERP..."
              rows={1}
              className="flex-1 resize-none rounded-xl border px-4 py-3 outline-none focus:border-gray-500"
            />

            <button
              onClick={handleSendMessage}
              disabled={!question.trim() || isSending}
              className="rounded-xl bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <p className="mx-auto mt-2 max-w-3xl text-xs text-gray-400">
            Press Enter to send • Shift + Enter for a new line
          </p>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;
