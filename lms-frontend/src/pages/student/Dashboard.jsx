import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  PlayCircle,
  Clock3,
  TrendingUp,
  GraduationCap,
  RefreshCcw,
  Award,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================
  // FETCH ALL
  // =========================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [courseRes, resumeRes] =
        await Promise.all([
          API.get(
            "/courses/enrolled/"
          ),
          API.get(
            "/courses/resume/"
          ),
        ]);

      setCourses(
        courseRes.data || []
      );

      setResume(
        resumeRes.data || null
      );
    } catch (error) {
      console.error(
        "Student dashboard load failed",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const refreshDashboard =
    async () => {
      setRefreshing(true);
      await fetchDashboard();
    };

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    const total =
      courses.length;

    const completed =
      courses.filter(
        (course) =>
          Number(
            course.progress || 0
          ) >= 100
      ).length;

    const active =
      courses.filter(
        (course) =>
          Number(
            course.progress || 0
          ) > 0 &&
          Number(
            course.progress || 0
          ) < 100
      ).length;

    const avg =
      total > 0
        ? Math.round(
            courses.reduce(
              (
                sum,
                item
              ) =>
                sum +
                Number(
                  item.progress ||
                    0
                ),
              0
            ) / total
          )
        : 0;

    return {
      total,
      completed,
      active,
      avg,
    };
  }, [courses]);

  // =========================
  // NAVIGATION
  // =========================
  const openCourse =
    (courseId) => {
      navigate(
        `/student/course/${courseId}`
      );
    };

  const resumeLearning =
    () => {
      if (!resume)
        return;

      navigate(
        `/student/course/${resume.course_id}?lesson=${resume.lesson_id}`
      );
    };

  // =========================
  // PROGRESS COLOR
  // =========================
  const getProgressColor =
    (value) => {
      const n =
        Number(value);

      if (n >= 100)
        return "bg-green-500";

      if (n >= 60)
        return "bg-blue-500";

      if (n >= 30)
        return "bg-yellow-500";

      return "bg-slate-400";
    };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Student Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Loading your learning space...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <h1 className="text-3xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="text-blue-100 mt-2">
              Continue learning,
              improve skills and
              stay consistent.
            </p>
          </div>

          <button
            onClick={
              refreshDashboard
            }
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl hover:bg-blue-50"
          >
            <RefreshCcw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>
      </div>

      {/* RESUME LEARNING */}
      {resume &&
        resume.course_id && (
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <p className="text-sm text-slate-500">
                  Continue Learning
                </p>

                <h2 className="text-xl font-bold text-slate-800 mt-1">
                  {
                    resume.course_title
                  }
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Last lesson:{" "}
                  {
                    resume.lesson_title
                  }
                </p>

                <p className="text-sm text-blue-600 mt-1">
                  Watched{" "}
                  {
                    resume.watched_seconds
                  }
                  s
                </p>
              </div>

              <button
                onClick={
                  resumeLearning
                }
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
              >
                <PlayCircle
                  size={18}
                />
                Resume
              </button>
            </div>
          </div>
        )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Enrolled Courses
              </p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {
                  stats.total
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <BookOpen
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                In Progress
              </p>

              <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                {
                  stats.active
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Clock3
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {
                  stats.completed
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Award
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Avg Progress
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {
                  stats.avg
                }
                %
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BarChart3
                size={22}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COURSES */}
      <div className="bg-white rounded-2xl shadow">

        <div className="p-5 border-b">
          <div className="flex items-center gap-2">
            <GraduationCap
              size={18}
              className="text-blue-600"
            />

            <h2 className="font-semibold text-slate-800">
              My Courses
            </h2>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Access your enrolled
            premium programs.
          </p>
        </div>

        <div className="p-5">

          {courses.length ===
          0 ? (
            <p className="text-slate-400">
              No enrolled courses
              available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {courses.map(
                (
                  course
                ) => (
                  <div
                    key={
                      course.id
                    }
                    className="border rounded-2xl overflow-hidden hover:shadow-lg transition bg-white"
                  >
                    {/* IMAGE */}
                    <div className="h-44 bg-slate-100">
                      {course.thumbnail ? (
                        <img
                          src={
                            course.thumbnail
                          }
                          alt={
                            course.title
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <BookOpen />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">

                      <h3 className="font-semibold text-slate-800">
                        {
                          course.title
                        }
                      </h3>

                      <p className="text-sm text-slate-500 mt-2 min-h-[48px] line-clamp-2">
                        {course.description ||
                          "No description available."}
                      </p>

                      {/* PROGRESS */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-500">
                            Progress
                          </span>

                          <span className="font-medium text-slate-700">
                            {Number(
                              course.progress ||
                                0
                            )}
                            %
                          </span>
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(
                              course.progress
                            )}`}
                            style={{
                              width: `${Number(
                                course.progress ||
                                  0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* ACTION */}
                      <button
                        onClick={() =>
                          openCourse(
                            course.id
                          )
                        }
                        className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
                      >
                        Open Course
                        <ArrowRight
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      </div>

      {/* FOOTER INSIGHT */}
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-blue-600" />

          <div>
            <h3 className="font-semibold text-slate-800">
              Keep Going
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Consistent daily
              progress creates
              long-term mastery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;