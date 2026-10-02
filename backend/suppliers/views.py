from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        suppliers = Supplier.objects.all().order_by(
            "name"
        )

        serializer = SupplierSerializer(
            suppliers,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Suppliers retrieved successfully."
                ),
                "suppliers": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = SupplierSerializer(
            data=request.data,
        )

        if serializer.is_valid():

            supplier = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Supplier created successfully."
                    ),
                    "supplier": SupplierSerializer(
                        supplier
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": (
                    "Supplier creation failed."
                ),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class SupplierDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, supplier_id):

        try:
            return Supplier.objects.get(
                id=supplier_id
            )

        except Supplier.DoesNotExist:
            return None


    def get(self, request, supplier_id):

        supplier = self.get_object(
            supplier_id
        )

        if supplier is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Supplier not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        serializer = SupplierSerializer(
            supplier
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Supplier retrieved successfully."
                ),
                "supplier": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


    def put(self, request, supplier_id):

        supplier = self.get_object(
            supplier_id
        )

        if supplier is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Supplier not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        serializer = SupplierSerializer(
            supplier,
            data=request.data,
        )

        if serializer.is_valid():

            supplier = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Supplier updated successfully."
                    ),
                    "supplier": SupplierSerializer(
                        supplier
                    ).data,
                },
                status=status.HTTP_200_OK,
            )


        return Response(
            {
                "success": False,
                "message": (
                    "Supplier update failed."
                ),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


    def delete(self, request, supplier_id):

        supplier = self.get_object(
            supplier_id
        )

        if supplier is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Supplier not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        supplier.delete()

        return Response(
            {
                "success": True,
                "message": (
                    "Supplier deleted successfully."
                ),
            },
            status=status.HTTP_200_OK,
        )