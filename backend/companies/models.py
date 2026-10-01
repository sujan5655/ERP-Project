from django.db import models

# Create your models here.
class Company(models.Model):
  name=models.CharField(max_length=200)
  code=models.CharField(max_length=50,unique=True)
  email=models.EmailField(blank=True)
  phone=models.CharField(max_length=30,blank=True)
  address = models.TextField(
        blank=True
    )
  logo = models.ImageField(
    upload_to="companies/logos/",
    blank=True,
    null=True,
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

  def __str__(self):
        return self.name



class Branch(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="branches",
    )

    name = models.CharField(
        max_length=200
    )

    code = models.CharField(
        max_length=50
    )

    photo = models.ImageField(
        upload_to="branches/photos/",
        blank=True,
        null=True,
    )

    email = models.EmailField(
        blank=True
    )

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    address = models.TextField(
        blank=True
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
                fields=["company", "code"],
                name="unique_branch_code_per_company",
            )
        ]

    def __str__(self):
        return f"{self.company.name} - {self.name}"