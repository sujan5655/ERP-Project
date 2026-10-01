from django.urls import path

from .views import (
    BrandDetailAPIView,
    BrandListCreateAPIView,
    CategoryListCreateAPIView,
    CategoryDetailAPIView,
    ProductDetailAPIView,
    ProductListCreateAPIView,
)


urlpatterns = [
    path(
        "categories/",
        CategoryListCreateAPIView.as_view(),
        name="category-list-create",
    ),

    path(
        "categories/<int:category_id>/",
        CategoryDetailAPIView.as_view(),
        name="category-detail",
    ),


    path(
    "brands/",
    BrandListCreateAPIView.as_view(),
    name="brand-list-create",
),

path(
    "brands/<int:brand_id>/",
    BrandDetailAPIView.as_view(),
    name="brand-detail",
),


path(
    "products/",
    ProductListCreateAPIView.as_view(),
    name="product-list-create",
),

path(
    "products/<int:product_id>/",
    ProductDetailAPIView.as_view(),
    name="product-detail",
),
]