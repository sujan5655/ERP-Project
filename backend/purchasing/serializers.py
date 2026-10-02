from rest_framework import serializers

from .models import (
    PurchaseOrder,
    PurchaseOrderItem,
)


class PurchaseOrderItemSerializer(
    serializers.ModelSerializer
):

    subtotal = serializers.ReadOnlyField()
    tax_amount = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = PurchaseOrderItem

        fields = [
            "id",
            "purchase_order",
            "product",
            "quantity",
            "unit_cost",
            "tax_rate",
            "subtotal",
            "tax_amount",
            "total",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "purchase_order",
            "subtotal",
            "tax_amount",
            "total",
            "created_at",
            "updated_at",
        ]


class PurchaseOrderSerializer(
    serializers.ModelSerializer
):

    items = PurchaseOrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = PurchaseOrder

        fields = [
            "id",
            "supplier",
            "warehouse",
            "order_number",
            "order_date",
            "expected_date",
            "status",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "items",
            "created_at",
            "updated_at",
        ]