from rest_framework import serializers
from .models import Account


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )
    password_confirm = serializers.CharField(
        write_only=True
    )

    def validate_email(self, value):
        if Account.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value.lower()

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })

        return attrs


from django.contrib.auth import authenticate
from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):
        email = attrs["email"]
        password = attrs["password"]

        user = authenticate(
            username=email,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        attrs["user"] = user

        return attrs



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
        ]
        read_only_fields = fields