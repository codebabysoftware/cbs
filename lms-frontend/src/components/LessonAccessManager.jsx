import { useEffect, useState } from "react";
import API from "../api/api";
import Card from "./ui/Card";
import Button from "./ui/Button";

const LessonAccessManager = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [course, setCourse] = useState("");
  const [student, setStudent] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    const c = await API.get("/courses/admin-list/");
    const s = await API.get("/auth/students/");
    setCourses(c.data);
    setStudents(s.data);
  };

  const fetchAccess = async () => {
    if (!course || !student) return;

    setLoading(true);

    const res = await API.get(
      `/courses/lesson-access/${course}/${student}/`
    );

    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccess();
  }, [course, student]);

  // 🔁 Toggle single lesson
  const toggleLesson = async (lessonId, current) => {
    await API.post("/courses/lesson/toggle/", {
      student,
      lesson: lessonId,
      is_active: !current,
    });

    // Optimistic UI update
    setData((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId
            ? { ...l, is_active: !current }
            : l
        ),
      }))
    );
  };

  // 🔓 Unlock full module
  const unlockModule = async (module) => {
    const updates = module.lessons.map((l) => ({
      student,
      lesson: l.id,
      is_active: true,
    }));

    await Promise.all(
      updates.map((u) =>
        API.post("/courses/lesson/toggle/", u)
      )
    );

    fetchAccess();
  };

  // 🔒 Lock full module
  const lockModule = async (module) => {
    const updates = module.lessons.map((l) => ({
      student,
      lesson: l.id,
      is_active: false,
    }));

    await Promise.all(
      updates.map((u) =>
        API.post("/courses/lesson/toggle/", u)
      )
    );

    fetchAccess();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">
        Access Control
      </h1>

      {/* SELECTORS */}
      <Card className="mb-6 flex gap-3">
        <select
          className="input"
          onChange={(e) => setCourse(e.target.value)}
        >
          <option>Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          className="input"
          onChange={(e) => setStudent(e.target.value)}
        >
          <option>Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.username}
            </option>
          ))}
        </select>
      </Card>

      {/* LOADING */}
      {loading && (
        <p className="text-slate-500">Loading...</p>
      )}

      {/* MODULES */}
      {data.map((module) => (
        <Card key={module.module} className="mb-4">
          {/* MODULE HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">
              {module.module}
            </h3>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => unlockModule(module)}
              >
                Unlock All
              </Button>

              <Button
                variant="danger"
                onClick={() => lockModule(module)}
              >
                Lock All
              </Button>
            </div>
          </div>

          {/* LESSONS */}
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{lesson.title}</span>

              {/* TOGGLE SWITCH */}
              <button
                onClick={() =>
                  toggleLesson(lesson.id, lesson.is_active)
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  lesson.is_active
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    lesson.is_active
                      ? "translate-x-6"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default LessonAccessManager;