from rest_framework import serializers, validators
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from account.api.v1.serializers import UserSerializer
import order.models
from account.api.v1 import serializers as account_serializers
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *
from order.models import *


class CustomerRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new Customer with an associated User account.

    This serializer handles the creation of a Customer instance and its nested
    User instance in a single operation. It validates the User data using
    UserSerializer and ensures proper creation of both models.

    Attributes:
        user (UserSerializer):
            Nested serializer for handling the related User object.
            It is write-only and required for registration.

    Meta:
        model (Customer):
            The Customer model that is being serialized.
        fields (list):
            - 'username': Customer's display name.
            - 'user': Nested User data (write-only).

    Methods:
        create(validated_data):
            - Extracts 'user' data from the input.
            - Validates and saves the User instance using UserSerializer.
            - Creates the Customer instance associated with the saved User.
            - Returns the newly created Customer instance.

    Security Considerations:
        - Ensures that User data is validated before saving.
        - Passwords and sensitive fields must be handled securely in UserSerializer.
        - Prevents partial or invalid creation of Customer without a valid User.
    """
    user = UserSerializer(write_only=True)

    class Meta:
        model = Customer
        fields = ['username', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        customer = Customer.objects.create(user=user, **validated_data)
        return customer


class CustomerSerializer(serializers.ModelSerializer):
    """
    Serializer for representing Customer instances.

    This serializer is used to expose Customer data, typically in read-only
    contexts, such as returning customer information via API responses.

    Attributes:
        Meta:
            model (Customer):
                The Customer model being serialized.
            fields (list):
                - 'username': The display name of the customer.

    Security Considerations:
        - This serializer exposes only non-sensitive fields.
        - It is safe to use in API responses without leaking private data.
    """
    class Meta:
        model = Customer
        fields = ['username']


class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for Address instances, supporting creation and read operations.

    This serializer handles both serialization and deserialization of Address objects.
    It automatically associates the authenticated Customer with newly created addresses
    and provides a nested representation of the Customer in API responses.

    Attributes:
        Meta:
            model (Address):
                The Address model being serialized.
            fields (list):
                - 'id': Unique identifier of the address (read-only).
                - 'state': State or province of the address.
                - 'city': City of the address.
                - 'postal_code': Postal code of the address.
                - 'customer': Related Customer object (read-only, automatically assigned).
            read_only_fields (list):
                - 'customer', 'id'

    Methods:
        create(validated_data):
            - Automatically assigns the authenticated Customer to the new Address
              using the request context.
            - Calls the parent create method to persist the instance.

        to_representation(instance):
            - Overrides default representation to include nested Customer data
              serialized using CustomerSerializer.
            - Returns a dictionary with the serialized Address and Customer data.

    Security Considerations:
        - Users can only create addresses for their own Customer profile.
        - Read-only fields prevent manipulation of customer association or ID.
        - Nested representation avoids exposing sensitive user data.
    """
    class Meta:
        model = Address
        fields = ['id','state', 'state', 'city', 'postal_code', 'customer']
        read_only_fields = ['customer','id']

    def create(self, validated_data):
        validated_data['customer'] = Customer.objects.get(user_id=self.context.get('request').user.id)
        return super().create(validated_data)

    def to_representation(self, instance):
        res = super().to_representation(instance)

        res['customer'] = CustomerSerializer(instance.customer).data
        return res


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comments model used to create and present product comments.

    Responsibilities
    ----------------
    - Validate comment input for create/update operations.
    - Automatically associate the comment with the authenticated Customer and the target Product.
    - Represent the user as a nested object in serialized output.

    Meta
    ----
    - model: Comments
    - fields: '__all__'  # all fields of the Comments model
    - read_only_fields: ['user', 'product', 'status']  # fields not settable by client

    Behavior
    --------
    create(validated_data)
        - Resolves `user` from the authenticated request (self.context['request'].user).
        - Resolves `product` from the context passed to the serializer (self.context['product']).
        - Saves the new Comment instance.

    to_representation(instance)
        - Returns the default serialized representation.
        - Replaces the `user` field with a nested representation using `UsersSerializer`
          applied to the related User object (instance.user.user).

    Usage
    -----
        # Creating a comment inside a view
        serializer = CommentSerializer(data=request.data, context={'request': request, 'product': product_instance})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()  # user and product automatically assigned

        # Reading a comment
        serializer = CommentSerializer(comment_instance)
        data = serializer.data

    Security & Notes
    ----------------
    - Requires `request` and `product` to be present in serializer context for creation.
    - The serializer enforces read-only for sensitive fields like user, product, and status.
    - Nested user representation ensures clients only see relevant user info.
    - Prevents unauthorized users from assigning comments to other users or products.
    """
    class Meta:
        model = Comments
        fields = '__all__'
        read_only_fields = ['user','product','status']

    def create(self, validated_data):
        validated_data['user'] = Customer.objects.get(user_id=self.context.get('request').user.id)
        validated_data['product'] = self.context.get('product')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        rep=super().to_representation(instance)
        rep['user']=UsersSerializer(instance.user.user).data
        return rep
    
class ProductRateSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductRate model used to validate and create product ratings.

    Responsibilities
    ----------------
    - Validate that only customers who purchased a product can rate it.
    - Automatically associate the ProductRate with the correct Product instance.
    - Handle creation of a ProductRate instance after validation.

    Meta
    ----
    - model: ProductRate
    - fields: '__all__'  # all fields of the ProductRate model
    - read_only_fields: ['product']  # product is automatically set, not provided by client

    Validation
    ----------
    validate(attrs):
        - Retrieves the authenticated customer from request context.
        - Retrieves the target product from serializer context ('pk').
        - Checks if the customer has purchased the product (via OrderItem).
        - Raises ValidationError if the customer did not purchase the product.

    Creation
    --------
    create(validated_data):
        - Automatically sets the 'product' field based on context['pk'].
        - Creates and returns a new ProductRate instance.

    Usage
    -----
        # Adding a product rating in a view
        serializer = ProductRateSerializer(data=request.data, context={'request': request, 'pk': product_pk})
        serializer.is_valid(raise_exception=True)
        product_rate = serializer.save()  # product automatically assigned

    Security & Notes
    ----------------
    - Requires 'request' and 'pk' to be present in serializer context.
    - Prevents users from rating products they have not purchased.
    - read_only_fields ensure clients cannot tamper with the product association.
    """
    class Meta:
        model = ProductRate
        fields = '__all__'
        read_only_fields = ['product']

    def validate(self, attrs):
        request = self.context.get('request')
        customer = Customer.objects.get(user=request.user)
        product = Product.objects.get(pk=self.context.get('pk'))


        if not OrderItem.objects.filter(order__customer=customer, product=product).exists():
            raise serializers.ValidationError("You can rate only purchased products!")

        return attrs

    def create(self, validated_data):
        validated_data['product'] = Product.objects.get(pk=self.context.get('pk'))
        return ProductRate.objects.create(**validated_data)



class CustomerDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for displaying detailed information about a Customer.

    Responsibilities
    ----------------
    - Serialize all fields of the Customer model.
    - Make the 'user' field read-only to prevent changes to the associated User account.

    Meta
    ----
    - model: Customer
    - fields: '__all__'  # all fields of the Customer model
    - read_only_fields: ['user']  # prevents modifying the associated User

    Usage
    -----
        # Retrieving customer details in a view
        serializer = CustomerDetailSerializer(customer_instance)
        data = serializer.data

    Security & Notes
    ----------------
    - The 'user' field is read-only to prevent clients from reassigning Customer ownership.
    - Suitable for read-only API endpoints (e.g., profile detail).
    - Sensitive information (like passwords) should be excluded at the model or serializer level.
    """
    class Meta:
        model=Customer
        fields='__all__'
        read_only_fields=['user']
        
        
        