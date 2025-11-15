from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_reset_code_email(email, code):
    send_mail(
        subject="Your login code",
        message=f"Your login code is: {code}",
        from_email="no-reply@example.com",
        recipient_list=[email],
        fail_silently=False
    )
