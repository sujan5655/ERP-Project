from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .models import Inventory, StockMovement, StockTransfer


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


@transaction.atomic
def create_stock_transfer(
    *,
    product,
    from_warehouse,
    to_warehouse,
    quantity,
    reference="",
    note="",
):
    quantity = Decimal(quantity)

    if quantity <= 0:
        raise ValidationError(
            "Transfer quantity must be greater than zero."
        )

    if from_warehouse == to_warehouse:
        raise ValidationError(
            "Source and destination warehouses must be different."
        )

    source_inventory, _ = (
        Inventory.objects.select_for_update().get_or_create(
            product=product,
            warehouse=from_warehouse,
            defaults={
                "quantity": Decimal("0"),
            },
        )
    )

    if source_inventory.quantity < quantity:
        raise ValidationError(
            "Insufficient stock available in source warehouse."
        )

    destination_inventory, _ = (
        Inventory.objects.select_for_update().get_or_create(
            product=product,
            warehouse=to_warehouse,
            defaults={
                "quantity": Decimal("0"),
            },
        )
    )

    source_inventory.quantity -= quantity
    destination_inventory.quantity += quantity

    source_inventory.save(
        update_fields=[
            "quantity",
            "updated_at",
        ]
    )

    destination_inventory.save(
        update_fields=[
            "quantity",
            "updated_at",
        ]
    )
    transfer = StockTransfer.objects.create(
    product=product,
    from_warehouse=from_warehouse,
    to_warehouse=to_warehouse,
    quantity=quantity,
    reference=reference,
    note=note,
)

    StockMovement.objects.create(
    product=product,
    warehouse=from_warehouse,
    movement_type=StockMovement.MovementType.TRANSFER_OUT,
    quantity=quantity,
    reference=reference,
    note=note,
)

    StockMovement.objects.create(
    product=product,
    warehouse=to_warehouse,
    movement_type=StockMovement.MovementType.TRANSFER_IN,
    quantity=quantity,
    reference=reference,
    note=note,
)

    return transfer