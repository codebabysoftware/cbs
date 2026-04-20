from rest_framework import serializers
from .models import (
    Course,
    Module,
    Lesson,
    LessonProgress,
    CourseAccess,
    LessonAccess,
)


# =========================
# 📚 COURSE SERIALIZER
# =========================
class CourseSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = "__all__"

    def get_thumbnail(self, obj):
        if not obj.thumbnail:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.thumbnail.url
            )

        return obj.thumbnail.url


# =========================
# 🎓 LESSON SERIALIZER
# =========================
class LessonSerializer(serializers.ModelSerializer):
    pdf_preview = serializers.SerializerMethodField()
    notes_preview = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "module",
            "title",
            "type",
            "youtube_url",
            "pdf_url",
            "notes_url",
            "pdf_preview",
            "notes_preview",
            "is_locked",
            "order",
        ]

    # ✅ Convert Google Drive → preview
    def get_pdf_preview(self, obj):
        if obj.pdf_url:
            return obj.pdf_url.replace("view", "preview")
        return None

    def get_notes_preview(self, obj):
        if obj.notes_url:
            return obj.notes_url.replace("view", "preview")
        return None


# =========================
# 📦 MODULE SERIALIZER
# =========================

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ["id", "course", "title", "order"]

# =========================
# 📊 LESSON PROGRESS
# =========================
class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = [
            "lesson",
            "watched_seconds",
            "completed",
        ]


# =========================
# 🔐 COURSE ACCESS
# =========================
class CourseAccessSerializer(serializers.ModelSerializer):
    course = CourseSerializer()

    class Meta:
        model = CourseAccess
        fields = ["course", "is_active"]


# =========================
# 🔐 LESSON ACCESS
# =========================
class LessonAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonAccess
        fields = ["lesson", "is_locked"]