from api.models import  User, Expense, Income, Saving, Wishlist, Bill

from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['bio'] = user.profile.bio
        token['image'] = str(user.profile.image)
        token['verified'] = user.profile.verified
        
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required= True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required= True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                'password': 'Password fields did not match.'
                })
        return attrs
            
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email= validated_data['email'],)
        user.set_password(validated_data['password'])
        user.save()
            
        return user
    
class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'amount', 'category', 'description', 'date_received', 'user']
        read_only_fields = ['id', 'user']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value
    
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'amount', 'category', 'description', 'date_spended', 'user']
        read_only_fields = ['id', 'user']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value
        
class SavingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saving
        fields = ['id', 'amount', 'category', 'date_saved', 'user']
        read_only_fields = ['id', 'user']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value
    
class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = ['id', 'amount', 'due_date', 'item', 'user', 'category']
        read_only_fields = ['id', 'user']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than zero')
        return value
    
class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'price', 'category', 'item', 'is_bought', 'image', 'user']
        read_only_fields = ['id', 'user']
        
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Price must be greater than zero')
        return value