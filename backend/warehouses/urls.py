from django.urls import path

from .views import (
    WarehouseListCreateAPIView,
    WarehouseDetailAPIView,
)


urlpatterns = [
    path(
        "",
        WarehouseListCreateAPIView.as_view(),
        name="warehouse-list-create",
    ),

    path(
        "<int:warehouse_id>/",
        WarehouseDetailAPIView.as_view(),
        name="warehouse-detail",
    ),
]