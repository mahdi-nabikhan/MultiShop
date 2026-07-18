from rest_framework.response import Response
from rest_framework import generics, status
from .serializer import *
from order.sessions import CartSession

class OrderListApiView(generics.GenericAPIView):
    """
    API view to handle listing and creating Orders for the authenticated Customer.

    Responsibilities
    ----------------
    - GET: List all orders for the currently authenticated customer.
    - POST: Create a new order for the authenticated customer.

    Attributes
    ----------
    model : Order
        - The model representing customer orders.
    serializer_class : OrderSerializer
        - Serializer to validate and format Order data.

    Methods
    -------
    get_queryset(self)
        - Returns a queryset of Orders filtered by the current user.
        - Ensures customers only see their own orders.

    get(self, request)
        - Handles GET requests.
        - Serializes and returns all orders belonging to the authenticated customer.
        - Response status: 200 OK.

    post(self, request)
        - Handles POST requests to create a new order.
        - Validates input via OrderSerializer.
        - On success, returns serialized order data with status 201 CREATED.
        - On validation failure, returns errors with status 400 BAD REQUEST.

    Usage
    -----
        # List orders
        GET /api/v1/orders/  -> returns all orders for the authenticated customer

        # Create an order
        POST /api/v1/orders/
        {
            "field1": "value1",
            "field2": "value2",
            ...
        }
        -> returns created order data on success

    Notes
    -----
    - The view requires authentication; unauthenticated users will be denied access.
    - Context is passed to the serializer for potential use of `request` data in nested serialization.
    - This view is intended for Customer-facing APIs only.
    """
    model = Order
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer__user=self.request.user)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True,context={'request':request})
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemCreateApiView(generics.GenericAPIView):
    """
    API view to create a new OrderItem for a specific Order.

    Responsibilities
    ----------------
    - Handles POST requests to add an item to an existing Order.
    - Validates the input data using OrderItemSerializer.
    - Associates the new OrderItem with the Order specified by `pk`.

    Attributes
    ----------
    serializer_class : OrderItemSerializer
        - Serializer used for validation and serialization of OrderItem data.

    Methods
    -------
    post(self, request, pk)
        - Handles POST requests.
        - `pk` is the ID of the Order to which the item will be added.
        - Validates the input data with OrderItemSerializer.
        - On success: saves the OrderItem and returns serialized data with status 201 CREATED.
        - On failure: returns serializer errors with status 400 BAD REQUEST.

    Usage
    -----
        # Add an item to order with ID 5
        POST /api/v1/order-item/create/5/
        {
            "product": 12,
            "quantity": 2
        }
        -> returns the created OrderItem data on success

    Notes
    -----
    - The view requires the user to be authenticated.
    - Context is passed to the serializer, including the request and order ID (`pk`).
    - Only items for the specified order (`pk`) will be created.
    - Typically used in Customer-facing APIs for building orders dynamically.
    """
    serializer_class = OrderItemSerializer

    def post(self, request, pk):
        serializer = self.serializer_class(data=request.data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemListAPIView(generics.GenericAPIView):
    """
    API view to list all OrderItems for a specific Order.

    Responsibilities
    ----------------
    - Handles GET requests to retrieve all items associated with a given Order.
    - Filters OrderItem objects by the order ID provided in the URL (`pk`).
    - Serializes the list of OrderItems using OrderItemSerializer.

    Attributes
    ----------
    serializer_class : OrderItemSerializer
        - Serializer used to format OrderItem data.
    queryset : QuerySet
        - Base queryset of all OrderItem objects (filtered by order in get method).

    Methods
    -------
    get(self, request, pk)
        - Handles GET requests.
        - `pk` is the ID of the Order whose items will be listed.
        - Returns serialized list of OrderItems with status 200 OK.

    Usage
    -----
        # List items of order with ID 5
        GET /api/v1/order-items/5/
        -> returns a list of OrderItem objects for that order

    Notes
    -----
    - The view requires authentication; only authenticated users should access their own orders.
    - This endpoint is typically used to display order details in a customer dashboard.
    - If the order has no items, an empty list is returned.
    """
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()

    def get(self, request, pk):
        obj = self.queryset.filter(order__pk=pk)
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderItemDetailView(generics.GenericAPIView):
    """
    API view to retrieve, update, partially update, or delete a specific OrderItem.

    Responsibilities
    ----------------
    - GET: Retrieve details of a specific OrderItem by its ID (`pk`).
    - PUT: Fully update an existing OrderItem and recalculate its total price.
    - PATCH: Partially update fields of an OrderItem and recalculate total price.
    - DELETE: Remove an OrderItem from the database.

    Attributes
    ----------
    serializer_class : OrderItemSerializer
        - Serializer used for validation and serialization of OrderItem data.
    queryset : QuerySet
        - Base queryset of all OrderItem objects.

    Methods
    -------
    get(self, request, pk)
        - Retrieve the OrderItem with the given `pk`.
        - Returns serialized data with status 200 OK.

    put(self, request, pk)
        - Fully update the OrderItem with the given `pk`.
        - Recalculates `total` as product.price * quantity.
        - On success: returns updated data with status 200 OK.
        - On failure: returns errors with status 404 NOT FOUND.

    patch(self, request, pk)
        - Partially update the OrderItem with the given `pk`.
        - Recalculates `total` as product.price * quantity.
        - On success: returns updated data with status 200 OK.
        - On failure: returns errors with status 404 NOT FOUND.

    delete(self, request, pk)
        - Deletes the OrderItem with the given `pk`.
        - Returns a confirmation message with status 204 NO CONTENT.

    Usage
    -----
        # Retrieve OrderItem with ID 10
        GET /api/v1/order-item/10/

        # Update OrderItem
        PUT /api/v1/order-item/10/
        {
            "product": 5,
            "quantity": 3
        }

        # Partial update
        PATCH /api/v1/order-item/10/
        {
            "quantity": 2
        }

        # Delete
        DELETE /api/v1/order-item/10/

    Notes
    -----
    - Authentication is required; users should only access their own order items.
    - The `total` field is automatically recalculated on PUT/PATCH to ensure consistency.
    - Returns 404 NOT FOUND if the OrderItem does not exist or validation fails.
    """
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()

    def get(self, request, pk):
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        data = request.data
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(data=data, instance=obj)
        if serializer.is_valid():
            
            serializer.save(total=obj.product.price * obj.quantity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        data = request.data
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(data=data, instance=obj, partial=True)
        if serializer.is_valid():
            
            serializer.save(total=obj.product.price * obj.quantity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        self.queryset.get(pk=pk).delete()
        return Response({'details': 'object deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ShopOrderListApiView(generics.GenericAPIView):
    """
    API view to list all OrderItems for products managed by the authenticated store manager.

    Responsibilities
    ----------------
    - Handles GET requests to retrieve all OrderItems associated with products of the manager's store.
    - Filters OrderItem objects based on the authenticated user's managed store.

    Attributes
    ----------
    serializer_class : OrderItemSerializer
        - Serializer used to format and validate OrderItem data.

    Methods
    -------
    get_queryset(self)
        - Returns a queryset of OrderItems filtered by the store managed by the current user.

    get(self, request)
        - Handles GET requests.
        - Serializes and returns all OrderItems belonging to products managed by the authenticated manager.
        - Response status: 200 OK.

    Usage
    -----
        # List all OrderItems for the manager's store
        GET /api/v1/shop/orders/
        -> returns a list of OrderItem objects associated with the manager's products

    Notes
    -----
    - Requires authentication; only store managers should access this endpoint.
    - Useful for building dashboards or order management interfaces for store managers.
    - If no orders exist for the store, returns an empty list.
    """
    serializer_class = OrderItemSerializer
    
    def get_queryset(self):
        return OrderItem.objects.filter(product__store__manager__user=self.request.user)

    def get(self,request):
        obj=self.get_queryset()
        serializer=self.serializer_class(obj,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class OrderItemApiView(generics.GenericAPIView):
    """
    API view to list all OrderItems of the currently active (incomplete) Order for the authenticated Customer.

    Responsibilities
    ----------------
    - Handles GET requests to retrieve all OrderItems for the customer's active order (status=False).
    - Ensures customers only access their own active order items.
    - Serializes the data using OrderItemSerializer.

    Attributes
    ----------
    serializer_class : OrderItemSerializer
        - Serializer used for validation and formatting of OrderItem data.

    Methods
    -------
    get_queryset(self)
        - Retrieves the Order with status=False for the authenticated customer.
        - Returns a queryset of OrderItems associated with that order.

    get(self, request)
        - Handles GET requests.
        - Serializes and returns all OrderItems in the active order.
        - Response status: 200 OK.

    Usage
    -----
        # List active order items for the authenticated customer
        GET /api/v1/order-items/active/
        -> returns a list of OrderItem objects for the current active order

    Notes
    -----
    - Requires authentication; unauthenticated users will be denied access.
    - If no active order exists, this view may raise an exception (Order.DoesNotExist).
    - Context is passed to the serializer for potential nested serialization or request-specific logic.
    - Intended for building shopping cart or checkout interfaces for customers.
    """
    serializer_class=OrderItemSerializer
    
    def get_queryset(self):
        order_obj=Order.objects.get(customer__user=self.request.user,status=False)
        return OrderItem.objects.filter(order=order_obj)
    
    def get(self,request):
        order_item=self.get_queryset()
        serializer=self.serializer_class(order_item,context={'request':request},many=True)
        return Response (serializer.data,status=status.HTTP_200_OK)
        
class BillCreationApiView(generics.GenericAPIView):
    serializer_class=BillSerilizers
    
    
    def get(self,request,pk):
        pass
    
    
    def post(self,requesy,pk):
        pass
    
    



class CartDetailAPIView(generics.GenericAPIView):
    serializer_class = CartItemSerializer

    def get(self, request, *args, **kwargs):
        cart = CartSession(request)

        serializer = self.get_serializer(
            {
                "items": list(cart),
                "total_quantity": cart.get_total_quantity(),
                "total_price": cart.get_total_price(),
            }
        )

        return Response(serializer.data)
    



class CartAddAPIView(generics.GenericAPIView):
    serializer_class = CartAddSerializer

    def post(self, request, pk, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = get_object_or_404(Product, pk=pk)

        cart = CartSession(request)
        cart.add(
            product=product,
            quantity=serializer.validated_data["quantity"],
        )
        cart.save()

        return Response(
            CartMessageSerializer(
                {"detail": "Product added successfully."}
            ).data,
            status=201,
        )