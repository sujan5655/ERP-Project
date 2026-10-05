
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import AIConversation
from .services import ask_ai


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        question = request.data.get("question")
        conversation_id = request.data.get("conversation_id")

        if not question:
            return Response(
                {"error": "Question is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Continue existing conversation
            if conversation_id:
                try:
                    conversation = AIConversation.objects.get(
                        id=conversation_id,
                        user=request.user
                    )
                except AIConversation.DoesNotExist:
                    return Response(
                        {"error": "Conversation not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )

            # Create a new conversation
            else:
                conversation = AIConversation.objects.create(
                    user=request.user,
                    title=question[:50]
                )

            # Get previous messages for this conversation
            history = []

            for message in conversation.messages.all():
                history.append(
                    {
                        "role": "user" if message.role == "USER" else "assistant",
                        "content": message.content,
                    }
                )

            # Ask AI
            answer = ask_ai(
                question,
                history=history
            )

            # Save user message
            conversation.messages.create(
                role="USER",
                content=question
            )

            # Save AI response
            conversation.messages.create(
                role="ASSISTANT",
                content=answer
            )

            return Response(
                {
                    "conversation_id": conversation.id,
                    "question": question,
                    "answer": answer,
                    "title": conversation.title,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AIConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = AIConversation.objects.filter(
            user=request.user
        )

        data = []

        for conversation in conversations:
            messages = []

            for message in conversation.messages.all():
                messages.append(
                    {
                        "id": message.id,
                        "role": message.role,
                        "content": message.content,
                        "created_at": message.created_at,
                    }
                )

            data.append(
                {
                    "id": conversation.id,
                    "title": conversation.title,
                    "created_at": conversation.created_at,
                    "updated_at": conversation.updated_at,
                    "messages": messages,
                }
            )

        return Response(data, status=status.HTTP_200_OK)


class AIConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            conversation = AIConversation.objects.get(
                id=pk,
                user=request.user
            )
        except AIConversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        messages = []

        for message in conversation.messages.all():
            messages.append(
                {
                    "id": message.id,
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at,
                }
            )

        return Response(
            {
                "id": conversation.id,
                "title": conversation.title,
                "created_at": conversation.created_at,
                "updated_at": conversation.updated_at,
                "messages": messages,
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        try:
            conversation = AIConversation.objects.get(
                id=pk,
                user=request.user
            )
        except AIConversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        conversation.delete()

        return Response(
            {
                "success": True,
                "message": "Conversation deleted successfully."
            },
            status=status.HTTP_200_OK
        )

