from rest_framework import serializers
from order.models import *
from customer.models import *
from website.models import *
from vendor.api.v1.serializers import ProductSerializer


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('customer',)

    def create(self, validated_data):
        validated_data['customer'] = Customer.objects.get(customer__user=self.context['request'].user)
        return Order.objects.create(**validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['order', 'product']

    def create(self, validated_data):
        request = self.context.get('request')
        order = Order.objects.filter(customer__user_id=request.user.id).exists()
        product = Product.objects.get(pk=self.context.get('pk'))
        if order:
            validated_data['order'] = Order.objects.get(customer__user_id=request.user.id)
        else:
            customer = Customer.objects.get(user=request.user)
            validated_data['order'] = Order.objects.create(customer=customer)
        validated_data['product'] = product
        return OrderItem.objects.create(**validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product).data
        return rep

