from .models import AuditLog


def create_audit_log(
    *,
    user=None,
    action,
    model_name,
    object_id="",
    description="",
    old_values=None,
    new_values=None,
    request=None,
):
    ip_address = None

    if request:
        forwarded_for = request.META.get(
            "HTTP_X_FORWARDED_FOR"
        )

        if forwarded_for:
            ip_address = (
                forwarded_for
                .split(",")[0]
                .strip()
            )
        else:
            ip_address = request.META.get(
                "REMOTE_ADDR"
            )

    return AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=str(object_id),
        description=description,
        old_values=old_values,
        new_values=new_values,
        ip_address=ip_address,
    )