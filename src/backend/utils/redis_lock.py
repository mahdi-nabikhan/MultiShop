import time
import uuid

from django.conf import settings
from django.core.cache import cache


class RedisDistributedLock:
    """
    Distributed lock based on Redis.

    The lock prevents multiple workers/processes from entering
    the same critical section simultaneously.
    """

    def __init__(
        self,
        key,
        timeout=10,
        blocking_timeout=5,
        sleep=0.1,
    ):
        self.key = f"lock:{key}"
        self.timeout = timeout
        self.blocking_timeout = blocking_timeout
        self.sleep = sleep
        self.token = str(uuid.uuid4())

    def acquire(self):
        """
        Acquire the lock.

        Returns:
            bool: True if lock was acquired, otherwise False.
        """

        start_time = time.monotonic()

        while True:
            acquired = cache.add(
                self.key,
                self.token,
                timeout=self.timeout,
            )

            if acquired:
                return True

            if (
                self.blocking_timeout is not None
                and time.monotonic() - start_time
                >= self.blocking_timeout
            ):
                return False

            time.sleep(self.sleep)

    def release(self):
        """
        Release the lock only if this instance owns it.
        """

        client = cache.client.get_client()

        current_token = client.get(self.key)

        if current_token is None:
            return

        if isinstance(current_token, bytes):
            current_token = current_token.decode()

        if current_token == self.token:
            client.delete(self.key)

    def __enter__(self):
        if not self.acquire():
            raise TimeoutError(
                f"Could not acquire Redis lock: {self.key}"
            )

        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.release()