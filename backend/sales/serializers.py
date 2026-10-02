from rest_framework import serializers

from .models import SalesOrder, SalesOrderItem


class SalesOrderItemSerializer(
    serializers.ModelSerializer
):

    subtotal = serializers.ReadOnlyField()
    tax_amount = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = SalesOrderItem

        fields = [
            "id",
            "sales_order",
            "product",
            "quantity",
            "unit_price",
            "tax_rate",
            "subtotal",
            "tax_amount",
            "total",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "sales_order",
            "subtotal",
            "tax_amount",
            "total",
            "created_at",
            "updated_at",
        ]


class SalesOrderSerializer(
    serializers.ModelSerializer
):

    items = SalesOrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = SalesOrder

        fields = [
            "id",
            "customer",
            "warehouse",
            "order_number",
            "order_date",
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