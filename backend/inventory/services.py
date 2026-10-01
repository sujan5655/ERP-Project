from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import Inventory, StockMovement


@transaction.atomic
def create_stock_movement(
    *,
    product,
    warehouse,
    movement_type,
    quantity,
    reference="",
    note="",
):
    quantity = Decimal(quantity)

    if quantity <= 0:
        raise ValidationError(
            "Movement quantity must be greater than zero."
        )

    inventory, _ = Inventory.objects.select_for_update().get_or_create(
        product=product,
        warehouse=warehouse,
        defaults={
            "quantity": Decimal("0"),
        },
    )

    if movement_type in [
        StockMovement.MovementType.SALE,
        StockMovement.MovementType.TRANSFER_OUT,
    ]:
        if inventory.quantity < quantity:
            raise ValidationError(
                "Insufficient stock available."
            )

        inventory.quantity -= quantity

    elif movement_type in [
        StockMovement.MovementType.PURCHASE,
        StockMovement.MovementType.RETURN,
        StockMovement.MovementType.TRANSFER_IN,
    ]:
        inventory.quantity += quantity

    elif movement_type == StockMovement.MovementType.ADJUSTMENT:
        inventory.quantity = quantity

    movement = StockMovement.objects.create(
        product=product,
        warehouse=warehouse,
        movement_type=movement_type,
        quantity=quantity,
        reference=reference,
        note=note,
    )

    inventory.save(
        update_fields=[
            "quantity",
            "updated_at",
        ]
    )

    return movement