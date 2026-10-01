from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.parsers import (
    FormParser,
    MultiPartParser,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Brand, Category, Product
from .serializers import BrandSerializer, CategorySerializer, ProductSerializer


class CategoryListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        categories = (
            Category.objects
            .all()
            .order_by("-created_at")
        )

        serializer = CategorySerializer(
            categories,
            many=True,
        )

        return Response({
            "success": True,
            "message": "Categories retrieved successfully",
            "categories": serializer.data,
        })

    def post(self, request):

        serializer = CategorySerializer(
            data=request.data
        )

        if serializer.is_valid():

            category = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Category created successfully",
                    "category": CategorySerializer(
                        category
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "Category creation failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class CategoryDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, category_id):

        return Category.objects.get(
            id=category_id
        )

    def get(self, request, category_id):

        try:
            category = self.get_object(
                category_id
            )

        except Category.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Category not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategorySerializer(
            category
        )

        return Response({
            "success": True,
            "message": "Category retrieved successfully",
            "category": serializer.data,
        })

    def put(self, request, category_id):

        try:
            category = self.get_object(
                category_id
            )

        except Category.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Category not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategorySerializer(
            category,
            data=request.data,
        )

        if serializer.is_valid():

            category = serializer.save()

            return Response({
                "success": True,
                "message": "Category updated successfully",
                "category": CategorySerializer(
                    category
                ).data,
            })

        return Response(
            {
                "success": False,
                "message": "Category update failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, category_id):

        try:
            category = self.get_object(
                category_id
            )

        except Category.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Category not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        category.delete()

        return Response({
            "success": True,
            "message": "Category deleted successfully",
        })









class BrandListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        brands = (
            Brand.objects
            .all()
            .order_by("-created_at")
        )

        serializer = BrandSerializer(
            brands,
            many=True,
        )

        return Response({
            "success": True,
            "message": "Brands retrieved successfully",
            "brands": serializer.data,
        })

    def post(self, request):

        serializer = BrandSerializer(
            data=request.data
        )

        if serializer.is_valid():

            brand = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Brand created successfully",
                    "brand": BrandSerializer(
                        brand
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "Brand creation failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class BrandDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, brand_id):

        return Brand.objects.get(
            id=brand_id
        )

    def get(self, request, brand_id):

        try:
            brand = self.get_object(
                brand_id
            )

        except Brand.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Brand not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BrandSerializer(
            brand
        )

        return Response({
            "success": True,
            "message": "Brand retrieved successfully",
            "brand": serializer.data,
        })

    def put(self, request, brand_id):

        try:
            brand = self.get_object(
                brand_id
            )

        except Brand.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Brand not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BrandSerializer(
            brand,
            data=request.data,
        )

        if serializer.is_valid():

            brand = serializer.save()

            return Response({
                "success": True,
                "message": "Brand updated successfully",
                "brand": BrandSerializer(
                    brand
                ).data,
            })

        return Response(
            {
                "success": False,
                "message": "Brand update failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, brand_id):

        try:
            brand = self.get_object(
                brand_id
            )

        except Brand.DoesNotExist:

            return Response(
                {
                    "success": False,
                    "message": "Brand not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        brand.delete()

        return Response({
            "success": True,
            "message": "Brand deleted successfully",
        })


class ProductListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        products = Product.objects.select_related(
            "category",
            "brand",
        ).all()

        serializer = ProductSerializer(
            products,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Products retrieved successfully.",
                "products": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = ProductSerializer(
            data=request.data,
        )

        if serializer.is_valid():

            product = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Product created successfully.",
                    "product": ProductSerializer(
                        product
                    ).data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "message": "Product creation failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProductDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, product_id):

        try:
            return Product.objects.select_related(
                "category",
                "brand",
            ).get(
                id=product_id
            )

        except Product.DoesNotExist:
            return None

    def get(self, request, product_id):

        product = self.get_object(
            product_id
        )

        if product is None:

            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProductSerializer(
            product
        )

        return Response(
            {
                "success": True,
                "message": "Product retrieved successfully.",
                "product": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, product_id):

        product = self.get_object(
            product_id
        )

        if product is None:

            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
        )

        if serializer.is_valid():

            product = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Product updated successfully.",
                    "product": ProductSerializer(
                        product
                    ).data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "message": "Product update failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, product_id):

        product = self.get_object(
            product_id
        )

        if product is None:

            return Response(
                {
                    "success": False,
                    "message": "Product not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        product.delete()

        return Response(
            {
                "success": True,
                "message": "Product deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )