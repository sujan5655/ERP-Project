from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from django.db import models
from .managers import AccountManager
class Account(AbstractBaseUser,PermissionsMixin):
     class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        COMPANY_ADMIN = "COMPANY_ADMIN", "Company Admin"
        BRANCH_MANAGER = "BRANCH_MANAGER", "Branch Manager"
        WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER", "Warehouse Manager"
        SALES_STAFF = "SALES_STAFF", "Sales Staff"
        ACCOUNTANT = "ACCOUNTANT", "Accountant"


     email=models.EmailField(unique=True)
     first_name=models.CharField(max_length=100)
     last_name=models.CharField(max_length=100)
     role=models.CharField(max_length=30,choices=Role.choices,default=Role.SALES_STAFF)
     is_active = models.BooleanField(default=True)
     is_staff = models.BooleanField(default=False)

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     objects = AccountManager()
     USERNAME_FIELD = "email"
     REQUIRED_FIELDS = ["first_name", "last_name"]

     def __str__(self):
        return self.email