from rest_framework import serializers

from .models import Inventory, StockMovement


class InventorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Inventory

        fields = [
            "id",
            "product",
            "warehouse",
            "quantity",
            "reorder_level",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class StockMovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockMovement

        fields = [
            "id",
            "product",
            "warehouse",
            "movement_type",
            "quantity",
            "reference",
            "note",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]