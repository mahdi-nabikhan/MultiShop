from rest_framework import serializers
from order.models import *
from customer.models import *
from website.models import *
from vendor.api.v1.serializers import ProductSerializer


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Order model, used for creating and representing customer orders.

    Responsibilities
    ----------------
    - Serialize Order instances to JSON for API responses.
    - Validate and create new Order instances for the authenticated customer.
    - Ensures that the `customer` field is automatically set to the requesting user.

    Attributes
    ----------
    Meta.model : Order
        - The model associated with this serializer.
    Meta.fields : '__all__'
        - All fields of the Order model are included.
    Meta.read_only_fields : ('customer',)
        - The `customer` field is read-only and set automatically from the request.

    Methods
    -------
    create(self, validated_data)
        - Automatically sets `customer` to the currently authenticated user.
        - Creates and returns a new Order instance.

    Usage
    -----
        # Create a new order for the authenticated user
        POST /api/v1/orders/
        {
            "field1": "value1",
            "field2": "value2"
        }
        -> returns the created order with all fields, including customer

    Notes
    -----
    - The serializer assumes that `request` is passed in the context.
    - Only authenticated users can create orders; otherwise, an error will occur.
    - Typically used in conjunction with `OrderListApiView` or other Order-related API views.
    """
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('customer',)

    def create(self, validated_data):
        validated_data['customer'] = Customer.objects.get(user=self.context['request'].user)
        return Order.objects.create(**validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for OrderItem model, handling creation and representation of order items.

    Responsibilities
    ----------------
    - Serialize OrderItem instances to JSON for API responses.
    - Validate and create new OrderItem instances linked to the authenticated customer's active order.
    - Automatically associates the item with the correct Order and Product.

    Attributes
    ----------
    Meta.model : OrderItem
        - The model associated with this serializer.
    Meta.fields : '__all__'
        - Includes all fields of the OrderItem model.
    Meta.read_only_fields : ['order', 'product']
        - 'order' and 'product' are set automatically and cannot be provided directly.

    Methods
    -------
    create(self, validated_data)
        - Retrieves the authenticated customer from request context.
        - Gets or creates the active Order (status=False) for the customer.
        - Associates the OrderItem with the provided product (`pk` from context).
        - Returns the created OrderItem instance.

    to_representation(self, instance)
        - Customizes serialized output to include detailed Product information using ProductSerializer.

    Usage
    -----
        # Create a new OrderItem for product ID 10
        POST /api/v1/order-item/create/10/
        {
            "quantity": 2
        }
        -> returns serialized OrderItem with nested product details

    Notes
    -----
    - Requires `request` and `pk` (product ID) to be passed in serializer context.
    - The `order` field is automatically linked to the customer's active order.
    - Ideal for building shopping cart and checkout functionality.
    - Supports nested serialization for better frontend consumption.
    """
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['order', 'product']

    def create(self, validated_data):
        request = self.context.get('request')
        customer = Customer.objects.get(user=request.user)
        order,created = Order.objects.get_or_create(customer=customer, status=False)
        product = Product.objects.get(pk=self.context.get('pk'))

        validated_data['order'] = order
        validated_data['product'] = product
        return OrderItem.objects.create(**validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product).data
        return rep


class BillSerilizers(serializers.ModelSerializer):
    """
    Serializer for the Bill model, handling creation and representation of bills/invoices.

    Responsibilities
    ----------------
    - Serialize Bill instances for API responses.
    - Include nested details of the associated Order (cart) in the representation.
    - Validate and create new Bill instances, linking them to a specific Order.

    Attributes
    ----------
    Meta.model : Bill
        - The model associated with this serializer.
    Meta.fields : '__all__'
        - Includes all fields of the Bill model.
    Meta.read_only_fields : ['cart']
        - The 'cart' (Order) field is read-only and set automatically.

    Methods
    -------
    create(self, validated_data)
        - Retrieves the Order instance from context using 'pk'.
        - Associates the Bill with this Order.
        - Creates and returns the new Bill instance.

    to_representation(self, instance)
        - Overrides default representation to include nested Order data using OrderSerializer.
        - Ensures that the 'cart' field returns detailed order information instead of just the ID.

    Usage
    -----
        # Create a new Bill for Order ID 5
        POST /api/v1/bills/create/5/
        {
            "total_amount": 100,
            "payment_status": "P"
        }
        -> returns the created Bill with nested order details

    Notes
    -----
    - Requires 'pk' in serializer context to identify the Order for which the bill is created.
    - Useful for checkout or invoicing functionality in e-commerce systems.
    - The nested representation allows frontend apps to display full order details within the bill response.
    """
    class Meta:
        model=Bill
        fields='__all__'
        read_only_fields=['cart']
        
        
        
    def to_representation(self, instance):
        response=super().to_representation(instance)
        response['cart']=OrderSerializer(instance.cart).data
        return response
    
    
    def create(self, validated_data):
        order=Order.objects.get(pk=self.context.get('pk'))
        validated_data['cart']=order
        return Bill.objects.create(**validated_data)
    
    


class CartItemSerializer(serializers.Serializer):
    product = ProductSerializer()
    quantity = serializers.IntegerField()
    total_price = serializers.DecimalField(...)