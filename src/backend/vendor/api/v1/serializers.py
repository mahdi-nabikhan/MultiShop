from rest_framework import serializers
from vendor.models import *
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from website.models import *
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *
from website.models import *
from order.models import OrderItem,Order
from customer.api.v1.serializers import CustomerDetailSerializer
from rest_framework import serializers
from website.models import ProductImages
from django.db import transaction

class StoreAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopAddress
        fields = ['state', 'street']
        
    def validate_state(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "State cannot be empty."
            )

        return value

    def validate_city(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "City cannot be empty."
            )

        return value

    def validate_street(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Street cannot be empty."
            )

        return value


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['pk','image', 'description', 'name']
        read_only_fields = ['pk']


class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    store = StoreSerializer()
    address = StoreAddressSerializer(write_only=True)

    class Meta:
        model = Manager
        fields = ['user', 'store', 'address', 'first_name', 'last_name']
    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        store_data = validated_data.pop('store')
        address_data = validated_data.pop('address')
        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        

        manager = Manager.objects.create(user=user, **validated_data)
        store = Store.objects.create(manager=manager, **store_data)
        ShopAddress.objects.create(store=store, **address_data)

        return manager


class AdminsSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['id','username', 'user']
    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        manager = Manager.objects.get(user_id=self.context['request'].user.id)
        store = Store.objects.get(manager=manager)
        return Admin.objects.create(shop=store, user=user,username=validated_data['username'])


class OperatorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Operator
        fields = ['id','username', 'user']
    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        manager = Manager.objects.get(user_id=self.context['request'].user.id)
        store = Store.objects.get(manager=manager)
        return Operator.objects.create(shop=store, user=user,username= validated_data['username'])


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['store', 'pk']

    def create(self, validated_data):
        user = self.context.get('request').user
        
        manager = Manager.objects.filter(
            user=user
        ).select_related('user').first()
        admin = Admin.objects.filter(
            user=user
        ).select_related('shop').first()
        if manager:
            store = Store.objects.get(manager__user=user)
            product = Product.objects.create(store=store, **validated_data)
            return product
        elif admin:
            store = Store.objects.get(admin__user=user)
            return Product.objects.create(store=store, **validated_data)
        else:
            raise ValidationError("User is not associated with a manager or admin.")
        
    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product_image:

            return request.build_absolute_uri(
                obj.product_image.url
            )

        return None

class AddImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = "__all__"
        read_only_fields = ['title', 'description']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product,
                                           context=self.context).data
        return rep

    def create(self, validated_data):
        product =  Product.objects.get(
            pk=self.context.get('pk')
        )
        validated_data['product'] = product
        return ProductImages.objects.create(**validated_data)
    
    def validate(self, attrs):
        pk = self.context.get('pk')
        if not Product.objects.filter(pk=pk).exists():
            raise serializers.ValidationError({
                "product": "Product does not exist."
            })

        return attrs


class AddDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['pk','id','products', 'value', 'discount_type']
        read_only_fields = ('pk','id','products',)
    def validate_value(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Discount value must be greater than zero."
            )

        return value

    def validate_discount_type(self, value):
        if value not in ['cash', 'percentage']:
            raise serializers.ValidationError(
                "Invalid discount type."
            )

        return value

    def validate(self, attrs):
        discount_type = attrs['discount_type']
        value = attrs['value']

        if discount_type == 'percentage' and value > 100:
            raise serializers.ValidationError({
                'value': 'Percentage discount cannot exceed 100.'
            })

        product_id = self.context.get('pk')

        if not Product.objects.filter(pk=product_id).exists():
            raise serializers.ValidationError({
                'product': 'Product does not exist.'
            })

        return attrs
    
    def create(self, validated_data):
        
        product = Product.objects.get(pk=self.context['pk'])
        discount_type = 'discount_type'
        value = validated_data['value']
        if discount_type == "cash":
            product.price_after = max(
                product.price - validated_data["value"],0)
        elif discount_type == "percentage":
                product.price_after = max(
                int(product.price * (1 - value / 100)),0)
        product.save(update_fields=['price_after'])
        validated_data["products"] = product
        return Discount.objects.create(**validated_data)

class OrderItemUpdateStatusSerializer(serializers.ModelSerializer):
    class Meta :
        model=OrderItem
        fields=['pk','status','product']
        read_only_fields=['pk','product']
            
    def to_representation(self, instance):
        response=super().to_representation(instance)
        response['product']=ProductSerializer(instance.product).data
        return response
    
        
class ListOrderSerialazers(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['pk','status','customer']
        
        
    def to_representation(self, instance):
        res =  super().to_representation(instance)
        res['customer'] = CustomerDetailSerializer(instance.customer,context =self.context).data
        return res
    



class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImages
        fields = [
            "id",
            "product_image",
            "title",
            "description"
        ]
        
        
class StoreCatgorySerializer(serializers.ModelSerializer):
    class Meta:
        model =  StoreCategory
        fields = '__all__'
        


class GetAdminDataSeralizer(serializers.ModelSerializer):
    class Meta : 
        model = Admin
        fields = ['username']