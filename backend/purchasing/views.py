from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import receive_purchase_order

from .models import PurchaseOrder, PurchaseOrderItem
from .serializers import PurchaseOrderItemSerializer, PurchaseOrderSerializer

class PurchaseOrderListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        purchase_orders = (
            PurchaseOrder.objects
            .select_related(
                "supplier",
                "warehouse",
            )
            .prefetch_related("items__product")
            .all()
            .order_by("-created_at")
        )

        serializer = PurchaseOrderSerializer(
            purchase_orders,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase orders retrieved successfully."
                ),
                "purchase_orders": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = PurchaseOrderSerializer(
            data=request.data,
        )

        if serializer.is_valid():

            purchase_order = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Purchase order created successfully."
                    ),
                    "purchase_order": (
                        PurchaseOrderSerializer(
                            purchase_order
                        ).data
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": (
                    "Purchase order creation failed."
                ),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class PurchaseOrderDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, purchase_order_id):

        try:

            return (
                PurchaseOrder.objects
                .select_related(
                    "supplier",
                    "warehouse",
                )
                .prefetch_related(
                    "items__product"
                )
                .get(
                    id=purchase_order_id
                )
            )

        except PurchaseOrder.DoesNotExist:

            return None

    def get(
        self,
        request,
        purchase_order_id,
    ):

        purchase_order = self.get_object(
            purchase_order_id
        )

        if purchase_order is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Purchase order not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PurchaseOrderSerializer(
            purchase_order
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase order retrieved successfully."
                ),
                "purchase_order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PurchaseOrderItemListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, purchase_order_id):

        try:
            purchase_order = PurchaseOrder.objects.get(
                id=purchase_order_id
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Purchase order not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        items = (
            PurchaseOrderItem.objects
            .select_related("product")
            .filter(
                purchase_order=purchase_order
            )
            .order_by("id")
        )

        serializer = PurchaseOrderItemSerializer(
            items,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase order items retrieved successfully."
                ),
                "items": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, purchase_order_id):

        try:
            purchase_order = PurchaseOrder.objects.get(
                id=purchase_order_id
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Purchase order not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if purchase_order.status != PurchaseOrder.Status.DRAFT:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be added to "
                        "draft purchase orders."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PurchaseOrderItemSerializer(
            data=
                request.data,
        )

        if serializer.is_valid():

            item = serializer.save(
                purchase_order=purchase_order
            )

            return Response(
                {
                    "success": True,
                    "message": (
                        "Purchase order item created successfully."
                    ),
                    "item": (
                        PurchaseOrderItemSerializer(
                            item
                        ).data
                    ),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": (
                    "Purchase order item creation failed."
                ),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class PurchaseOrderItemDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(
        self,
        purchase_order_id,
        item_id,
    ):

        try:

            return (
                PurchaseOrderItem.objects
                .select_related(
                    "product",
                    "purchase_order",
                )
                .get(
                    id=item_id,
                    purchase_order_id=purchase_order_id,
                )
            )

        except PurchaseOrderItem.DoesNotExist:

            return None


    def put(
        self,
        request,
        purchase_order_id,
        item_id,
    ):

        item = self.get_object(
            purchase_order_id,
            item_id,
        )

        if item is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Purchase order item not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        if (
            item.purchase_order.status
            != PurchaseOrder.Status.DRAFT
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be updated "
                        "while the purchase order is draft."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        serializer = PurchaseOrderItemSerializer(
            item,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            item = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": (
                        "Purchase order item updated successfully."
                    ),
                    "item": (
                        PurchaseOrderItemSerializer(
                            item
                        ).data
                    ),
                },
                status=status.HTTP_200_OK,
            )


        return Response(
            {
                "success": False,
                "message": (
                    "Purchase order item update failed."
                ),
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


    def delete(
        self,
        request,
        purchase_order_id,
        item_id,
    ):

        item = self.get_object(
            purchase_order_id,
            item_id,
        )

        if item is None:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Purchase order item not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )


        if (
            item.purchase_order.status
            != PurchaseOrder.Status.DRAFT
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "Items can only be deleted "
                        "while the purchase order is draft."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


        item.delete()

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase order item deleted successfully."
                ),
            },
            status=status.HTTP_200_OK,
        )


class PurchaseOrderConfirmAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(
        self,
        request,
        purchase_order_id,
    ):

        try:

            purchase_order = (
                PurchaseOrder.objects
                .prefetch_related("items")
                .get(
                    id=purchase_order_id
                )
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": (
                        "Purchase order not found."
                    ),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if (
            purchase_order.status
            != PurchaseOrder.Status.DRAFT
        ):

            return Response(
                {
                    "success": False,
                    "message": (
                        "Only draft purchase orders "
                        "can be confirmed."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not purchase_order.items.exists():

            return Response(
                {
                    "success": False,
                    "message": (
                        "Purchase order must have "
                        "at least one item."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        purchase_order.status = (
            PurchaseOrder.Status.CONFIRMED
        )

        purchase_order.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        serializer = PurchaseOrderSerializer(
            purchase_order
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase order confirmed successfully."
                ),
                "purchase_order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PurchaseOrderReceiveAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(
        self,
        request,
        purchase_order_id,
    ):

        try:

            purchase_order = receive_purchase_order(
                purchase_order_id=purchase_order_id,
            )

        except Exception as error:

            return Response(
                {
                    "success": False,
                    "message": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PurchaseOrderSerializer(
            purchase_order
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Purchase order received successfully."
                ),
                "purchase_order": serializer.data,
            },
            status=status.HTTP_200_OK,
        )