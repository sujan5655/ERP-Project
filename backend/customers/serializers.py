from rest_framework import serializers

from .models import Customer


class CustomerSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Customer

        fields = [
            "id",
            "name",
            "code",
            "email",
            "phone",
            "address",
            "tax_number",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]