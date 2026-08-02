from rest_framework.serializers import ModelSerializer
from website.models import ProductImages


class ProductImageSerializer(ModelSerializer):
    class Meta :
        model = ProductImages
        fields = '__all__'
        read_only_fields = ['product']
        
        
        