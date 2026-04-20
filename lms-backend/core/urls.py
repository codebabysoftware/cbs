from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework_simplejwt.views import TokenObtainPairView
from accounts.views import CustomLoginView
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return redirect("/admin/")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/login/', CustomLoginView.as_view()),
    path('api/auth/', include('accounts.urls')),
    path('api/courses/', include('courses.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )