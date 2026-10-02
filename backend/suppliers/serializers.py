from rest_framework import serializers

from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier

        fields = [
            "id",
            "name",
            "code",
            "contact_person",
            "email",
            "phone",
            "address",
            "tax_number",
            "payment_terms",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]