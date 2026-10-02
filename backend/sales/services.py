from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from inventory.models import StockMovement
from inventory.services import create_stock_movement

from .models import SalesOrder


@transaction.atomic
def confirm_sales_order(
    *,
    sales_order_id,
):

    try:
        sales_order = (
            SalesOrder.objects
            .select_for_update()
            .prefetch_related(
                "items__product"
            )
            .get(
                id=sales_order_id
            )
        )

    except SalesOrder.DoesNotExist:

        raise ValidationError(
            "Sales order not found."
        )

    if sales_order.status != SalesOrder.Status.DRAFT:

        raise ValidationError(
            "Only draft sales orders can be confirmed."
        )

    items = list(
        sales_order.items.all()
    )

    if not items:

        raise ValidationError(
            "Sales order has no items."
        )

    for item in items:

        create_stock_movement(
            product=item.product,
            warehouse=sales_order.warehouse,
            movement_type=(
                StockMovement.MovementType.SALE
            ),
            quantity=Decimal(
                item.quantity
            ),
            reference=sales_order.order_number,
            note=(
                f"Sale completed: "
                f"{sales_order.order_number}"
            ),
        )

    sales_order.status = (
        SalesOrder.Status.CONFIRMED
    )

    sales_order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return sales_order