from datetime import timezone

from django.db import models
from django.conf import settings
from django.utils import timezone


User = settings.AUTH_USER_MODEL


# =========================
# 📚 COURSE
# =========================
class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    thumbnail = models.ImageField(
        upload_to="course_thumbnails/",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# =========================
# 📦 MODULE
# =========================
class Module(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="modules"
    )

    title = models.CharField(max_length=255)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    class Meta:
        ordering = ["order"]


# =========================
# 🎓 LESSON
# =========================
class Lesson(models.Model):
    LESSON_TYPES = (
        ("video", "Video"),
        ("pdf", "PDF"),
        ("note", "Note"),
    )

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="lessons"
    )

    title = models.CharField(max_length=255)

    type = models.CharField(
        max_length=10,
        choices=LESSON_TYPES
    )

    order = models.IntegerField(default=0)

    # 🎬 YouTube Video
    youtube_url = models.URLField(
        null=True,
        blank=True,
        help_text="Paste YouTube video URL"
    )

    # 📄 Google Drive PDF
    pdf_url = models.URLField(
        null=True,
        blank=True,
        help_text="Paste Google Drive PDF link"
    )

    # 📝 Google Drive Notes
    notes_url = models.URLField(
        null=True,
        blank=True,
        help_text="Paste Google Drive notes link"
    )

    # 🔒 Access Control
    is_locked = models.BooleanField(default=False)

    # ⏱ Duration (optional for analytics)
    duration = models.FloatField(
        null=True,
        blank=True,
        help_text="Video duration in seconds"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.module.title} - {self.title}"

    class Meta:
        ordering = ["order"]


# =========================
# 📊 LESSON PROGRESS
# =========================
class LessonProgress(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="lesson_progress"
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="progress"
    )

    watched_seconds = models.FloatField(default=0)
    completed = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("student", "lesson")

    def __str__(self):
        return f"{self.student} - {self.lesson}"


# =========================
# 🔐 COURSE ACCESS
# =========================
class CourseAccess(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="course_access"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="access"
    )

    is_active = models.BooleanField(default=True)

    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student} → {self.course}"
    
# =========================
# 🔐 LESSON ACCESS
# =========================
class LessonAccess(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="lesson_access"
    )

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="lesson_access"
    )

    is_locked = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("student", "lesson")

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"
    