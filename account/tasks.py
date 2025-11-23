from celery import shared_task
from django.core.mail import send_mail
import requests

@shared_task
def send_reset_code_email(email, code):
    send_mail(
        subject="Your login code",
        message=f"Your login code is: {code}",
        from_email="no-reply@example.com",
        recipient_list=[email],
        fail_silently=False
    )


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_welcome_email_task(self, user_email, user_name):
    """
    ارسال ایمیل خوش آمدگویی با n8n Webhook
    """
    url = "http://0.0.0.0:4388/webhook-test/send_email"  # داخل Docker از hostname کانتینر استفاده می‌کنیم
    data = {
        "email": user_email,
        "subject": "خوش آمدید به Multi Shop!",
        "message": f"سلام {user_name} عزیز، خوش آمدید به Multi Shop 😊"
    }
    try:
        res = requests.post(url, json=data, timeout=10)
        res.raise_for_status()
        return res.status_code
    except requests.RequestException as exc:
        # اگر خطایی بود، تسک رو دوباره retry کن
        raise self.retry(exc=exc)