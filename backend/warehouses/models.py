from django.db import models

# Create your models here.
from django.db import models

from companies.models import Branch


class Warehouse(models.Model):
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="warehouses",
    )

    name = models.CharField(
        max_length=200
    )

    code = models.CharField(
        max_length=50
    )

    photo = models.ImageField(
        upload_to="warehouses/photos/",
        blank=True,
        null=True,
    )

    address = models.TextField(
        blank=True
    )

    manager_name = models.CharField(
        max_length=200,
        blank=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    capacity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["branch", "code"],
                name="unique_warehouse_code_per_branch",
            )
        ]

    def __str__(self):
        return f"{self.branch.name} - {self.name}"