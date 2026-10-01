from django.urls import path

from .views import (
    InventoryListCreateAPIView,
    InventoryDetailAPIView,
    StockMovementDetailAPIView,
    StockMovementListCreateAPIView,
)


urlpatterns = [

    path(
        "",
        InventoryListCreateAPIView.as_view(),
        name="inventory-list-create",
    ),

    path(
        "<int:inventory_id>/",
        InventoryDetailAPIView.as_view(),
        name="inventory-detail",
    ),

    path(
        "movements/",
        StockMovementListCreateAPIView.as_view(),
        name="stock-movement-list-create",
    ),

    path(
        "movements/<int:movement_id>/",
        StockMovementDetailAPIView.as_view(),
        name="stock-movement-detail",
    ),

]