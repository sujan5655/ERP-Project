from django.shortcuts import render

# Create your views here.
from django.db.models import Sum, F, DecimalField, ExpressionWrapper, Value

from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from companies.models import Company, Branch
from warehouses.models import Warehouse
from products.models import Product
from inventory.models import Inventory, StockMovement
from suppliers.models import Supplier
from purchasing.models import PurchaseOrder
from customers.models import Customer
from sales.models import SalesOrder
from payments.models import Payment


class DashboardAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_companies = Company.objects.filter(
            is_active=True
        ).count()

        total_branches = Branch.objects.filter(
            is_active=True
        ).count()

        total_warehouses = Warehouse.objects.filter(
            is_active=True
        ).count()

        total_products = Product.objects.filter(
            is_active=True
        ).count()

        total_suppliers = Supplier.objects.filter(
            is_active=True
        ).count()

        total_customers = Customer.objects.filter(
            is_active=True
        ).count()

        total_purchase_orders = PurchaseOrder.objects.count()

        total_sales_orders = SalesOrder.objects.count()

        total_inventory_quantity = (
    Inventory.objects.aggregate(
        total=Coalesce(
            Sum("quantity"),
            0,
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )
    )["total"]
)

        low_stock_products = (
            Inventory.objects
            .select_related("product", "warehouse")
            .filter(
                quantity__lte=F(
                    "reorder_level"
                )
            )
            .count()
        )

        total_paid = (
    Payment.objects
    .filter(
        status=Payment.Status.PAID
    )
    .aggregate(
        total=Coalesce(
            Sum("amount"),
            0,
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )
    )["total"]
)

        total_pending_payments = (
    Payment.objects
    .filter(
        status=Payment.Status.PENDING
    )
    .aggregate(
        total=Coalesce(
            Sum("amount"),
            0,
            output_field=DecimalField(
                max_digits=12,
                decimal_places=2,
            ),
        )
    )["total"]
)


        total_sales_amount = (
            SalesOrder.objects
            .filter(
                status=SalesOrder.Status.CONFIRMED
            )
            .values(
                "id"
            )
        )

        recent_sales = (
            SalesOrder.objects
            .select_related("customer", "warehouse")
            .order_by("-created_at")[:5]
        )

        recent_sales_data = []

        for order in recent_sales:

            recent_sales_data.append(
                {
                    "id": order.id,
                    "order_number": order.order_number,
                    "customer": order.customer.name,
                    "warehouse": order.warehouse.name,
                    "status": order.status,
                    "order_date": order.order_date,
                    "created_at": order.created_at,
                }
            )

        recent_movements = (
            StockMovement.objects
            .select_related(
                "product",
                "warehouse",
            )
            .order_by("-created_at")[:5]
        )

        recent_movements_data = []

        for movement in recent_movements:

            recent_movements_data.append(
                {
                    "id": movement.id,
                    "product": movement.product.name,
                    "warehouse": movement.warehouse.name,
                    "movement_type": movement.movement_type,
                    "quantity": movement.quantity,
                    "reference": movement.reference,
                    "created_at": movement.created_at,
                }
            )

        return Response(
            {
                "success": True,

                "summary": {
                    "total_companies": total_companies,
                    "total_branches": total_branches,
                    "total_warehouses": total_warehouses,
                    "total_products": total_products,
                    "total_inventory_quantity": (
                        total_inventory_quantity
                    ),
                    "low_stock_products": (
                        low_stock_products
                    ),
                    "total_suppliers": total_suppliers,
                    "total_customers": total_customers,
                    "total_purchase_orders": (
                        total_purchase_orders
                    ),
                    "total_sales_orders": (
                        total_sales_orders
                    ),
                    "total_paid": total_paid,
                    "total_pending_payments": (
                        total_pending_payments
                    ),
                },

                "recent_sales": recent_sales_data,

                "recent_stock_movements": (
                    recent_movements_data
                ),
            },
            status=status.HTTP_200_OK,
        )