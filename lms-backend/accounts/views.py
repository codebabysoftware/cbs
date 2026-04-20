from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenSerializer
from django.contrib.auth.hashers import make_password


class CreateStudentView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        data = request.data
        data['role'] = 'student'

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class StudentListView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        students = User.objects.filter(role='student')
        data = [{"id": s.id, "username": s.username} for s in students]
        return Response(data)

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer



class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "name": getattr(user, "name", user.username),
            "username": user.username,
            "email": user.email,
            "role": user.role,
        })
    


class DeleteStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        if request.user.role != "admin":
            return Response(
                {"error": "Unauthorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            student = User.objects.get(
                id=id,
                role="student"
            )

            student.delete()

            return Response({
                "message": "Student deleted successfully"
            })

        except User.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        

class RegisterView(APIView):
    def post(self, request):
        data = request.data

        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        email = data.get("email", "").strip()
        role = data.get("role", "student")

        # optional frontend field
        full_name = data.get("name", "").strip()

        if not username:
            return Response(
                {"error": "Username required"},
                status=400
            )

        if not password:
            return Response(
                {"error": "Password required"},
                status=400
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=400
            )

        user = User.objects.create(
            username=username,
            email=email,
            role=role,
            password=make_password(password),
        )

        # if your model supports first_name
        if hasattr(user, "first_name"):
            user.first_name = full_name
            user.save()

        return Response(
            {
                "message": "Student created successfully",
                "id": user.id
            },
            status=201
        )