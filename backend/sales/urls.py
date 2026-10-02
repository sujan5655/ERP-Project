from django.urls import path

from .views import (
    SalesOrderListCreateAPIView,
    SalesOrderDetailAPIView,
    SalesOrderItemListCreateAPIView,
    SalesOrderItemDetailAPIView,
    SalesOrderConfirmAPIView,
)


urlpatterns = [

    path(
        "",
        SalesOrderListCreateAPIView.as_view(),
        name="sales-order-list-create",
    ),

    path(
        "<int:sales_order_id>/",
        SalesOrderDetailAPIView.as_view(),
        name="sales-order-detail",
    ),

    path(
        "<int:sales_order_id>/items/",
        SalesOrderItemListCreateAPIView.as_view(),
        name="sales-order-item-list-create",
    ),

    path(
        "<int:sales_order_id>/items/<int:item_id>/",
        SalesOrderItemDetailAPIView.as_view(),
        name="sales-order-item-detail",
    ),

    path(
        "<int:sales_order_id>/confirm/",
        SalesOrderConfirmAPIView.as_view(),
        name="sales-order-confirm",
    ),

]