from django.db import models

# Create your models here.
from django.db import models


class Category(models.Model):

    name = models.CharField(
        max_length=200,
        unique=True,
    )

    slug = models.SlugField(
        max_length=200,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    image = models.ImageField(
        upload_to="products/categories/",
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


class Brand(models.Model):

    name = models.CharField(
        max_length=200,
        unique=True,
    )

    slug = models.SlugField(
        max_length=200,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    logo = models.ImageField(
        upload_to="products/brands/",
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name



class Product(models.Model):
    category=models.ForeignKey(Category,on_delete=models.CASCADE,related_name="products")
    brand=models.ForeignKey(Brand,on_delete=models.PROTECT,related_name="products")
    name=models.CharField(max_length=200)
    sku=models.CharField(max_length=100,unique=True)
    description=models.TextField(blank=True)
    image=models.ImageField(upload_to="products/",blank=True,null=True)
    cost_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )
    reorder_level = models.PositiveIntegerField(
        default=0,
    )
    unit = models.CharField(
        max_length=50,
        default="piece",
    )
    is_active = models.BooleanField(
        default=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )
    def __str__(self):
        return f"{self.name} ({self.sku})"