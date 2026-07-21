from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .serializers import *
from rest_framework.authtoken.models import Token
from ...permissions import IsStoreOwner
from .serializers import StoreSerializer

class ManagerRegisterAPIView(GenericAPIView):
    """
    API endpoint for registering a new manager user.

    This view handles the creation of a manager account by validating the
    incoming request data using `ManagerSerializer`. Upon successful
    registration, a related authentication token is automatically generated
    for the associated user.

    Workflow:
        1. Receive manager registration data via POST request.
        2. Validate input data using `ManagerSerializer`.
        3. Create a new Manager instance and its related User.
        4. Generate an authentication token for the created user.
        5. Return serialized manager data with HTTP 201 status.

    Authentication:
        Not required.

    Permissions:
        Public access (no authentication required).

    HTTP Methods:
        POST

    Responses:
        201 CREATED:
            Manager successfully registered and token created.
        400 BAD REQUEST:
            Validation errors in submitted data.
    """

    serializer_class = ManagerSerializer
    queryset = Manager.objects.all()

    def post(self, request):
        """
        Handle manager registration request.

        Args:
            request (Request): DRF request object containing manager
                registration data.

        Returns:
            Response:
                - 201 CREATED with serialized manager data on success.
                - 400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            manager = serializer.save()
            Token.objects.create(user=manager.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminRegisterAPIView(GenericAPIView):
    """
    API endpoint for registering a new admin user.

    This view handles admin account creation by validating incoming
    request data using `AdminsSerializer`. After successful registration,
    an authentication token is generated for the related user and a
    confirmation response is returned.

    Workflow:
        1. Receive admin registration data via POST request.
        2. Validate input data using `AdminsSerializer`.
        3. Create a new Admin instance and its related User.
        4. Generate an authentication token for the created user.
        5. Return a success message with admin email.

    Authentication:
        Not required.

    Permissions:
        Public access (no authentication required).

    HTTP Methods:
        POST

    Responses:
        201 CREATED:
            Admin successfully registered.
        400 BAD REQUEST:
            Validation errors in submitted data.
    """
    serializer_class = AdminsSerializer

    def post(self, request):
        """
        Handle admin registration request.

        Args:
            request (Request): DRF request object containing admin
                registration data.

        Returns:
            Response:
                - 201 CREATED with success message and admin email on success.
                - 400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            admin = serializer.save()
            Token.objects.create(user=admin.user)
            return Response(
                {'email': serializer.validated_data.get('email'), 'massage': 'admin successfully registered'},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OperatorRegisterAPIView(GenericAPIView):
    """
    API endpoint for registering a new operator user.

    This view handles operator account creation by validating incoming
    request data using `OperatorSerializer`. After successful registration,
    an authentication token is generated for the related user and a
    confirmation response is returned.

    Workflow:
        1. Receive operator registration data via POST request.
        2. Validate input data using `OperatorSerializer`.
        3. Create a new Operator instance and its related User.
        4. Generate an authentication token for the created user.
        5. Return a success message with operator email.

    Authentication:
        Not required.

    Permissions:
        Public access (no authentication required).

    HTTP Methods:
        POST

    Responses:
        201 CREATED:
            Operator successfully registered.
        400 BAD REQUEST:
            Validation errors in submitted data.
    """
    serializer_class = OperatorSerializer

    def post(self, request):
        """
        Handle operator registration request.

        Args:
            request (Request): DRF request object containing operator
                registration data.

        Returns:
            Response:
                - 201 CREATED with success message and operator email on success.
                - 400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            admin = serializer.save()
            Token.objects.create(user=admin.user)
            return Response(
                {'email': serializer.validated_data.get('email'), 'massage': 'admin successfully registered'},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddProductAPIView(GenericAPIView):
    """
    API endpoint for listing and creating products based on user role.

    This view allows Managers and Admins to:
        - Retrieve a list of products related to their own stores.
        - Create new products within stores they own or manage.

    The accessible products are determined dynamically based on the
    authenticated user's role:
        - Manager: Products belonging to stores managed by the user.
        - Admin: Products belonging to stores owned by the user.

    Authentication:
        Required.

    Permissions:
        Manager or Admin only.

    HTTP Methods:
        GET:
            Retrieve a list of products accessible to the current user.
        POST:
            Create a new product for a store owned or managed by the user.

    Responses:
        200 OK:
            Successfully retrieved product list.
        201 CREATED:
            Product successfully created.
        400 BAD REQUEST:
            Validation errors in submitted data.
        404 NOT FOUND:
            User is neither a manager nor an admin.
    """

    serializer_class = ProductSerializer
    model = Product

    def get_queryset(self):
        """
        Return products related to the authenticated user's role.

        The queryset is determined by checking whether the current user
        is associated with a Manager or Admin role.

        Returns:
            QuerySet:
                Products filtered by store ownership or management.

        Raises:
            NotFound:
                If the user is not associated with any valid role.
        """
        my_manager = Manager.objects.filter(user=self.request.user).exists()
        my_admin = Admin.objects.filter(user=self.request.user).exists()
        if my_manager:
            obj = self.model.objects.filter(store__manager__user=self.request.user)
            return obj
        elif my_admin:
            obj = self.model.objects.filter(store__admin__user=self.request.user)
            return obj
        else:
            return Response('no such user', status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        """
        Retrieve a list of products accessible to the current user.

        Args:
            request (Request): DRF request object.

        Returns:
            Response:
                - 200 OK with serialized product data.
                - 404 NOT FOUND if the user has no valid role.
        """
        obj = self.get_queryset()
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new product.

        The product will be associated with a store that belongs to
        or is managed by the authenticated user.

        Args:
            request (Request): DRF request object containing product data.

        Returns:
            Response:
                - 201 CREATED with serialized product data on success.
                - 400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailAPIView(GenericAPIView):
    """
    API endpoint for retrieving, updating, and deleting a single product.

    This view provides full CRUD operations on an individual product
    identified by its primary key (pk). It supports retrieving product
    details, full updates, partial updates, and deletion.

    Authentication:
        Required.

    Permissions:
        Admin or Manager users only.

    HTTP Methods:
        GET:
            Retrieve product details.
        PUT:
            Update all fields of a product.
        PATCH:
            Partially update specific fields of a product.
        DELETE:
            Delete the specified product.

    Responses:
        200 OK:
            Product retrieved or updated successfully.
        204 NO CONTENT:
            Product successfully deleted.
        400 BAD REQUEST:
            Validation errors in submitted data.
        404 NOT FOUND:
            Product does not exist.
    """
    
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    model = Product

    def get(self, request, pk):
        """
        Retrieve product details by ID.

        Args:
            request (Request): DRF request object.
            pk (int): Primary key of the product.

        Returns:
            Response:
                200 OK with serialized product data.
        """
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Fully update a product.

        All product fields must be provided in the request body.

        Args:
            request (Request): DRF request object containing updated product data.
            pk (int): Primary key of the product.

        Returns:
            Response:
                200 OK with updated product data on success.
                400 BAD REQUEST with validation errors on failure.
        """
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(instance=obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """
        Partially update a product.

        Only the provided fields will be updated.

        Args:
            request (Request): DRF request object containing partial product data.
            pk (int): Primary key of the product.

        Returns:
            Response:
                200 OK with updated product data on success.
                400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        obj.delete()
        return Response({'massage': 'your product successfully deleted'}, status=status.HTTP_204_NO_CONTENT)


class StoreUpdateApiView(GenericAPIView):
    """
    API endpoint for updating a store owned by the authenticated manager.

    This view allows a Manager user to update the details of their
    associated store. The store is resolved based on the currently
    authenticated user.

    Authentication:
        Required.

    Permissions:
        Manager users only.

    HTTP Methods:
        PUT:
            Fully update store details.
        PATCH:
            Partially update store details.

    Responses:
        200 OK:
            Store successfully updated.
        400 BAD REQUEST:
            Validation errors in submitted data.
        404 NOT FOUND:
            Store does not exist for the current user.
    """

    serializer_class = StoreSerializer

    def get_queryset(self):
        """
        Retrieve the store associated with the authenticated manager.

        Returns:
            Store:
                Store instance owned by the current manager.

        Raises:
            DoesNotExist:
                If no store is associated with the current user.
        """
        store = Store.objects.get(manager__user=self.request.user)
        return store

    def put(self, request):
        """
        Fully update the authenticated manager's store.

        Args:
            request (Request): DRF request object containing updated store data.

        Returns:
            Response:
                200 OK with updated store data on success.
                400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        store = self.get_queryset()
        serializer = self.serializer_class(instance=store, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        """
        Partially update the authenticated manager's store.

        Only the provided fields will be updated.

        Args:
            request (Request): DRF request object containing partial store data.

        Returns:
            Response:
                200 OK with updated store data on success.
                400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        store = self.get_queryset()
        serializer = self.serializer_class(instance=store, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllProductShopApiView(GenericAPIView):
    """
    API endpoint for retrieving all products of a shop.

    This view allows authenticated Manager or Admin users to retrieve
    all products related to the store they manage or own. The product
    list is determined dynamically based on the user's role.

    Authentication:
        Required.

    Permissions:
        Manager or Admin users only.

    HTTP Methods:
        GET:
            Retrieve all products of the current user's shop.

    Responses:
        200 OK:
            Products successfully retrieved.
        404 NOT FOUND:
            No store or products found for the current user.
    """
    
    serializer_class = ProductSerializer
    model = Product

    def get_queryset(self):
        """
        Return all products related to the authenticated user's shop.

        The queryset is filtered based on whether the current user
        is associated with a store as a Manager or an Admin.

        Returns:
            QuerySet:
                Products related to the user's store.
            dict:
                {'not found'} if the user has no associated store.
        """
        
        if Store.objects.filter(manager__user=self.request.user).exists():
            print('this is you products -----------------------------',
                  self.model.objects.filter(store__manager__user=self.request.user), 'this  your user',
                  self.request.user)
            return self.model.objects.filter(store__manager__user=self.request.user)
        elif Store.objects.filter(admin__user=self.request.user).exists():
            return self.model.objects.filter(store__admin__user=self.request.user)
        else:
            return {'not found'}

    def get(self, request):
        """
        Retrieve all products of the authenticated user's shop.

        Args:
            request (Request): DRF request object.

        Returns:
            Response:
                200 OK with serialized product data.
        """
        obj = self.get_queryset()
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddProductImageAPIView(GenericAPIView):
    """
    API endpoint for adding an image to a specific product.

    This view allows authenticated users (Manager or Admin) to
    upload images for a product identified by its primary key (pk).
    The image is handled via `AddImageSerializer`, which manages
    validation and association with the target product.

    Authentication:
        Required.

    Permissions:
        Manager or Admin users only.

    HTTP Methods:
        POST:
            Upload a new image for the specified product.

    Path Parameters:
        pk (int): Primary key of the product to which the image will be added.

    Responses:
        201 CREATED:
            Image successfully added to the product.
        400 BAD REQUEST:
            Validation errors in submitted image data.
    """

    serializer_class = AddImageSerializer
    model = Product

    def post(self, request, pk):
        """
        Handle image upload for a specific product.

        Args:
            request (Request): DRF request object containing image data.
            pk (int): Primary key of the target product.

        Returns:
            Response:
                - 201 CREATED with serialized image data on success.
                - 400 BAD REQUEST with validation errors on failure.
        """
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddProductsDiscountAPIView(GenericAPIView):
    """
    Create a new discount for a specific product.

    This endpoint allows a store manager to create a discount
    for the product identified by its primary key (pk).

    URL Parameters:
        pk (int): Product ID.

    Request Body:
        {
            "title": "Summer Sale",
            "discount_percent": 20,
            "start_date": "2026-07-15",
            "end_date": "2026-07-30"
        }

    Responses:
        201 Created:
            Discount created successfully.

        400 Bad Request:
            Invalid request data.
    """
    
    serializer_class = AddDiscountSerializer
    queryset = Discount.objects.all()

    def post(self, request, pk):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk):
        data = self.get_queryset().filter(products__pk=pk)
        serializer = self.serializer_class(data, many=True,context= {'request':request,'pk':pk})
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderItemUpdateStatusApiView(GenericAPIView):
    """
    Update the status of an order item.

    This endpoint allows updating the status of a specific
    order item identified by its primary key.

    URL Parameters:
        pk (int): Order item ID.

    Request Body:
        {
            "status": "processing"
        }

    Responses:
        200 OK:
            Order item status updated successfully.

        400 Bad Request:
            Invalid request data.

        404 Not Found:
            Order item does not exist.
    """
    serializer_class=OrderItemUpdateStatusSerializer
    queryset=OrderItem.objects.all()
    
    
    def put(self,request,pk):
        obj=self.queryset.get(pk=pk)
        serializer=self.serializer_class(data=request.data, instance=obj)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data,status=status.HTTP_404_NOT_FOUND)
        


class StoreDetailAndDelete(GenericAPIView):
    """
    Retrieve, update, or delete the authenticated manager's store.

    This endpoint allows the store owner to:
    - GET: Retrieve store details.
    - PUT: Update all store information.
    - PATCH: Partially update store information.
    - DELETE: Permanently delete the store.

    Permissions:
        - Only the authenticated store owner can access this endpoint.

    Responses:
        200 OK:
            Store retrieved or updated successfully.

        202 Accepted:
            Store updated successfully.

        204 No Content:
            Store deleted successfully.

        400 Bad Request:
            Invalid request data.

        404 Not Found:
            Store not found.
    """
    permission_classes=(IsStoreOwner,)
    serializer_class = StoreSerializer
    
    
    
      

    def get_queryset(self):
        return Store.objects.get(manager__user= self.request.user)

    def get(self, request):
        data = self.get_queryset()
        serializer = self.serializer_class(
            instance=data, context={"request", request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        data = self.get_queryset()
        data.delete()
        return Response({'msg': 'store successfully deleted'}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request):
        obj = self.get_queryset()
        data = request.data
        serilaizer = self.serializer_class(
            instance=obj, data=data, context={"request": request})
        if serilaizer.is_valid():
            serilaizer.save()
            return Response({'msg': 'store successfully Updated'}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serilaizer.errors, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request):
        obj = self.get_queryset()
        data = request.data
        serilaizer = self.serializer_class(instance=obj, data=data, context={
                                           "request": request}, partial=True)
        if serilaizer.is_valid():
            serilaizer.save()
            return Response({'msg': 'store successfully Updated'}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serilaizer.errors, status=status.HTTP_404_NOT_FOUND)


class ManagerAndOperatorUserRoleAPIViews(GenericAPIView):
    """
    Retrieve the role of the authenticated user.

    This endpoint determines whether the authenticated user
    is a manager, operator, or admin and returns the user's role.

    Permissions:
        - Authenticated users only.

    Responses:
        200 OK:
            User role retrieved successfully.

            Example:
            {
                "role": "manager"
            }

        401 Unauthorized:
            Authentication credentials were not provided.
    """

    def get(self,request):
        user = request.user
        role =''
        
        if Manager.objects.filter(user=user).exists():
            role = 'manager'
        if Operator.objects.filter(user=user).exists():
            role = 'operator'
        if Admin.objects.filter(user=user).exists():
            role = 'admin'
        return Response({'role':role},status=status.HTTP_200_OK)        
    
    
class ShopOrderListAPIView(GenericAPIView):
    serializer_class = ListOrderSerialazers
    
    
    def get_queryset(self):
        store = (
        self.request.user.manager.store
        if hasattr(self.request.user, "manager")
        else self.request.user.admin.shop
        if hasattr(self.request.user, "admin")
        else self.request.user.operator.shop
        )
        return Order.objects.filter(
            items__product__store=store
        ).distinct()
        
        
    def get(self,request):
        obj= self.get_queryset()
        serializer=self.serializer_class(instance=obj,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class DeleteProductDiscount(GenericAPIView):
    
    
    def get_queryset(self,pk):
        return Discount.objects.get(pk=pk)
    
    
    def delete(self,request,pk):
        obj = self.get_queryset(pk)
        obj.delete()
        return Response({'message':'discount deleted successfully'})
    
    
        
        
        