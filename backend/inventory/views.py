from django.shortcuts import render

# Create your views here.
from jsonschema import ValidationError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Inventory, StockMovement, StockTransfer
from .serializers import InventorySerializer, StockMovementSerializer, StockTransferSerializer
from .services import create_stock_movement, create_stock_transfer

class InventoryListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        inventories = Inventory.objects.select_related(
            "product",
            "warehouse",
        ).all()

        serializer = InventorySerializer(
            inventories,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Inventory records retrieved successfully.",
                "inventories": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = InventorySerializer(
            data=request.data,
        )

        if serializer.is_valid():

            inventory = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Inventory record created successfully.",
                    "inventory": InventorySerializer(
                        inventory
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "Inventory creation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class InventoryDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, inventory_id):

        try:
            return Inventory.objects.select_related(
                "product",
                "warehouse",
            ).get(
                id=inventory_id
            )

        except Inventory.DoesNotExist:
            return None

    def get(self, request, inventory_id):

        inventory = self.get_object(
            inventory_id
        )

        if inventory is None:

            return Response(
                {
                    "success": False,
                    "message": "Inventory record not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = InventorySerializer(
            inventory
        )

        return Response(
            {
                "success": True,
                "message": "Inventory record retrieved successfully.",
                "inventory": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, movement_id):

      return Response(
        {
            "success": False,
            "message": (
                "Stock movements cannot be edited. "
                "Create a correcting movement instead."
            ),
        },
        status=status.HTTP_405_METHOD_NOT_ALLOWED,
    )

    def delete(self, request, movement_id):

      return Response(
        {
            "success": False,
            "message": (
                "Stock movements cannot be deleted. "
                "Create a correcting movement instead."
            ),
        },
        status=status.HTTP_405_METHOD_NOT_ALLOWED,
    )

    # def put(self, request, inventory_id):

    #     inventory = self.get_object(
    #         inventory_id
    #     )

    #     if inventory is None:

    #         return Response(
    #             {
    #                 "success": False,
    #                 "message": "Inventory record not found.",
    #             },
    #             status=status.HTTP_404_NOT_FOUND,
    #         )

    #     serializer = InventorySerializer(
    #         inventory,
    #         data=request.data,
    #     )

    #     if serializer.is_valid():

    #         inventory = serializer.save()

    #         return Response(
    #             {
    #                 "success": True,
    #                 "message": "Inventory record updated successfully.",
    #                 "inventory": InventorySerializer(
    #                     inventory
    #                 ).data,
    #             },
    #             status=status.HTTP_200_OK,
    #         )

    #     return Response(
    #         {
    #             "success": False,
    #             "message": "Inventory update failed.",
    #             "errors": serializer.errors,
    #         },
    #         status=status.HTTP_400_BAD_REQUEST,
    #     )

    # def delete(self, request, inventory_id):

    #     inventory = self.get_object(
    #         inventory_id
    #     )

    #     if inventory is None:

    #         return Response(
    #             {
    #                 "success": False,
    #                 "message": "Inventory record not found.",
    #             },
    #             status=status.HTTP_404_NOT_FOUND,
    #         )

    #     inventory.delete()

    #     return Response(
    #         {
    #             "success": True,
    #             "message": "Inventory record deleted successfully.",
    #         },
    #         status=status.HTTP_200_OK,
    #     )


class StockMovementListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        movements = StockMovement.objects.select_related(
            "product",
            "warehouse",
        ).all().order_by("-created_at")

        serializer = StockMovementSerializer(
            movements,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Stock movements retrieved successfully.",
                "movements": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    def post(self, request):

      serializer = StockMovementSerializer(
        data=request.data,
    )

      if not serializer.is_valid():

        return Response(
            {
                "success": False,
                "message": "Stock movement creation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

      movement = create_stock_movement(
        product=serializer.validated_data["product"],
        warehouse=serializer.validated_data["warehouse"],
        movement_type=serializer.validated_data["movement_type"],
        quantity=serializer.validated_data["quantity"],
        reference=serializer.validated_data.get(
            "reference",
            "",
        ),
        note=serializer.validated_data.get(
            "note",
            "",
        ),
    )

      return Response(
        {
            "success": True,
            "message": "Stock movement created successfully.",
            "movement": StockMovementSerializer(
                movement
            ).data,
        },
        status=status.HTTP_201_CREATED,
    )


class StockMovementDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, movement_id):

        try:
            return StockMovement.objects.select_related(
                "product",
                "warehouse",
            ).get(
                id=movement_id
            )

        except StockMovement.DoesNotExist:
            return None

    def get(self, request, movement_id):

        movement = self.get_object(
            movement_id
        )

        if movement is None:

            return Response(
                {
                    "success": False,
                    "message": "Stock movement not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = StockMovementSerializer(
            movement
        )

        return Response(
            {
                "success": True,
                "message": "Stock movement retrieved successfully.",
                "movement": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, movement_id):

        movement = self.get_object(
            movement_id
        )

        if movement is None:

            return Response(
                {
                    "success": False,
                    "message": "Stock movement not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = StockMovementSerializer(
            movement,
            data=request.data,
        )

        if serializer.is_valid():

            movement = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Stock movement updated successfully.",
                    "movement": StockMovementSerializer(
                        movement
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "message": "Stock movement update failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, movement_id):

        movement = self.get_object(
            movement_id
        )

        if movement is None:

            return Response(
                {
                    "success": False,
                    "message": "Stock movement not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        movement.delete()

        return Response(
            {
                "success": True,
                "message": "Stock movement deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


class StockTransferListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        transfers = StockTransfer.objects.select_related(
            "product",
            "from_warehouse",
            "to_warehouse",
        ).all().order_by("-created_at")

        serializer = StockTransferSerializer(
            transfers,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Stock transfers retrieved successfully.",
                "transfers": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = StockTransferSerializer(
            data=request.data,
        )

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Stock transfer validation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            transfer = create_stock_transfer(
                product=serializer.validated_data["product"],
                from_warehouse=serializer.validated_data[
                    "from_warehouse"
                ],
                to_warehouse=serializer.validated_data[
                    "to_warehouse"
                ],
                quantity=serializer.validated_data["quantity"],
                reference=serializer.validated_data.get(
                    "reference",
                    "",
                ),
                note=serializer.validated_data.get(
                    "note",
                    "",
                ),
            )

        except ValidationError as exc:
            return Response(
                {
                    "success": False,
                    "message": str(exc.detail),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Stock transfer created successfully.",
                "transfer": StockTransferSerializer(
                    transfer
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )