import random
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from website.models import Product
from vendor.api.v1.serializers import ProductSerializer

class RandomProductsApiView(APIView):
    def get(self, request):
        cache_key = "random_products_6"
        products = cache.get(cache_key)

        if not products:
            
            product_ids = list(Product.objects.values_list("id", flat=True))
            random_ids = random.sample(product_ids, min(5, len(product_ids)))

            queryset = Product.objects.filter(id__in=random_ids)
            serializer = ProductSerializer(queryset, many=True)

            products = serializer.data  
            cache.set(cache_key, products, timeout=300)  

        return Response(products)
