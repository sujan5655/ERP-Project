# from django.shortcuts import render

# # Create your views here.
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from .models import Company,Branch
# from .serializers import BranchSerializer, CompanySerializer

# from rest_framework.parsers import (
#     MultiPartParser,
#     FormParser,
# )

# class CompanyListCreateAPIView(APIView):

#     permission_classes = [IsAuthenticated]
#     parser_classes = [
#         MultiPartParser,
#         FormParser,
#     ]

#     def get(self, request):
#         companies = Company.objects.all().order_by("-created_at")

#         serializer = CompanySerializer(
#             companies,
#             many=True
#         )

#         return Response(
#             {
#                 "success": True,
#                 "message": "Companies retrieved successfully.",
#                 "companies": serializer.data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def post(self, request):
#         serializer = CompanySerializer(
#             data=request.data
#         )

#         if not serializer.is_valid():
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Company creation failed.",
#                     "errors": serializer.errors,
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         company = serializer.save()

#         return Response(
#             {
#                 "success": True,
#                 "message": "Company created successfully.",
#                 "company": CompanySerializer(company).data,
#             },
#             status=status.HTTP_201_CREATED,
#         )


# class CompanyDetailAPIView(APIView):

#     permission_classes = [IsAuthenticated]
#     parser_classes = [
#         MultiPartParser,
#         FormParser,
#     ]

#     def get_object(self, company_id):
#         try:
#             return Company.objects.get(id=company_id)
#         except Company.DoesNotExist:
#             return None

#     def get(self, request, company_id):
#         company = self.get_object(company_id)

#         if company is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Company not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         serializer = CompanySerializer(company)

#         return Response(
#             {
#                 "success": True,
#                 "message": "Company retrieved successfully.",
#                 "company": serializer.data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def put(self, request, company_id):
#         company = self.get_object(company_id)

#         if company is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Company not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         serializer = CompanySerializer(
#             company,
#             data=request.data,
#         )

#         if not serializer.is_valid():
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Company update failed.",
#                     "errors": serializer.errors,
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         company = serializer.save()

#         return Response(
#             {
#                 "success": True,
#                 "message": "Company updated successfully.",
#                 "company": CompanySerializer(company).data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def delete(self, request, company_id):
#         company = self.get_object(company_id)

#         if company is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Company not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         company.delete()

#         return Response(
#             {
#                 "success": True,
#                 "message": "Company deleted successfully.",
#             },
#             status=status.HTTP_200_OK,
#         )


# class BranchListCreateAPIView(APIView):
#     permission_classes=[IsAuthenticated]
#     parser_classes=[
#         MultiPartParser,FormParser
#     ]
#     def get(self,request):
#         branches=(
#             Branch.objects.select_related("company").all().order_by("-created_at")
#         )
#         serializer=BranchSerializer(branches,many=True)
#         return Response(
#             {
#                  "success":True,
#                             "message":"Branches retrieved successfully",
#                             "branches":serializer.data
#             },
#             status=status.HTTP_200_OK
           
#         )
#     def post(self,request):
#         serializer=BranchSerializer(data=request.data)
#         if not serializer.is_valid():
#             return Response(
#                 {
#                     "success":False,
#                     "message":"Branch creation failed",
#                     "errors":serializer.errors
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         branch=serializer.save()
#         return Response(
#             {
#                 "success":True,
#                 "message":"Branch created successfully",
#                 "branch":BranchSerializer(branch).data
#             },
#             status=status.HTTP_201_CREATED,
#         )


# class BranchDetailAPIView(APIView):
#     permission_classes=[IsAuthenticated]
#     parser_classes = [
#         MultiPartParser,
#         FormParser,
#     ]
#     def get_object(self, branch_id):
#         try:
#             return (
#                 Branch.objects
#                 .select_related("company")
#                 .get(id=branch_id)
#             )
#         except Branch.DoesNotExist:
#             return None

#     def get(self, request, branch_id):
#         branch = self.get_object(branch_id)

#         if branch is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Branch not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         serializer = BranchSerializer(branch)

#         return Response(
#             {
#                 "success": True,
#                 "message": "Branch retrieved successfully.",
#                 "branch": serializer.data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def put(self, request, branch_id):
#         branch = self.get_object(branch_id)

#         if branch is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Branch not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         serializer = BranchSerializer(
#             branch,
#             data=request.data,
#         )

#         if not serializer.is_valid():
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Branch update failed.",
#                     "errors": serializer.errors,
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         branch = serializer.save()

#         return Response(
#             {
#                 "success": True,
#                 "message": "Branch updated successfully.",
#                 "branch": BranchSerializer(branch).data,
#             },
#             status=status.HTTP_200_OK,
#         )

#     def delete(self, request, branch_id):
#         branch = self.get_object(branch_id)

#         if branch is None:
#             return Response(
#                 {
#                     "success": False,
#                     "message": "Branch not found.",
#                 },
#                 status=status.HTTP_404_NOT_FOUND,
#             )

#         branch.delete()

#         return Response(
#             {
#                 "success": True,
#                 "message": "Branch deleted successfully.",
#             },
#             status=status.HTTP_200_OK,
#         )



from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)

from .models import Company, Branch
from .serializers import BranchSerializer, CompanySerializer

from audit_logs.models import AuditLog
from audit_logs.services import create_audit_log


class CompanyListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        companies = (
            Company.objects
            .all()
            .order_by("-created_at")
        )

        serializer = CompanySerializer(
            companies,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Companies retrieved successfully.",
                "companies": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = CompanySerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Company creation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        company = serializer.save()

        new_values = {
            "name": company.name,
            "code": company.code,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "is_active": company.is_active,
        }

        create_audit_log(
            user=request.user,
            action=AuditLog.Action.CREATE,
            model_name="Company",
            object_id=company.id,
            description=f"Company created: {company.name}",
            new_values=new_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Company created successfully.",
                "company": CompanySerializer(company).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CompanyDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, company_id):

        try:

            return Company.objects.get(
                id=company_id
            )

        except Company.DoesNotExist:

            return None

    def get(self, request, company_id):

        company = self.get_object(
            company_id
        )

        if company is None:

            return Response(
                {
                    "success": False,
                    "message": "Company not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CompanySerializer(
            company
        )

        return Response(
            {
                "success": True,
                "message": "Company retrieved successfully.",
                "company": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, company_id):

        company = self.get_object(
            company_id
        )

        if company is None:

            return Response(
                {
                    "success": False,
                    "message": "Company not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Save old values BEFORE updating
        old_values = {
            "name": company.name,
            "code": company.code,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "is_active": company.is_active,
        }

        serializer = CompanySerializer(
            company,
            data=request.data,
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Company update failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        company = serializer.save()

        new_values = {
            "name": company.name,
            "code": company.code,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "is_active": company.is_active,
        }

        create_audit_log(
            user=request.user,
            action=AuditLog.Action.UPDATE,
            model_name="Company",
            object_id=company.id,
            description=f"Company updated: {company.name}",
            old_values=old_values,
            new_values=new_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Company updated successfully.",
                "company": CompanySerializer(
                    company
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, company_id):

        company = self.get_object(
            company_id
        )

        if company is None:

            return Response(
                {
                    "success": False,
                    "message": "Company not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Save values BEFORE deleting
        old_values = {
            "name": company.name,
            "code": company.code,
            "email": company.email,
            "phone": company.phone,
            "address": company.address,
            "is_active": company.is_active,
        }

        company_name = company.name

        # Delete company
        company.delete()

        # Create audit log AFTER deletion
        create_audit_log(
            user=request.user,
            action=AuditLog.Action.DELETE,
            model_name="Company",
            object_id=company_id,
            description=f"Company deleted: {company_name}",
            old_values=old_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Company deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )


class BranchListCreateAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):

        branches = (
            Branch.objects
            .select_related("company")
            .all()
            .order_by("-created_at")
        )

        serializer = BranchSerializer(
            branches,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Branches retrieved successfully.",
                "branches": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = BranchSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Branch creation failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        branch = serializer.save()

        new_values = {
            "name": branch.name,
            "code": branch.code,
            "company_id": branch.company_id,
        }

        create_audit_log(
            user=request.user,
            action=AuditLog.Action.CREATE,
            model_name="Branch",
            object_id=branch.id,
            description=f"Branch created: {branch.name}",
            new_values=new_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Branch created successfully.",
                "branch": BranchSerializer(
                    branch
                ).data,
            },
            status=status.HTTP_201_CREATED,
        )


class BranchDetailAPIView(APIView):

    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, branch_id):

        try:

            return (
                Branch.objects
                .select_related("company")
                .get(id=branch_id)
            )

        except Branch.DoesNotExist:

            return None

    def get(self, request, branch_id):

        branch = self.get_object(
            branch_id
        )

        if branch is None:

            return Response(
                {
                    "success": False,
                    "message": "Branch not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BranchSerializer(
            branch
        )

        return Response(
            {
                "success": True,
                "message": "Branch retrieved successfully.",
                "branch": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def put(self, request, branch_id):

        branch = self.get_object(
            branch_id
        )

        if branch is None:

            return Response(
                {
                    "success": False,
                    "message": "Branch not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        old_values = {
            "name": branch.name,
            "code": branch.code,
            "company_id": branch.company_id,
        }

        serializer = BranchSerializer(
            branch,
            data=request.data,
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Branch update failed.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        branch = serializer.save()

        new_values = {
            "name": branch.name,
            "code": branch.code,
            "company_id": branch.company_id,
        }

        create_audit_log(
            user=request.user,
            action=AuditLog.Action.UPDATE,
            model_name="Branch",
            object_id=branch.id,
            description=f"Branch updated: {branch.name}",
            old_values=old_values,
            new_values=new_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Branch updated successfully.",
                "branch": BranchSerializer(
                    branch
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, branch_id):

        branch = self.get_object(
            branch_id
        )

        if branch is None:

            return Response(
                {
                    "success": False,
                    "message": "Branch not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        old_values = {
            "name": branch.name,
            "code": branch.code,
            "company_id": branch.company_id,
        }

        branch_name = branch.name

        branch.delete()

        create_audit_log(
            user=request.user,
            action=AuditLog.Action.DELETE,
            model_name="Branch",
            object_id=branch_id,
            description=f"Branch deleted: {branch_name}",
            old_values=old_values,
            request=request,
        )

        return Response(
            {
                "success": True,
                "message": "Branch deleted successfully.",
            },
            status=status.HTTP_200_OK,
        )
