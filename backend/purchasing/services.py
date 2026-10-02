from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from inventory.models import StockMovement
from inventory.services import create_stock_movement

from .models import PurchaseOrder


@transaction.atomic
def receive_purchase_order(
    *,
    purchase_order_id,
):
    try:
        purchase_order = (
            PurchaseOrder.objects
            .select_for_update()
            .prefetch_related("items__product")
            .get(id=purchase_order_id)
        )

    except PurchaseOrder.DoesNotExist:
        raise ValidationError(
            "Purchase order not found."
        )

    if purchase_order.status != PurchaseOrder.Status.CONFIRMED:
        raise ValidationError(
            "Only confirmed purchase orders can be received."
        )

    items = list(
        purchase_order.items.all()
    )

    if not items:
        raise ValidationError(
            "Purchase order has no items."
        )

    for item in items:

        create_stock_movement(
            product=item.product,
            warehouse=purchase_order.warehouse,
            movement_type=StockMovement.MovementType.PURCHASE,
            quantity=Decimal(item.quantity),
            reference=purchase_order.order_number,
            note=(
                f"Purchase received: "
                f"{purchase_order.order_number}"
            ),
        )

    purchase_order.status = (
        PurchaseOrder.Status.RECEIVED
    )

    purchase_order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    return purchase_order