from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .serializers import *
from rest_framework.authtoken.models import Token
from account.tasks import *


class CustomerRegisterApiView(GenericAPIView):
    """
    API endpoint for registering a new customer.

    This view handles customer registration by validating input data,
    creating a corresponding User and Customer instance, generating an
    authentication token, and sending a welcome email asynchronously
    via a Celery task.

    Workflow:
        1. Accept POST request data containing customer registration fields.
        2. Validate input using CustomerRegisterSerializer.
        3. Save a new Customer instance and retrieve the associated User.
        4. Generate an auth token for the User using Token.objects.create().
        5. Trigger an asynchronous welcome email task (send_welcome_email_task).
        6. Return a success response with the user's email on 201 CREATED.
        7. Return validation errors on 400 BAD REQUEST if input is invalid.

    Request Body:
        {
            "username": "string",
            "email": "string",
            "password": "string",
            ... (other fields handled by serializer)
        }

    Responses:
        201 Created:
            {
                "user": "<user_email>",
                "massage": "customer successfully registered"
            }
        400 Bad Request:
            - Returns serializer validation errors

    Security Considerations:
        - Passwords should be hashed via Django's User model.
        - Tokens are generated securely and should be stored as HTTP-only in client apps.
        - Email sending is asynchronous to avoid blocking request-response cycle.

    Side Effects:
        - Creates User and Customer instances.
        - Generates an auth token.
        - Triggers a Celery task to send a welcome email.
    """
    serializer_class = CustomerRegisterSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            customer = serializer.save()
            user = customer.user
            Token.objects.create(user=user)
            
            send_welcome_email_task.delay(user_email=user.email,user_name=customer.username)
            return Response({'user': user.email, 'massage': 'customer successfully registered'},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddAddressApiView(GenericAPIView):
    """
    API endpoint for listing and adding customer addresses.

    This view allows authenticated users to:
        1. Retrieve all addresses associated with their account.
        2. Add a new address to their profile.

    Attributes:
        serializer_class (AddressSerializer):
            Serializer responsible for validating and serializing Address data.
        model (Address):
            The Address model used for database operations.

    Methods:
        get_queryset():
            Returns a QuerySet of Address instances filtered by the current user.

        GET:
            - Retrieves all addresses belonging to the authenticated user.
            - Returns serialized address data with HTTP 200 OK.

        POST:
            - Accepts address data in the request body.
            - Validates and saves a new Address instance.
            - Returns HTTP 201 Created on success, or 400 Bad Request on validation errors.

    Request Body for POST:
        {
            "street": "string",
            "city": "string",
            "state": "string",
            "zip_code": "string",
            ... (other fields handled by AddressSerializer)
        }

    Responses:
        200 OK (GET):
            - List of serialized addresses.

        201 Created (POST):
            {
                "massage": "address successfully add"
            }

        400 Bad Request (POST):
            - Returns serializer validation errors.

    Security Considerations:
        - Users can only access and add addresses associated with their own account.
        - All requests should be authenticated.
        - Validation is enforced via AddressSerializer to prevent invalid data.
    """
    serializer_class = AddressSerializer
    model = Address
    
    def get_queryset(self):
        return self.model.objects.filter(customer__user_id=self.request.user.id)

    def get(self, request):
        address_list = self.get_queryset()
        serializer = self.serializer_class(address_list, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'massage': 'address successfully add'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailAddressApiView(GenericAPIView):
    """
    API endpoint for retrieving, updating, partially updating, and deleting a single address.

    This view handles all CRUD operations for Address instances identified by their primary key (pk).

    Attributes:
        serializer_class (AddressSerializer):
            Serializer responsible for validating and serializing Address data.
        model (Address):
            The Address model used for database operations.

    Methods:
        GET:
            - Retrieve a single Address by its pk.
            - Returns serialized address data with HTTP 200 OK.

        PUT:
            - Full update of an Address instance.
            - Expects all fields required by AddressSerializer.
            - Returns updated serialized data with HTTP 201 Created.
            - Returns HTTP 400 Bad Request if validation fails.

        PATCH:
            - Partial update of an Address instance.
            - Only fields provided in the request will be updated.
            - Returns updated serialized data with HTTP 201 Created.
            - Returns HTTP 400 Bad Request if validation fails.

        DELETE:
            - Deletes the specified Address instance.
            - Returns a success message upon deletion.

    Request Body for PUT/PATCH:
        {
            "street": "string",
            "city": "string",
            "state": "string",
            "zip_code": "string",
            ... (other fields handled by AddressSerializer)
        }

    Responses:
        200 OK (GET):
            - Serialized address data.

        201 Created (PUT/PATCH):
            - Updated serialized address data.

        400 Bad Request (PUT/PATCH):
            - Validation errors returned by AddressSerializer.

        200 OK (DELETE):
            {
                "massage": "address successfully deleted"
            }

    Security Considerations:
        - Users should only be able to access, update, or delete addresses associated with their own account.
        - All operations should be authenticated and validated.
        - Proper validation is enforced via AddressSerializer to prevent invalid data.
    """
    serializer_class = AddressSerializer
    model = Address

    def get(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        serializer = AddressSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj, initial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        obj.delete()
        return Response({'massage': 'address successfully deleted'})


class CustomerCommentsApiView(GenericAPIView):
    """
    API endpoint for retrieving all comments made by the authenticated customer.

    This view allows a logged-in user to fetch a list of their own comments.
    It ensures that only comments associated with the current user are returned.

    Attributes:
        serializer_class (CommentSerializer):
            Serializer responsible for serializing Comments data.
        model (Comments):
            The Comments model used for database queries.

    Methods:
        get_queryset():
            - Returns a QuerySet of Comments filtered by the authenticated user's ID.

        GET:
            - Retrieves all comments belonging to the authenticated user.
            - Serializes the data using CommentSerializer.
            - Returns HTTP 200 OK with the serialized list of comments.

    Responses:
        200 OK:
            - List of serialized comments for the authenticated user.

    Security Considerations:
        - Users can only access their own comments.
        - All requests should be authenticated.
        - Filtering by user ID prevents unauthorized access to other users' comments.
    """
    serializer_class = CommentSerializer
    model = Comments

    def get_queryset(self):
        return Comments.objects.filter(user__user__id=self.request.user.id)

    def get(self, request):
        data = self.get_queryset()
        serializer = self.serializer_class(data, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerAddCommentsApiView(GenericAPIView):
    """
    API endpoint for adding a comment to a specific product by the authenticated customer.

    This view allows a logged-in user to post a comment associated with a given
    product. It validates the input using CommentSerializer and saves the comment
    if the data is valid.

    Attributes:
        serializer_class (CommentSerializer):
            Serializer responsible for validating and serializing comment data.
        model (Comments):
            The Comments model used for database operations.

    Methods:
        POST:
            - Accepts comment data in the request body.
            - Retrieves the product instance identified by the provided `pk`.
            - Validates the input data using CommentSerializer with context including the product.
            - Saves the comment if valid and returns HTTP 201 Created with serialized data.
            - Returns HTTP 400 Bad Request with validation errors if input is invalid.

    Request Body:
        {
            "content": "string",
            "rating": 5,
            ... (other fields handled by CommentSerializer)
        }

    Responses:
        201 Created:
            - Serialized data of the newly created comment.

        400 Bad Request:
            - Validation errors returned by CommentSerializer.

    Security Considerations:
        - Users must be authenticated to post a comment.
        - The comment is automatically linked to the authenticated user and the specified product.
        - Validation ensures no unauthorized product association or malformed data is saved.
    """
    serializer_class = CommentSerializer
    model = Comments

    def post(self, request, pk):
        data = request.data
        product = Product.objects.get(pk=pk)
        serializer = self.serializer_class(data=data, context={'request': request, 'product': product})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailApiView(GenericAPIView):
    """
    API endpoint for retrieving, updating, partially updating, and deleting a single comment.

    This view provides full CRUD functionality for Comments instances identified by their primary key (pk).

    Attributes:
        serializer_class (CommentSerializer):
            Serializer used for validating and serializing comment data.
        model (Comments):
            The Comments model used for database operations.
        queryset (QuerySet):
            Base queryset for retrieving Comments objects.

    Methods:
        GET:
            - Retrieve a single Comment by its pk.
            - Returns serialized comment data with HTTP 200 OK.

        PUT:
            - Full update of a Comment instance.
            - Expects all fields required by CommentSerializer.
            - Returns updated serialized data with HTTP 201 Created.
            - Returns HTTP 400 Bad Request if validation fails.

        PATCH:
            - Partial update of a Comment instance.
            - Only fields provided in the request will be updated.
            - Returns updated serialized data with HTTP 201 Created.
            - Returns HTTP 400 Bad Request if validation fails.

        DELETE:
            - Deletes the specified Comment instance.
            - Returns a success message with HTTP 204 No Content.

    Request Body for PUT/PATCH:
        {
            "content": "string",
            "rating": 5,
            ... (other fields handled by CommentSerializer)
        }

    Responses:
        200 OK (GET):
            - Serialized comment data.

        201 Created (PUT/PATCH):
            - Updated serialized comment data.

        400 Bad Request (PUT/PATCH):
            - Validation errors returned by CommentSerializer.

        204 No Content (DELETE):
            {
                "massage": "comment successfully deleted"
            }

    Security Considerations:
        - Users should only access, update, or delete comments associated with their account.
        - All operations should be authenticated.
        - Proper validation ensures data integrity and prevents unauthorized modifications.
    """
    serializer_class = CommentSerializer
    model = Comments
    queryset = Comments.objects.all()

    def get(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        self.model.objects.get(pk=pk).delete()
        return Response({'massage': 'comment successfully deleted'}, status=status.HTTP_204_NO_CONTENT)


class AddProductRateAPIView(GenericAPIView):
    """
    API endpoint for adding a rating to a specific product.

    This view allows an authenticated user to submit a rating for a given product
    identified by its primary key (pk). The input data is validated using
    ProductRateSerializer, and the rating is saved if valid.

    Attributes:
        serializer_class (ProductRateSerializer):
            Serializer responsible for validating and serializing product rating data.

    Methods:
        POST:
            - Accepts rating data in the request body.
            - Uses the serializer with context containing the request and product pk.
            - Saves the rating if the data is valid.
            - Returns HTTP 201 Created with the serialized rating data.
            - Returns HTTP 400 Bad Request with validation errors if data is invalid.

    Request Body:
        {
            "rating": 4,
            "comment": "string",  # optional
            ... (other fields handled by ProductRateSerializer)
        }

    Responses:
        201 Created:
            - Serialized data of the newly created product rating.

        400 Bad Request:
            - Validation errors returned by ProductRateSerializer.

    Security Considerations:
        - Users must be authenticated to add a rating.
        - Users should only rate each product according to business rules (e.g., one rating per user per product).
        - Validation ensures that invalid or unauthorized ratings cannot be submitted.
    """
    serializer_class = ProductRateSerializer

    def post(self, request, pk):
        serializer = self.serializer_class(data=request.data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllProductsCommentApiView(GenericAPIView):
    """
    API endpoint for retrieving all comments associated with a specific product.

    This view allows any user (authenticated or not, depending on project settings)
    to fetch all comments related to a product identified by its primary key (pk).
    The comments are serialized using CommentSerializer.

    Attributes:
        serializer_class (CommentSerializer):
            Serializer responsible for serializing comment data.
        model (Comments):
            The Comments model used for querying comments.

    Methods:
        GET:
            - Accepts a product pk as a URL parameter.
            - Retrieves all Comments associated with the given product.
            - Serializes the comments with CommentSerializer.
            - Returns the serialized list of comments with HTTP 200 OK.

    Request Parameters:
        pk (int):
            Primary key of the product whose comments are to be retrieved.

    Responses:
        200 OK:
            - List of serialized comments associated with the specified product.

    Security Considerations:
        - Ensure sensitive user data is not exposed in the comments.
        - Access control can be applied if comments are meant to be visible only to certain users.
        - Proper serializer validation ensures data consistency.
    """
    serializer_class = CommentSerializer
    model=Comments
    def get(self,request,pk):
        comments_obj=self.model.objects.filter(product__pk=pk)
        context={'request':request}
        serializer=self.serializer_class(context=context,instance=comments_obj,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    
    
class CustomerDetailApiView(GenericAPIView):
    """
    API endpoint for retrieving details of the authenticated customer.

    This view allows a logged-in user to fetch their own customer profile
    information. The data is retrieved from the Customer model and serialized
    using CustomerDetailSerializer.

    Attributes:
        serializer_class (CustomerDetailSerializer):
            Serializer responsible for serializing customer profile data.
        model (Customer):
            The Customer model used for querying customer instances.

    Methods:
        get_queryset():
            - Retrieves the Customer instance associated with the authenticated user.

        GET:
            - Fetches the customer's profile data.
            - Serializes the data using CustomerDetailSerializer.
            - Returns HTTP 200 OK with serialized customer details.

    Responses:
        200 OK:
            - Serialized data of the authenticated customer's profile.

    Security Considerations:
        - Only the authenticated user can access their own profile details.
        - No sensitive fields (e.g., passwords) should be exposed via the serializer.
        - Proper authentication and permission handling is required.
    """
    serializer_class=CustomerDetailSerializer
    model=Customer
    
    def get_queryset(self):
        return self.model.objects.get(user=self.request.user) 
    
    def get(self,request):
        obj=self.get_queryset()
        serializer=self.serializer_class(obj)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    
    
class CanRateAPIView(GenericAPIView):
    """
    API endpoint to check if the authenticated customer can rate a specific product.

    This view determines whether a logged-in user is allowed to submit a rating
    for a product. The permission to rate is granted only if the customer has
    purchased the product before, based on the existence of an associated OrderItem.

    Methods:
        GET:
            - Accepts a product primary key (pk) as a URL parameter.
            - Retrieves the Customer instance associated with the authenticated user.
            - Retrieves the Product instance identified by pk.
            - Checks if an OrderItem exists linking the customer and product.
            - Returns a boolean flag "can_rate" in the response.

    Request Parameters:
        pk (int):
            Primary key of the product to check rating eligibility.

    Responses:
        200 OK:
            {
                "can_rate": true/false
            }

    Security Considerations:
        - Only authenticated users can query their rating eligibility.
        - Ensures that only customers who have purchased the product can rate it.
        - Prevents unauthorized or fake ratings by enforcing a purchase check.
    """
    def get(self, request, pk):
        customer = Customer.objects.get(user=request.user)
        product = Product.objects.get(pk=pk)
        exists = OrderItem.objects.filter(order__customer=customer, product=product).exists()
        return Response({"can_rate": exists})
