from django.urls import path
from .views import *

urlpatterns = [

    # COURSES
    path("create/", CreateCourseView.as_view()),
    path("admin-list/", AdminCourseListView.as_view()),
    path("student-list/", StudentCourseListView.as_view()),

    # MODULE / LESSON
    path("module/create/", CreateModuleView.as_view()),
    path("lesson/create/", CreateLessonView.as_view()),
    path("content/<int:course_id>/", CourseContentView.as_view()),
    path("lesson-access/toggle/", ToggleLessonAccessView.as_view()),
    # ACCESS
    path("lesson/toggle/", ToggleLessonAccessView.as_view()),
    path("course-access/assign/", AssignCourseAccessView.as_view()),
    path("course-access/remove/", RemoveCourseAccessView.as_view()),
    path(
    "course-access/<int:course_id>/",
    CourseAccessListView.as_view()
),

    # PROGRESS
    path("progress/save/", TrackProgressView.as_view()),
    path("progress/<int:lesson_id>/", LessonProgressView.as_view()),

    # ANALYTICS
    path("admin/stats/", AdminDashboardStatsView.as_view()),
    path("analytics/student-growth/", StudentGrowthView.as_view()),
    path("analytics/platform-usage/", PlatformUsageView.as_view()),

    # DASHBOARD
    path("enrolled/", EnrolledCoursesView.as_view()),
    path("lesson/update/<int:pk>/", UpdateLessonView.as_view()),
    path("lesson/<int:id>/delete/", DeleteLessonView.as_view()),
    path("module/<int:id>/delete/", DeleteModuleView.as_view()),
    path("lesson/reorder/", ReorderLessonsView.as_view()),
    path(
    "lesson-access/<int:course_id>/<int:student_id>/",
    AdminLessonAccessView.as_view()
),
    path("resume/", ResumeCourseView.as_view()),
    path("<int:id>/delete/", DeleteCourseView.as_view()),
    
]