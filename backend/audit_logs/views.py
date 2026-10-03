from django.shortcuts import render

# Create your views here.
from django.db.models import Q

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogListAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        logs = AuditLog.objects.select_related(
            "user"
        ).all()

        action = request.query_params.get(
            "action"
        )

        model_name = request.query_params.get(
            "model_name"
        )

        user_id = request.query_params.get(
            "user"
        )

        search = request.query_params.get(
            "search"
        )

        if action:
            logs = logs.filter(
                action=action
            )

        if model_name:
            logs = logs.filter(
                model_name__iexact=model_name
            )

        if user_id:
            logs = logs.filter(
                user_id=user_id
            )

        if search:
            logs = logs.filter(
                Q(description__icontains=search)
                |
                Q(model_name__icontains=search)
                |
                Q(object_id__icontains=search)
            )

        serializer = AuditLogSerializer(
            logs,
            many=True,
        )

        return Response(
            {
                "success": True,
                "count": logs.count(),
                "logs": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class AuditLogDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(self, log_id):

        try:
            return AuditLog.objects.select_related(
                "user"
            ).get(id=log_id)

        except AuditLog.DoesNotExist:
            return None

    def get(self, request, log_id):

        log = self.get_object(log_id)

        if log is None:
            return Response(
                {
                    "success": False,
                    "message": "Audit log not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AuditLogSerializer(log)

        return Response(
            {
                "success": True,
                "log": serializer.data,
            },
            status=status.HTTP_200_OK,
        )