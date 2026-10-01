from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.parsers import (
    FormParser,
    MultiPartParser,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Warehouse
from .serializers import WarehouseSerializer


class WarehouseListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        warehouses = (
            Warehouse.objects
            .select_related("branch")
            .all()
            .order_by("-created_at")
        )

        serializer = WarehouseSerializer(
            warehouses,
            many=True,
        )

        return Response({
            "success": True,
            "message": "Warehouses retrieved successfully",
            "warehouses": serializer.data,
        })

    def post(self, request):

        serializer = WarehouseSerializer(
            data=request.data
        )

        if serializer.is_valid():

            warehouse = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Warehouse created successfully",
                    "warehouse": WarehouseSerializer(
                        warehouse
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "Warehouse creation failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class WarehouseDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, warehouse_id):

        return (
            Warehouse.objects
            .select_related("branch")
            .get(id=warehouse_id)
        )

    def get(self, request, warehouse_id):

        try:
            warehouse = self.get_object(
                warehouse_id
            )

        except Warehouse.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Warehouse not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = WarehouseSerializer(
            warehouse
        )

        return Response({
            "success": True,
            "message": "Warehouse retrieved successfully",
            "warehouse": serializer.data,
        })

    def put(self, request, warehouse_id):

        try:
            warehouse = self.get_object(
                warehouse_id
            )

        except Warehouse.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Warehouse not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = WarehouseSerializer(
            warehouse,
            data=request.data,
        )

        if serializer.is_valid():

            warehouse = serializer.save()

            return Response({
                "success": True,
                "message": "Warehouse updated successfully",
                "warehouse": WarehouseSerializer(
                    warehouse
                ).data,
            })

        return Response(
            {
                "success": False,
                "message": "Warehouse update failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, warehouse_id):

        try:
            warehouse = self.get_object(
                warehouse_id
            )

        except Warehouse.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Warehouse not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        warehouse.delete()

        return Response({
            "success": True,
            "message": "Warehouse deleted successfully",
        })