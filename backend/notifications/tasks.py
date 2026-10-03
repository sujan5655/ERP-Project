from celery import shared_task
from django.db.models import F

from accounts.models import Account
from inventory.models import Inventory

from .models import Notification


@shared_task
def create_low_stock_notifications():
    low_stock_items = (
        Inventory.objects
        .select_related(
            "product",
            "warehouse",
        )
        .filter(
            quantity__lte=F("reorder_level"),
        )
    )

    users = Account.objects.filter(
        is_active=True,
    )

    created_count = 0

    for inventory in low_stock_items:

        for user in users:

            already_exists = Notification.objects.filter(
                user=user,
                notification_type=(
                    Notification.NotificationType.LOW_STOCK
                ),
                message__contains=(
                    f"Inventory ID: {inventory.id}"
                ),
                is_read=False,
            ).exists()

            if already_exists:
                continue

            Notification.objects.create(
                user=user,
                notification_type=(
                    Notification.NotificationType.LOW_STOCK
                ),
                title="Low Stock Alert",
                message=(
                    f"{inventory.product.name} "
                    f"in {inventory.warehouse.name} "
                    f"is low on stock. "
                    f"Current quantity: "
                    f"{inventory.quantity}. "
                    f"Reorder level: "
                    f"{inventory.reorder_level}. "
                    f"Inventory ID: {inventory.id}"
                ),
            )

            created_count += 1

    return {
        "low_stock_items": low_stock_items.count(),
        "notifications_created": created_count,
    }