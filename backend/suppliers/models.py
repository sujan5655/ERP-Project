from django.db import models

# Create your models here.

class Supplier(models.Model):
  name=models.CharField(max_length=200)
  code=models.CharField(max_length=50,unique=True)
  contact_person=models.CharField(max_length=200,blank=True)
  email = models.EmailField(
        blank=True,
    )

  phone = models.CharField(
        max_length=30,
        blank=True,
    )

  address = models.TextField(
        blank=True,
    )

  tax_number = models.CharField(
        max_length=100,
        blank=True,
    )

  payment_terms = models.CharField(
        max_length=200,
        blank=True,
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
        return (
            f"{self.name} ({self.code})"
        )