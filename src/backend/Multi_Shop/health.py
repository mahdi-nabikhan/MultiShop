from django.db import connection
from django.core.cache import cache
from django.http import JsonResponse
from elasticsearch import Elasticsearch
from django.conf import settings


def health_check(request):
    health = {
        "status": "healthy",
        "database": "up",
        "redis": "up",
        "elasticsearch": "up",
    }

    # PostgreSQL
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        health["database"] = "down"

    # Redis
    try:
        cache.set("health_check", "ok", timeout=10)
        if cache.get("health_check") != "ok":
            health["redis"] = "down"
    except Exception:
        health["redis"] = "down"

    # Elasticsearch
    try:
        es = Elasticsearch(settings.ELASTICSEARCH_DSL["default"]["hosts"])
        if not es.ping():
            health["elasticsearch"] = "down"
    except Exception:
        health["elasticsearch"] = "down"

    if "down" in health.values():
        health["status"] = "unhealthy"
        return JsonResponse(health, status=503)

    return JsonResponse(health, status=200)