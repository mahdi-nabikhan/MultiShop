# throttles.py
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    """
    Custom rate throttle for login attempts.

    ---
    **Purpose:**
        Limits the number of login attempts for anonymous users to prevent
        brute-force attacks. Uses DRF's `AnonRateThrottle` as the base class.

    ### Configuration:
        - `scope`: Defines the throttle scope as `'login'`.
          Must be configured in Django REST framework settings:
            REST_FRAMEWORK = {
                'DEFAULT_THROTTLE_RATES': {
                    'login': '5/minute',  # Example rate limit
                }
            }

    ### Behavior:
        - Applies only to unauthenticated (anonymous) users.
        - Requests exceeding the defined rate will receive HTTP 429 Too Many Requests.

    ### Notes:
        - Can be applied to login API views via the `throttle_classes` attribute.
        - Authenticated users are not affected by this throttle.
    """
    scope = 'login'
