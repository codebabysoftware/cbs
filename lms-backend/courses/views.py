from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from .models import (
    Course, Module, Lesson,
    CourseAccess, LessonAccess, LessonProgress
)

from .serializers import (
    CourseSerializer, ModuleSerializer, LessonSerializer
)

from accounts.models import User
from django.db.models import Count
from django.db.models.functions import TruncDate


# =========================
# 📚 COURSE
# =========================
class CreateCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class AdminCourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.all().order_by("-created_at")
        serializer = CourseSerializer(courses, many=True, context={"request": request})
        return Response(serializer.data)
class AdminLessonAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, student_id):
        if request.user.role != "admin":
            return Response(
                {"error": "Unauthorized"},
                status=403
            )

        try:
            student = User.objects.get(
                id=student_id,
                role="student"
            )

            modules = Module.objects.filter(
                course_id=course_id
            ).order_by("order", "id")

            result = []

            for module in modules:
                lessons = Lesson.objects.filter(
                    module=module
                ).order_by("order", "id")

                lesson_list = []

                for lesson in lessons:
                    access, _ = LessonAccess.objects.get_or_create(
                        student=student,
                        lesson=lesson,
                        defaults={
                            "is_locked": False
                        }
                    )

                    lesson_list.append({
                        "id": lesson.id,
                        "title": lesson.title,
                        "is_locked": access.is_locked
                    })

                result.append({
                    "module_id": module.id,
                    "module": module.title,
                    "lessons": lesson_list
                })

            return Response(result)

        except User.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=404
            )


class StudentCourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accesses = CourseAccess.objects.filter(
            student=request.user,
            is_active=True
        )

        courses = Course.objects.filter(id__in=accesses.values_list("course_id", flat=True))

        serializer = CourseSerializer(courses, many=True, context={"request": request})
        return Response(serializer.data)


# =========================
# 📦 MODULE & LESSON
# ========================= 

class CreateModuleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()

        # defaults
        if "order" not in data or data["order"] == "":
            data["order"] = 0

        serializer = ModuleSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        print("MODULE CREATE ERROR:", serializer.errors)

        return Response(serializer.errors, status=400)

class CreateLessonView(APIView):
    def post(self, request):
        data = request.data.copy()

        if not data.get("module"):
            return Response({"error": "Module is required"}, status=400)

        if not data.get("title"):
            return Response({"error": "Title is required"}, status=400)

        if not data.get("type"):
            return Response({"error": "Type is required"}, status=400)

        # CLEAN BASED ON TYPE
        t = data.get("type")

        if t == "video":
            data["pdf_url"] = None
            data["notes_url"] = None

        elif t == "pdf":
            data["youtube_url"] = None
            data["notes_url"] = None

        elif t == "note":
            data["youtube_url"] = None
            data["pdf_url"] = None

        serializer = LessonSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        print("❌ VALIDATION ERROR:", serializer.errors)

        return Response(serializer.errors, status=400)

class CourseContentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        user = request.user

        # -----------------------------------
        # VALIDATE COURSE
        # -----------------------------------
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=404
            )

        # -----------------------------------
        # STUDENT ACCESS CHECK
        # -----------------------------------
        if user.role == "student":
            allowed = CourseAccess.objects.filter(
                student=user,
                course=course
            ).exists()

            if not allowed:
                return Response(
                    {"error": "No access to this course"},
                    status=403
                )

        # -----------------------------------
        # FETCH MODULES
        # -----------------------------------
        modules = Module.objects.filter(
            course=course
        ).order_by("order", "id")

        final_data = []

        for module in modules:
            lessons = Lesson.objects.filter(
                module=module
            ).order_by("order", "id")

            lesson_list = []

            for lesson in lessons:

                locked = False

                # ----------------------------
                # LESSON LOCK CHECK
                # ----------------------------
                if user.role == "student":
                    access, _ = LessonAccess.objects.get_or_create(
                        student=user,
                        lesson=lesson,
                        defaults={
                            "is_locked": False
                        }
                    )

                    locked = access.is_locked

                # ----------------------------
                # COMMON DATA
                # ----------------------------
                item = {
                    "id": lesson.id,
                    "title": lesson.title,
                    "description": getattr(
                        lesson,
                        "description",
                        ""
                    ),
                    "type": getattr(
                        lesson,
                        "type",
                        "video"
                    ),
                    "duration": getattr(
                        lesson,
                        "duration",
                        0
                    ),
                    "order": lesson.order,
                    "is_locked": locked,

                    "youtube_url": "",
                    "pdf_url": "",
                    "notes_url": "",
                }

                # ----------------------------
                # UNLOCKED OR ADMIN
                # ----------------------------
                if user.role == "admin" or not locked:
                    item["youtube_url"] = getattr(
                        lesson,
                        "youtube_url",
                        ""
                    ) or ""

                    item["pdf_url"] = getattr(
                        lesson,
                        "pdf_url",
                        ""
                    ) or ""

                    item["notes_url"] = getattr(
                        lesson,
                        "notes_url",
                        ""
                    ) or ""

                lesson_list.append(item)

            final_data.append({
                "module_id": module.id,
                "module": module.title,
                "order": module.order,
                "lessons": lesson_list
            })

        return Response(final_data)
# =========================
# 🔐 ACCESS CONTROL
# =========================
class ToggleLessonAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "admin":
            return Response(
                {"error": "Unauthorized"},
                status=403
            )

        student_id = request.data.get("student")
        lesson_id = request.data.get("lesson")
        is_locked = request.data.get(
            "is_locked",
            False
        )

        if not student_id or not lesson_id:
            return Response(
                {
                    "error":
                    "student and lesson required"
                },
                status=400
            )

        try:
            student = User.objects.get(
                id=student_id,
                role="student"
            )

            lesson = Lesson.objects.get(
                id=lesson_id
            )

            access, created = LessonAccess.objects.get_or_create(
                student=student,
                lesson=lesson,
                defaults={
                    "is_locked": is_locked
                }
            )

            if not created:
                access.is_locked = is_locked
                access.save()

            return Response({
                "message":
                "Lesson access updated",
                "is_locked":
                access.is_locked
            })

        except User.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=404
            )

        except Lesson.DoesNotExist:
            return Response(
                {"error": "Lesson not found"},
                status=404
            )
        
class AssignCourseAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student = request.data.get("student")
        course = request.data.get("course")

        obj, _ = CourseAccess.objects.get_or_create(
            student_id=student,
            course_id=course
        )

        obj.is_active = True
        obj.save()

        return Response({"message": "Assigned"})


class RemoveCourseAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        CourseAccess.objects.filter(
            student_id=request.data.get("student"),
            course_id=request.data.get("course")
        ).update(is_active=False)

        return Response({"message": "Removed"})


# =========================
# 📊 PROGRESS
# =========================
class TrackProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student = request.user
        lesson_id = request.data.get("lesson")
        seconds = int(request.data.get("seconds", 0))

        lesson = get_object_or_404(Lesson, id=lesson_id)

        progress, _ = LessonProgress.objects.get_or_create(
            student=student,
            lesson=lesson
        )

        progress.watched_seconds = max(progress.watched_seconds, seconds)

        if lesson.duration:
            if seconds >= lesson.duration * 0.8:
                progress.completed = True
        else:
            if seconds >= 30:
                progress.completed = True

        progress.save()

        return Response({"message": "saved"})


class LessonProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        try:
            p = LessonProgress.objects.get(
                student=request.user,
                lesson_id=lesson_id
            )
            return Response({
                "watched_seconds": p.watched_seconds,
                "completed": p.completed
            })
        except:
            return Response({
                "watched_seconds": 0,
                "completed": False
            })


# =========================
# 📊 ANALYTICS
# =========================
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "courses": Course.objects.count(),
            "students": User.objects.filter(role="student").count(),
            "lessons": Lesson.objects.count(),
        })


class StudentGrowthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            User.objects.filter(role="student")
            .annotate(date=TruncDate("date_joined"))
            .values("date")
            .annotate(count=Count("id"))
        )

        return Response(data)


class PlatformUsageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Lesson.objects
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
        )

        return Response(data)


# =========================
# 🎯 DASHBOARD
# =========================
class EnrolledCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accesses = CourseAccess.objects.filter(
            student=request.user,
            is_active=True
        )

        data = []

        for a in accesses:
            course = a.course

            lessons = Lesson.objects.filter(module__course=course)
            total = lessons.count()

            completed = LessonProgress.objects.filter(
                student=request.user,
                lesson__in=lessons,
                completed=True
            ).count()

            progress = int((completed / total) * 100) if total else 0

            serializer = CourseSerializer(course, context={"request": request})

            course_data = serializer.data
            course_data["progress"] = progress

            data.append(course_data)

        return Response(data)
    

class UpdateLessonView(APIView):
    def put(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)

        data = request.data.copy()
        lesson_type = data.get("type")

        if lesson_type == "video":
            data["pdf_url"] = None
            data["notes_url"] = None

        elif lesson_type == "pdf":
            data["youtube_url"] = None
            data["notes_url"] = None

        elif lesson_type == "note":
            data["youtube_url"] = None
            data["pdf_url"] = None

        serializer = LessonSerializer(lesson, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    
class DeleteLessonView(APIView):
    def delete(self, request, id):
        lesson = get_object_or_404(Lesson, id=id)
        lesson.delete()
        return Response({"message": "Deleted"})
    
class DeleteModuleView(APIView):
    def delete(self, request, id):
        module = get_object_or_404(Module, id=id)
        module.delete()
        return Response({"message": "Module deleted"})
    
class ReorderLessonsView(APIView):
    def post(self, request):
        lessons = request.data.get("lessons", [])

        for item in lessons:
            Lesson.objects.filter(id=item["id"]).update(
                order=item["order"]
            )

        return Response({"message": "Reordered"})
    


class CourseAccessListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        if request.user.role != "admin":
            return Response(
                {"error": "Unauthorized"},
                status=403
            )

        accesses = CourseAccess.objects.filter(
            course_id=course_id
        ).select_related("student")

        data = []

        for item in accesses:
            data.append({
                "id": item.id,
                "student_id": item.student.id,
                "username": item.student.username,
                "name": getattr(item.student, "name", item.student.username),
                "is_active": item.is_active,
                "assigned_at": item.assigned_at,
            })

        return Response(data)
    

class ResumeCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest = (
            LessonProgress.objects
            .filter(
                student=request.user,
                watched_seconds__gt=0
            )
            .select_related(
                "lesson",
                "lesson__module",
                "lesson__module__course"
            )
            .order_by("-updated_at")
            .first()
        )

        if not latest:
            return Response([])

        return Response({
            "course_id": latest.lesson.module.course.id,
            "course_title": latest.lesson.module.course.title,
            "lesson_id": latest.lesson.id,
            "lesson_title": latest.lesson.title,
            "watched_seconds": latest.watched_seconds,
        })
    


class DeleteCourseView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        # admin only
        if request.user.role != "admin":
            return Response(
                {"error": "Unauthorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            course = Course.objects.get(id=id)
            course.delete()

            return Response({
                "message": "Course deleted successfully"
            })

        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        


