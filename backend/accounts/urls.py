from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import EmployeeDetailAPIView, EmployeeListCreateAPIView, LoginAPIView, MeAPIView, RefreshTokenAPIView, RegisterAPIView


urlpatterns = [
    path(
        "register/",
        RegisterAPIView.as_view(),
        name="register",
    ),

   path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),

    path(
        "token/refresh/",
        RefreshTokenAPIView.as_view(),
        name="token-refresh",
    ),

      path(
        "me/",
        MeAPIView.as_view(),
        name="me",
    ),


    path(
    "employees/",
    EmployeeListCreateAPIView.as_view(),
    name="employee-list-create",
),

path(
    "employees/<int:employee_id>/",
    EmployeeDetailAPIView.as_view(),
    name="employee-detail",
),

]