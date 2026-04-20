from django.urls import path
from .views import CreateStudentView, DeleteStudentView, MeView, RegisterView, StudentListView

urlpatterns = [
    path('create-student/', CreateStudentView.as_view()),
    path("register/", RegisterView.as_view()),
    path('students/', StudentListView.as_view()),
    path("me/", MeView.as_view()),
    path(
    "students/<int:id>/delete/",
    DeleteStudentView.as_view()
),
    
]