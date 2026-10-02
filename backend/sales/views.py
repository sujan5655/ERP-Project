from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import SalesOrder, SalesOrderItem
from .serializers import (
    SalesOrderSerializer,
    SalesOrderItemSerializer,
)
from .services import confirm_sales_order


class SalesOrderListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        orders = (
            SalesOrder.objects
            .select_related(
                "customer",
                "warehouse",
            )
            .prefetch_related(
                "items__product"
            )
            .order_by("-created_at")
        )

        serializer = SalesOrderSerializer(
            orders,
            many=True,
        )

        return Response({
            "success": True,
            "sales_orders": serializer.data,
        })

    def post(self, request):

        serializer = SalesOrderSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = serializer.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Sales order created successfully."
                ),
                "sales_order": (
                    SalesOrderSerializer(
                        order
                    ).data
                ),
            },
            status=status.HTTP_201_CREATED,
        )


class SalesOrderDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get_object(
        self,
        sales_order_id,
    ):

        try:

            return (
                SalesOrder.objects
                .select_related(
                    "customer",
                    "warehouse",
                )
                .prefetch_related(
                    "items__product"
                )
                .get(
                    id=sales_order_id
                )
            )

        except SalesOrder.DoesNotExist:

            return None

    def get(
        self,
        request,
        sales_order_id,
    ):

        order = self.get_object(
            sales_order_id
        )

        if order is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Sales order not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response({
            "success": True,
            "sales_order": (
                SalesOrderSerializer(
                    order
                ).data
            ),
        })


class SalesOrderItemListCreateAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        sales_order_id,
    ):

        try:

            order = SalesOrder.objects.get(
                id=sales_order_id
            )

        except SalesOrder.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Sales order not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status != SalesOrder.Status.DRAFT:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be added "
                        "to draft sales orders."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SalesOrderItemSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        item = serializer.save(
            sales_order=order
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Sales order item created successfully."
                ),
                "item": (
                    SalesOrderItemSerializer(
                        item
                    ).data
                ),
            },
            status=status.HTTP_201_CREATED,
        )


class SalesOrderItemDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def put(
        self,
        request,
        sales_order_id,
        item_id,
    ):

        try:

            order = SalesOrder.objects.get(
                id=sales_order_id
            )

            item = SalesOrderItem.objects.get(
                id=item_id,
                sales_order=order,
            )

        except (
            SalesOrder.DoesNotExist,
            SalesOrderItem.DoesNotExist,
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "Sales order or item not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status != SalesOrder.Status.DRAFT:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be edited "
                        "while the order is draft."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SalesOrderItemSerializer(
            item,
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        item = serializer.save()

        return Response({
            "success": True,
            "message": (
                "Sales order item updated successfully."
            ),
            "item": (
                SalesOrderItemSerializer(
                    item
                ).data
            ),
        })

    def delete(
        self,
        request,
        sales_order_id,
        item_id,
    ):

        try:

            order = SalesOrder.objects.get(
                id=sales_order_id
            )

            item = SalesOrderItem.objects.get(
                id=item_id,
                sales_order=order,
            )

        except (
            SalesOrder.DoesNotExist,
            SalesOrderItem.DoesNotExist,
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "Sales order or item not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.status != SalesOrder.Status.DRAFT:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be deleted "
                        "while the order is draft."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        item.delete()

        return Response({
            "success": True,
            "message": (
                "Sales order item deleted successfully."
            ),
        })


class SalesOrderConfirmAPIView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        sales_order_id,
    ):

        order = confirm_sales_order(
            sales_order_id=sales_order_id
        )

        return Response({
            "success": True,
            "message": (
                "Sales order confirmed successfully."
            ),
            "sales_order": (
                SalesOrderSerializer(
                    order
                ).data
            ),
        })