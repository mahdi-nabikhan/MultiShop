import random
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from website.models import Product
from vendor.api.v1.serializers import ProductSerializer
from rest_framework.generics import ListAPIView
from elasticsearch import Elasticsearch
es = Elasticsearch("http://localhost:59200")

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
            
            

class ProductSearchApi(APIView):
    def get(self, request):
        q = request.query_params.get("q", "")
        category = request.query_params.get("category")
        store = request.query_params.get("store")

        must_filters = []
        if category:
            must_filters.append({"term": {"category": category}})

        if store:
            must_filters.append({"term": {"store": store}})

        body = {
            "query": {
                "bool": {
                    "must": must_filters,
                    "should": [
                        { "match": { "name": { "query": q, "boost": 3 } } },
                        { "match": { "description": { "query": q } } }
                    ]
                }
            }
        }

        results = es.search(index="products_index", body=body)

        hits = [
            {
                "id": hit["_id"],
                "score": hit["_score"],
                **hit["_source"]
            }
            for hit in results["hits"]["hits"]
        ]

        return Response(hits)
    
class AutoCompleteApi(APIView):
    def get(self, request):
        q = request.query_params.get("q", "")

        body = {
            "query": {
                "match_phrase_prefix": {
                    "name_auto": q
                }
            }
        }

        results = es.search(index="products_index", body=body)

        suggestions = list({hit["_source"]["name"] for hit in results["hits"]["hits"]})

        return Response(suggestions)
