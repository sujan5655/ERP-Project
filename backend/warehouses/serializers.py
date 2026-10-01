from rest_framework import serializers

from .models import Warehouse


class WarehouseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Warehouse
        fields = [
            "id",
            "branch",
            "name",
            "code",
            "photo",
            "address",
            "manager_name",
            "phone",
            "capacity",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]