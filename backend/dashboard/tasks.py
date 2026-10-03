from celery import shared_task


@shared_task
def test_celery_task():
    message = "Celery task executed successfully."

    print(message)

    return message


