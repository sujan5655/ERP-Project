from django.contrib.auth.base_user import BaseUserManager


class AccountManager(BaseUserManager):

    def create_user(
        self,
        email,
        first_name,
        last_name,
        password=None,
        **extra_fields,
    ):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email,
        first_name,
        last_name,
        password=None,
        **extra_fields,
    ):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            **extra_fields,
        )

        user.role = self.model.Role.SUPER_ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True

        user.save(using=self._db)

        return user