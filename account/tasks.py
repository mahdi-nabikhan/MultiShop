from celery import shared_task
from django.core.mail import send_mail
import requests

@shared_task
def send_reset_code_email(email, code):
    """
    Celery task for sending a password reset or login verification code via email.

    This asynchronous task sends a plain-text email containing a time-sensitive
    verification code to the specified recipient. It is typically triggered
    during password reset or login verification workflows to avoid blocking
    the main request-response cycle.

    Args:
        email (str):
            Recipient's email address.

        code (str):
            Verification code to be included in the email content.

    Email Details:
        - Subject: "Your login code"
        - Body: Plain-text message containing the verification code
        - Sender: no-reply@example.com

    Behavior:
        - Executed asynchronously via Celery workers.
        - Raises an exception if email delivery fails (fail_silently=False).

    Usage:
        send_reset_code_email.delay(email=email, code=code)
    """
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
    Celery task for sending a welcome email via n8n webhook.

    This task triggers an external n8n webhook to send a welcome email to a
    newly registered user. The task is executed asynchronously and includes
    automatic retry logic to handle transient network or service failures.

    Args:
        self:
            Bound Celery task instance used for retry handling.
        user_email (str):
            Recipient's email address.
        user_name (str):
            User's display name to be included in the email message.

    Workflow:
        1. Build the request payload containing email, subject, and message.
        2. Send a POST request to the n8n webhook endpoint.
        3. Validate the HTTP response status.
        4. Retry the task automatically in case of request failures.

    Retry Policy:
        - Maximum retries: 3
        - Delay between retries: 60 seconds
        - Retries are triggered for any requests.RequestException

    External Dependencies:
        - n8n webhook service for email delivery.
        - requests library for HTTP communication.

    Returns:
        int:
            HTTP status code returned by the n8n webhook upon success.

    Raises:
        Retry:
            Automatically retries the task when a network or HTTP error occurs.

    Usage:
        send_welcome_email_task.delay(user_email, user_name)
    """
    url = "http://n8n:4388/webhook-test/send_email"

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
        raise self.retry(exc=exc)
    
    
    
    
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_password_email(self, email, code):
    """
    Celery task for sending a password or verification code via n8n webhook.

    This asynchronous task communicates with an external n8n webhook to deliver
    a sensitive password or verification code to the user's email address.
    The task includes built-in retry logic to handle temporary network failures
    or webhook downtime.

    Args:
        self:
            Bound Celery task instance, required for retry handling.
        email (str):
            Recipient's email address.
        code (str):
            Password or verification code to be sent.

    Workflow:
        1. Prepare the request payload with email, subject, and message.
        2. Send a POST request to the n8n webhook endpoint.
        3. Validate the HTTP response status.
        4. Retry automatically on request failures.

    Retry Policy:
        - Maximum retries: 3
        - Delay between retries: 60 seconds
        - Retries occur on any requests.RequestException

    External Dependencies:
        - n8n webhook service for email delivery.
        - requests library for HTTP requests.

    Returns:
        int:
            HTTP status code returned by the webhook upon successful execution.

    Security Considerations:
        - This task sends sensitive information; ensure HTTPS is used in production.
        - Avoid logging the `code` value to prevent credential leakage.

    Usage:
        send_password_email.delay(email=email, code=code)
    """
   
    url = "http://n8n:4388/webhook-test/send_password"
    
    data = {
        "email": email,
        "subject": "رمز ارسال شده",
        "message": code
    }
    try:
        res = requests.post(url, json=data, timeout=10)
        res.raise_for_status()
        return res.status_code
    except requests.RequestException as exc:
     
        raise self.retry(exc=exc)