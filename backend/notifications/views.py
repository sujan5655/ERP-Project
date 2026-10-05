from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        notifications = Notification.objects.filter(
            user=request.user
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": notifications.count(),
                "notifications": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class NotificationReadAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(self, request, notification_id):

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=request.user,
            )

        except Notification.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Notification not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True

        notification.save(
            update_fields=["is_read"]
        )

        return Response(
            {
                "success": True,
                "message": "Notification marked as read.",
            },
            status=status.HTTP_200_OK,
        )



class TestNotificationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        notification = Notification.objects.create(
            user=request.user,
            notification_type=Notification.NotificationType.SYSTEM,
            title="Test Notification",
            message="This is a test notification from the ERP system.",
        )

        serializer = NotificationSerializer(notification)

        return Response(
            {
                "success": True,
                "message": "Test notification created.",
                "notification": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )