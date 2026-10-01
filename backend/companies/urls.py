from django.urls import path

from .views import BranchDetailAPIView, BranchListCreateAPIView, CompanyDetailAPIView, CompanyListCreateAPIView


urlpatterns = [
    path(
        "",
        CompanyListCreateAPIView.as_view(),
        name="company-list-create",
    ),

     path(
        "<int:company_id>/",
        CompanyDetailAPIView.as_view(),
        name="company-detail",
    ),

    path(
        "branches/",
        BranchListCreateAPIView.as_view(),
        name="branch-list-create",
    ),

    path(
        "branches/<int:branch_id>/",
        BranchDetailAPIView.as_view(),
        name="branch-detail",
    ),
]