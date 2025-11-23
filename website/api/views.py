import random
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from website.models import Product
from vendor.api.v1.serializers import ProductSerializer
from rest_framework.generics import ListAPIView

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


class ProductsFilteringAPIView(ListAPIView):
    serializer_class=ProductSerializer
    
    
    
    def get_queryset(self):
        query_set=Product.objects.all()
        order_param=self.request.GET.get('order')
        
        if order_param == 'price_asc':
            query_set=query_set.order_by('price')
            print('this is ',query_set)
            
        elif order_param == 'price_dsc':
            query_set=query_set.order_by('-price')
            print('this is ',query_set)
        return query_set
            
            
