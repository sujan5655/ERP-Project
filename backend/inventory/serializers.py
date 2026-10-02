from rest_framework import serializers

from .models import Inventory, StockMovement, StockTransfer


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


class StockTransferSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockTransfer

        fields = [
            "id",
            "product",
            "from_warehouse",
            "to_warehouse",
            "quantity",
            "reference",
            "note",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def validate(self, attrs):
        from_warehouse = attrs.get("from_warehouse")
        to_warehouse = attrs.get("to_warehouse")
        quantity = attrs.get("quantity")

        if from_warehouse == to_warehouse:
            raise serializers.ValidationError(
                "Source and destination warehouses must be different."
            )

        if quantity <= 0:
            raise serializers.ValidationError(
                "Transfer quantity must be greater than zero."
            )

        return attrs