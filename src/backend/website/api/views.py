from vendor.api.v1.serializers import StoreSerializer, ProductSerializer
from rest_framework import status
from vendor.models import Store
import random
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from website.models import Product
from vendor.api.v1.serializers import ProductSerializer
from rest_framework.generics import ListAPIView, GenericAPIView
from vendor.permissions import IsStoreOwner
from elasticsearch import Elasticsearch
es = Elasticsearch("http://localhost:59200")


class RandomProductsApiView(APIView):
    """
    API view to return a random selection of products.

    Responsibilities
    ----------------
    - GET: Retrieve 5 random products (or fewer if total products < 5).
    - Caches the result for 300 seconds (5 minutes) to reduce database load.

    Attributes
    ----------
    (No class-level attributes; caching uses a fixed key.)

    Methods
    -------
    get(self, request)
        - Handles GET requests.
        - Tries to fetch cached data with key 'random_products_6'.
        - If cache miss: collects all product IDs, selects up to 5 random ones,
          retrieves the corresponding Product queryset, serializes with ProductSerializer,
          stores in cache for 300 seconds.
        - Returns serialized product data as JSON response.

    Usage
    -----
        # Get random products
        GET /api/v1/random-products/ -> returns list of up to 5 random products.

    Notes
    -----
    - The cache key 'random_products_6' suggests a previous version or typo (maybe intended 5).
    - If total products count is less than 5, returns all existing products (random.sample handles it).
    - No authentication required.
    """

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
    """
    API view to list products with optional sorting by price.

    Responsibilities
    ----------------
    - GET: Return a list of all products, optionally ordered by price ascending or descending.

    Attributes
    ----------
    serializer_class : ProductSerializer
        - Serializer used to convert Product queryset to JSON.

    Methods
    -------
    get_queryset(self)
        - Returns a queryset of all products.
        - Reads query parameter 'order' from request.GET.
        - If order == 'price_asc': orders by price ascending.
        - If order == 'price_dsc': orders by price descending.
        - Otherwise returns default ordering (database order).
        - Prints the resulting queryset to console for debugging.

    Usage
    -----
        # List all products (default order)
        GET /api/v1/products/

        # List products sorted by price ascending
        GET /api/v1/products/?order=price_asc

        # List products sorted by price descending
        GET /api/v1/products/?order=price_dsc

    Notes
    -----
    - Inherits from ListAPIView, so pagination settings from DRF settings apply.
    - No filtering other than ordering; returns all products.
    - The print statement is for development logging.
    """

    serializer_class = ProductSerializer

    def get_queryset(self):
        query_set = Product.objects.all()
        order_param = self.request.GET.get('order')

        if order_param == 'price_asc':
            query_set = query_set.order_by('price')
            print('this is ', query_set)

        elif order_param == 'price_dsc':
            query_set = query_set.order_by('-price')
            print('this is ', query_set)
        return query_set


class ProductSearchApi(APIView):
    """
    API view to search products using Elasticsearch with filters and boost.

    Responsibilities
    ----------------
    - GET: Perform a full-text search on products using Elasticsearch.
    - Supports optional filtering by category and store.
    - Boosts matches on 'name' field (boost=3) over 'description' field.

    Attributes
    ----------
    (Uses global `es` client instance.)

    Methods
    -------
    get(self, request)
        - Reads query parameters: 'q' (search term), 'category', 'store'.
        - Builds an Elasticsearch bool query:
            - 'must' filters: term filters for category and store (if provided).
            - 'should' clauses: match query on 'name' with boost=3, and match on 'description'.
        - Sends request to Elasticsearch index 'products_index'.
        - Extracts hits, each containing '_id', '_score', and all _source fields.
        - Returns list of hits as JSON response.

    Usage
    -----
        # Basic search
        GET /api/v1/search/?q=laptop

        # Search within a category
        GET /api/v1/search/?q=laptop&category=electronics

        # Search with store filter
        GET /api/v1/search/?q=laptop&store=123

        # Combined filters
        GET /api/v1/search/?q=laptop&category=electronics&store=456

    Notes
    -----
    - Requires Elasticsearch running at "http://localhost:59200".
    - Index name is hardcoded as 'products_index'.
    - If no 'q' parameter is provided, the query still returns results? (Because 'q' is optional; should clause may be empty.) Actually must_filters may be empty, should clauses still run with empty query? It will match all documents? Behavior depends on ES. The code doesn't force 'q' to be required.
    - No authentication required.
    """

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
                        {"match": {"name": {"query": q, "boost": 3}}},
                        {"match": {"description": {"query": q}}}
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
    """
    API view to provide autocomplete suggestions for product names.

    Responsibilities
    ----------------
    - GET: Return a list of unique product names that match a prefix query (match_phrase_prefix) on the 'name_auto' field.

    Attributes
    ----------
    (Uses global `es` client.)

    Methods
    -------
    get(self, request)
        - Reads query parameter 'q' (prefix string).
        - Constructs Elasticsearch match_phrase_prefix query on field 'name_auto'.
        - Executes the query on index 'products_index'.
        - Extracts unique product names from the hits (using a set to deduplicate).
        - Returns the list of suggestion strings as JSON response.

    Usage
    -----
        # Get autocomplete suggestions starting with 'lap'
        GET /api/v1/autocomplete/?q=lap -> ["laptop", "laptop bag", "lapel pin"]

        # Empty query
        GET /api/v1/autocomplete/?q= -> may return empty list or all names depending on ES.

    Notes
    -----
    - Requires an Elasticsearch index with a 'name_auto' field analyzed for prefix matching (e.g., using edge_ngram tokenizer).
    - Deduplicates names using set comprehension because multiple documents can have the same name.
    - No pagination; returns all matching unique names up to the limit set by Elasticsearch's default size (usually 10).
    - No authentication required.
    """

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

        suggestions = list({hit["_source"]["name"]
                           for hit in results["hits"]["hits"]})

        return Response(suggestions)


class ListStoreApiView(GenericAPIView):
    serializer_class = StoreSerializer

    def get(self, request):
        data = Store.objects.all()
        serializer = self.serializer_class(
            instance=data, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductListApiView(GenericAPIView):
    serializer_class = ProductSerializer
   
    def get_queryset(self, pk):
        return Product.objects.filter(store__pk=pk)

    def get(self, requst, pk):
        data = self.get_queryset(pk)
        serializer = self.serializer_class(
            instance=data, many=True, context={'request': requst})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductDetailAPIView(GenericAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self, pk):
        return Product.objects.get(pk=pk)

    def get(self, request, pk):
        data = self.get_queryset(pk)
        serializer = self.serializer_class(
            instance=data, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class StoreDetailApiView(GenericAPIView):
    serializer_class = StoreSerializer

    def get_queryset(self, pk):
        return Store.objects.get(pk=pk)

    def get(self, request, pk):
        data = self.get_queryset(pk=pk)
        serializer = self.serializer_class(
            instance=data, context={"request", request})
        return Response(serializer.data, status=status.HTTP_200_OK)


