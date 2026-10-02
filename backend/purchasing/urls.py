from django.urls import path

from .views import (
    PurchaseOrderConfirmAPIView,
    PurchaseOrderItemDetailAPIView,
    PurchaseOrderItemListCreateAPIView,
    PurchaseOrderListCreateAPIView,
    PurchaseOrderDetailAPIView,
    PurchaseOrderReceiveAPIView,
)


urlpatterns = [
    path(
        "",
        PurchaseOrderListCreateAPIView.as_view(),
        name="purchase-order-list-create",
    ),

    path(
        "<int:purchase_order_id>/",
        PurchaseOrderDetailAPIView.as_view(),
        name="purchase-order-detail",
    ),

    path(
    "<int:purchase_order_id>/items/",
    PurchaseOrderItemListCreateAPIView.as_view(),
    name="purchase-order-item-list-create",
),


path(
    "<int:purchase_order_id>/items/<int:item_id>/",
    PurchaseOrderItemDetailAPIView.as_view(),
    name="purchase-order-item-detail",
),


path(
    "<int:purchase_order_id>/confirm/",
    PurchaseOrderConfirmAPIView.as_view(),
    name="purchase-order-confirm",
),

path(
    "<int:purchase_order_id>/receive/",
    PurchaseOrderReceiveAPIView.as_view(),
    name="purchase-order-receive",
),
]