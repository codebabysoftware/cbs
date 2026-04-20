from django.contrib import admin
from .models import Course, Module, Lesson, LessonProgress, CourseAccess, LessonAccess


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
    search_fields = ("title",)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "course", "order")
    list_filter = ("course",)
    ordering = ("order",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "module", "type", "is_locked", "order")
    list_filter = ("type", "is_locked")
    search_fields = ("title",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("module", "title", "type", "order", "is_locked")
        }),

        ("🎬 Video (YouTube)", {
            "fields": ("youtube_url",),
            "description": "Paste YouTube link"
        }),

        ("📄 PDF (Google Drive)", {
            "fields": ("pdf_url",),
        }),

        ("📝 Notes (Google Drive)", {
            "fields": ("notes_url",),
        }),
    )


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("student", "lesson", "watched_seconds", "completed")
    list_filter = ("completed",)


@admin.register(CourseAccess)
class CourseAccessAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "is_active", "assigned_at")
    list_filter = ("is_active",)


@admin.register(LessonAccess)
class LessonAccessAdmin(admin.ModelAdmin):
    list_display = ("student", "lesson", "is_locked")
    list_filter = ("is_locked",)