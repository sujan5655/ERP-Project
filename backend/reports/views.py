from django.shortcuts import render

# Create your views here.
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import Coalesce

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from purchasing.models import PurchaseOrder, PurchaseOrderItem
from sales.models import SalesOrder, SalesOrderItem
from inventory.models import Inventory
from payments.models import Payment


class ReportsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        report_type = request.query_params.get(
            "report_type",
            "sales",
        )

        start_date = request.query_params.get(
            "start_date"
        )

        end_date = request.query_params.get(
            "end_date"
        )

        if report_type == "sales":
            return self.sales_report(
                start_date,
                end_date,
            )

        if report_type == "purchases":
            return self.purchase_report(
                start_date,
                end_date,
            )

        if report_type == "inventory":
            return self.inventory_report()

        if report_type == "payments":
            return self.payment_report(
                start_date,
                end_date,
            )

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid report type. "
                    "Use sales, purchases, "
                    "inventory, or payments."
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def sales_report(
        self,
        start_date=None,
        end_date=None,
    ):

        orders = SalesOrder.objects.select_related(
            "customer",
            "warehouse",
        ).prefetch_related(
            "items__product"
        )

        if start_date:
            orders = orders.filter(
                order_date__gte=start_date
            )

        if end_date:
            orders = orders.filter(
                order_date__lte=end_date
            )

        total_orders = orders.count()

        total_items = (
            SalesOrderItem.objects
            .filter(
                sales_order__in=orders
            )
            .aggregate(
                total=Coalesce(
                    Sum("quantity"),
                    Decimal("0"),
                )
            )["total"]
        )

        total_amount = Decimal("0")

        records = []

        for order in orders.order_by("-created_at"):

            order_total = Decimal("0")

            for item in order.items.all():
                order_total += item.total

            total_amount += order_total

            records.append(
                {
                    "id": order.id,
                    "order_number": order.order_number,
                    "customer": order.customer.name,
                    "warehouse": order.warehouse.name,
                    "status": order.status,
                    "order_date": order.order_date,
                    "total_amount": order_total,
                }
            )

        return Response(
            {
                "success": True,
                "report_type": "sales",
                "summary": {
                    "total_orders": total_orders,
                    "total_items": total_items,
                    "total_amount": total_amount,
                },
                "records": records,
            },
            status=status.HTTP_200_OK,
        )

    def purchase_report(
        self,
        start_date=None,
        end_date=None,
    ):

        orders = PurchaseOrder.objects.select_related(
            "supplier",
            "warehouse",
        ).prefetch_related(
            "items__product"
        )

        if start_date:
            orders = orders.filter(
                order_date__gte=start_date
            )

        if end_date:
            orders = orders.filter(
                order_date__lte=end_date
            )

        total_orders = orders.count()

        total_items = (
            PurchaseOrderItem.objects
            .filter(
                purchase_order__in=orders
            )
            .aggregate(
                total=Coalesce(
                    Sum("quantity"),
                    Decimal("0"),
                )
            )["total"]
        )

        total_amount = Decimal("0")

        records = []

        for order in orders.order_by("-created_at"):

            order_total = Decimal("0")

            for item in order.items.all():
                order_total += item.total

            total_amount += order_total

            records.append(
                {
                    "id": order.id,
                    "order_number": order.order_number,
                    "supplier": order.supplier.name,
                    "warehouse": order.warehouse.name,
                    "status": order.status,
                    "order_date": order.order_date,
                    "total_amount": order_total,
                }
            )

        return Response(
            {
                "success": True,
                "report_type": "purchases",
                "summary": {
                    "total_orders": total_orders,
                    "total_items": total_items,
                    "total_amount": total_amount,
                },
                "records": records,
            },
            status=status.HTTP_200_OK,
        )

    def inventory_report(self):

        inventory = Inventory.objects.select_related(
            "product",
            "warehouse",
        ).order_by(
            "warehouse__name",
            "product__name",
        )

        total_quantity = inventory.aggregate(
            total=Coalesce(
                Sum("quantity"),
                Decimal("0"),
            )
        )["total"]

        records = []

        for item in inventory:

            records.append(
                {
                    "id": item.id,
                    "product": item.product.name,
                    "sku": item.product.sku,
                    "warehouse": item.warehouse.name,
                    "quantity": item.quantity,
                    "reorder_level": item.reorder_level,
                    "is_low_stock": (
                        item.quantity
                        <= item.reorder_level
                    ),
                }
            )

        return Response(
            {
                "success": True,
                "report_type": "inventory",
                "summary": {
                    "total_products": inventory.count(),
                    "total_quantity": total_quantity,
                },
                "records": records,
            },
            status=status.HTTP_200_OK,
        )

    def payment_report(
        self,
        start_date=None,
        end_date=None,
    ):

        payments = Payment.objects.select_related(
            "sales_order"
        )

        if start_date:
            payments = payments.filter(
                created_at__date__gte=start_date
            )

        if end_date:
            payments = payments.filter(
                created_at__date__lte=end_date
            )

        total_payments = payments.count()

        total_amount = payments.aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0"),
            )
        )["total"]

        paid_amount = payments.filter(
            status=Payment.Status.PAID
        ).aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0"),
            )
        )["total"]

        pending_amount = payments.filter(
            status=Payment.Status.PENDING
        ).aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0"),
            )
        )["total"]

        records = []

        for payment in payments.order_by(
            "-created_at"
        ):

            records.append(
                {
                    "id": payment.id,
                    "payment_number": payment.payment_number,
                    "sales_order": (
                        payment.sales_order.order_number
                    ),
                    "amount": payment.amount,
                    "payment_method": (
                        payment.payment_method
                    ),
                    "status": payment.status,
                    "transaction_reference": (
                        payment.transaction_reference
                    ),
                    "payment_date": (
                        payment.payment_date
                    ),
                }
            )

        return Response(
            {
                "success": True,
                "report_type": "payments",
                "summary": {
                    "total_payments": total_payments,
                    "total_amount": total_amount,
                    "paid_amount": paid_amount,
                    "pending_amount": pending_amount,
                },
                "records": records,
            },
            status=status.HTTP_200_OK,
        )