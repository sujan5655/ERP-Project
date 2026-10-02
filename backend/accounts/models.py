from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import AccountManager
from companies.models import Company
from warehouses.models import Warehouse


class Account(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        COMPANY_ADMIN = "COMPANY_ADMIN", "Company Admin"
        BRANCH_MANAGER = "BRANCH_MANAGER", "Branch Manager"
        WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER", "Warehouse Manager"
        SALES_STAFF = "SALES_STAFF", "Sales Staff"
        ACCOUNTANT = "ACCOUNTANT", "Accountant"

    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    branch = models.ForeignKey(
        "companies.Branch",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    role = models.CharField(
        max_length=30,
        choices=Role.choices,
        default=Role.SALES_STAFF,
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email
