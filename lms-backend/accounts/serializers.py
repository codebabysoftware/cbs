from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from courses.models import Module, Lesson

# ✅ User Serializer (Admin creates students)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# ✅ JWT Custom Serializer (VERY IMPORTANT)
class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔐 Add custom claims
        token['role'] = user.role
        token['username'] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Optional: include user info in response
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "role": self.user.role,
        }

        return data
    
class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'