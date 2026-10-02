from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Customer
from .serializers import CustomerSerializer


class CustomerListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        customers = (
            Customer.objects
            .all()
            .order_by("-created_at")
        )

        serializer = CustomerSerializer(
            customers,
            many=True
        )

        return Response({
            "success": True,
            "customers": serializer.data,
        })

    def post(self, request):

        serializer = CustomerSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        customer = serializer.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Customer created successfully."
                ),
                "customer": CustomerSerializer(
                    customer
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(
        self,
        customer_id
    ):

        try:
            return Customer.objects.get(
                id=customer_id
            )

        except Customer.DoesNotExist:
            return None

    def get(
        self,
        request,
        customer_id
    ):

        customer = self.get_object(
            customer_id
        )

        if customer is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Customer not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CustomerSerializer(
            customer
        )

        return Response({
            "success": True,
            "customer": serializer.data,
        })

    def put(
        self,
        request,
        customer_id
    ):

        customer = self.get_object(
            customer_id
        )

        if customer is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Customer not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CustomerSerializer(
            customer,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        customer = serializer.save()

        return Response({
            "success": True,
            "message": (
                "Customer updated successfully."
            ),
            "customer": CustomerSerializer(
                customer
            ).data,
        })

    def delete(
        self,
        request,
        customer_id
    ):

        customer = self.get_object(
            customer_id
        )

        if customer is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Customer not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        customer.delete()

        return Response({
            "success": True,
            "message": (
                "Customer deleted successfully."
            ),
        })