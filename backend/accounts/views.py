from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .serializers import EmployeeSerializer, RegisterSerializer
from .models import Account
from rest_framework.permissions import IsAuthenticated

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Registration failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = Account.objects.create_user(
            email=serializer.validated_data["email"],
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            password=serializer.validated_data["password"],
            role=Account.Role.SALES_STAFF,
        )

        return Response(
            {
                "success": True,
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Registration failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = Account.objects.create_user(
            email=serializer.validated_data["email"],
            first_name=serializer.validated_data["first_name"],
            last_name=serializer.validated_data["last_name"],
            password=serializer.validated_data["password"],
            role=Account.Role.SALES_STAFF,
        )

        return Response(
            {
                "success": True,
                "message": "Account created successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Login failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_200_OK,
        )


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response(
            {
                "success": True,
                "message": "User information retrieved successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                },
            },
            status=status.HTTP_200_OK,
        )

class EmployeeListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        employees = Account.objects.select_related(
            "company",
            "branch",
            "warehouse",
        ).all()

        serializer = EmployeeSerializer(
            employees,
            many=True,
        )

        return Response(
            {
                "success": True,
                "employees": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = EmployeeSerializer(
            data=request.data
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Employee created successfully.",
                    "employee": EmployeeSerializer(
                        employee
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class EmployeeDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, employee_id):

        try:

            return Account.objects.select_related(
                "company",
                "branch",
                "warehouse",
            ).get(
                id=employee_id
            )

        except Account.DoesNotExist:

            return None

    def get(self, request, employee_id):

        employee = self.get_object(
            employee_id
        )

        if employee is None:

            return Response(
                {
                    "success": False,
                    "message": "Employee not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = EmployeeSerializer(
            employee
        )

        return Response(
            {
                "success": True,
                "employee": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, employee_id):

        employee = self.get_object(
            employee_id
        )

        if employee is None:

            return Response(
                {
                    "success": False,
                    "message": "Employee not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = EmployeeSerializer(
            employee,
            data=request.data,
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Employee updated successfully.",
                    "employee": EmployeeSerializer(
                        employee
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, employee_id):

        employee = self.get_object(
            employee_id
        )

        if employee is None:

            return Response(
                {
                    "success": False,
                    "message": "Employee not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        employee.delete()

        return Response(
            {
                "success": True,
                "message": "Employee deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class RefreshTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "success": False,
                    "message": "Refresh token is required.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            refresh = RefreshToken(refresh_token)

            return Response(
                {
                    "success": True,
                    "message": "Access token refreshed successfully.",
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )

        except TokenError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired refresh token.",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )
