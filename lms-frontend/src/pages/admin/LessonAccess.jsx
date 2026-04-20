import { useEffect, useState } from "react";
import API from "../../api/api";

const LessonAccess = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (
      selectedCourse &&
      selectedStudent
    ) {
      fetchAccess();
    }
  }, [
    selectedCourse,
    selectedStudent
  ]);

  const loadInitial = async () => {
    try {
      const [c, s] =
        await Promise.all([
          API.get(
            "/courses/admin-list/"
          ),
          API.get(
            "/auth/students/"
          ),
        ]);

      setCourses(c.data || []);
      setStudents(s.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccess = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/courses/lesson-access/${selectedCourse}/${selectedStudent}/`
      );

      setModules(
        res.data || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson =
    async (lesson) => {
      try {
        await API.post(
          "/courses/lesson-access/toggle/",
          {
            student:
              Number(
                selectedStudent
              ),
            lesson:
              lesson.id,
            is_locked:
              !lesson.is_locked,
          }
        );

        fetchAccess();
      } catch (err) {
        console.error(err);
      }
    };

  const bulkUpdate =
    async (lockValue) => {
      try {
        for (const module of modules) {
          for (const lesson of module.lessons) {
            await API.post(
              "/courses/lesson-access/toggle/",
              {
                student:
                  Number(
                    selectedStudent
                  ),
                lesson:
                  lesson.id,
                is_locked:
                  lockValue,
              }
            );
          }
        }

        fetchAccess();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold">
          Lesson Access
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <select
          value={
            selectedCourse
          }
          onChange={(e) =>
            setSelectedCourse(
              e.target.value
            )
          }
          className="border rounded-xl p-3"
        >
          <option value="">
            Select Course
          </option>

          {courses.map(
            (course) => (
              <option
                key={
                  course.id
                }
                value={
                  course.id
                }
              >
                {
                  course.title
                }
              </option>
            )
          )}
        </select>

        <select
          value={
            selectedStudent
          }
          onChange={(e) =>
            setSelectedStudent(
              e.target.value
            )
          }
          className="border rounded-xl p-3"
        >
          <option value="">
            Select Student
          </option>

          {students.map(
            (student) => (
              <option
                key={
                  student.id
                }
                value={
                  student.id
                }
              >
                {student.name ||
                  student.username}
              </option>
            )
          )}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              bulkUpdate(
                false
              )
            }
            className="bg-green-600 text-white rounded-xl p-3"
          >
            Unlock All
          </button>

          <button
            onClick={() =>
              bulkUpdate(
                true
              )
            }
            className="bg-red-600 text-white rounded-xl p-3"
          >
            Lock All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">

        {loading ? (
          <p>
            Loading...
          </p>
        ) : (
          <div className="space-y-6">

            {modules.map(
              (module) => (
                <div
                  key={
                    module.module_id
                  }
                >
                  <h2 className="font-semibold text-lg mb-3">
                    {
                      module.module
                    }
                  </h2>

                  <div className="space-y-3">

                    {module.lessons.map(
                      (
                        lesson
                      ) => (
                        <div
                          key={
                            lesson.id
                          }
                          className="border rounded-xl p-4 flex justify-between items-center"
                        >
                          <span>
                            {
                              lesson.title
                            }
                          </span>

                          <button
                            onClick={() =>
                              toggleLesson(
                                lesson
                              )
                            }
                            className={`px-4 py-2 rounded-xl text-white ${
                              lesson.is_locked
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {lesson.is_locked
                              ? "Unlock"
                              : "Lock"}
                          </button>
                        </div>
                      )
                    )}

                  </div>
                </div>
              )
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default LessonAccess;