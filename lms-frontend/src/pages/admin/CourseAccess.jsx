import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";

const CourseAccess = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [assignedStudents, setAssignedStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchInitialData();
  }, []);

  // =========================
  // ON COURSE CHANGE
  // =========================
  useEffect(() => {
    if (selectedCourse) {
      fetchAssignedStudents(selectedCourse);
    } else {
      setAssignedStudents([]);
    }
  }, [selectedCourse]);

  // =========================
  // FETCH COURSES + STUDENTS
  // =========================
  const fetchInitialData = async () => {
    try {
      const [courseRes, studentRes] = await Promise.all([
        API.get("/courses/admin-list/"),
        API.get("/auth/students/"),
      ]);

      setCourses(courseRes.data || []);
      setStudents(studentRes.data || []);
    } catch (error) {
      console.error("Failed loading initial data", error);
    }
  };

  // =========================
  // FETCH ASSIGNED STUDENTS
  // =========================
  const fetchAssignedStudents = async (courseId = selectedCourse) => {
    if (!courseId) return;

    try {
      setLoading(true);

      const res = await API.get(
        `/courses/course-access/${courseId}/`
      );

      setAssignedStudents(res.data || []);
    } catch (error) {
      console.error("Failed loading access list", error);
      setAssignedStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ASSIGN COURSE
  // =========================
  const assignCourse = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    try {
      setSaving(true);

      await API.post(
        "/courses/course-access/assign/",
        {
          student: Number(selectedStudent),
          course: Number(selectedCourse),
        }
      );

      setSelectedStudent("");
      fetchAssignedStudents();
    } catch (error) {
      console.error("Assign failed", error);

      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to assign course."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // REMOVE ACCESS
  // =========================
  const removeAccess = async (studentId) => {
    const ok = window.confirm(
      "Remove course access for this student?"
    );

    if (!ok) return;

    try {
      await API.post(
        "/courses/course-access/remove/",
        {
          student: Number(studentId),
          course: Number(selectedCourse),
        }
      );

      fetchAssignedStudents();
    } catch (error) {
      console.error("Remove failed", error);
      alert("Failed to remove access.");
    }
  };

  // =========================
  // BULK ASSIGN ALL
  // =========================
  const assignAll = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    const ok = window.confirm(
      "Assign this course to all students?"
    );

    if (!ok) return;

    try {
      setSaving(true);

      await Promise.all(
        students.map((student) =>
          API.post(
            "/courses/course-access/assign/",
            {
              student: student.id,
              course: Number(selectedCourse),
            }
          )
        )
      );

      fetchAssignedStudents();
    } catch (error) {
      console.error("Bulk assign failed", error);
      alert("Failed bulk assign.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // FILTERED ASSIGNED LIST
  // =========================
  const filteredAssigned = useMemo(() => {
    if (!search.trim()) return assignedStudents;

    const q = search.toLowerCase();

    return assignedStudents.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const username = (item.username || "").toLowerCase();

      return (
        name.includes(q) ||
        username.includes(q)
      );
    });
  }, [assignedStudents, search]);

  // =========================
  // AVAILABLE STUDENTS
  // =========================
  const availableStudents = useMemo(() => {
    const assignedIds = assignedStudents.map(
      (item) => item.student_id
    );

    return students.filter(
      (student) =>
        !assignedIds.includes(student.id)
    );
  }, [students, assignedStudents]);

  const selectedCourseName =
    courses.find(
      (c) =>
        String(c.id) ===
        String(selectedCourse)
    )?.title || "";

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Course Access Management
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Assign or revoke student access to premium learning content.
        </p>
      </div>

      {/* TOP CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* COURSE SELECT */}
        <div className="bg-white rounded-2xl shadow p-5">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Select Course
          </label>

          <select
            value={selectedCourse}
            onChange={(e) =>
              setSelectedCourse(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="">
              Choose Course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>
            ))}
          </select>

          {selectedCourseName && (
            <p className="mt-3 text-sm text-blue-600">
              Active Course: {selectedCourseName}
            </p>
          )}
        </div>

        {/* ASSIGN STUDENT */}
        <div className="bg-white rounded-2xl shadow p-5">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Assign Student
          </label>

          <select
            value={selectedStudent}
            onChange={(e) =>
              setSelectedStudent(e.target.value)
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="">
              Choose Student
            </option>

            {availableStudents.map(
              (student) => (
                <option
                  key={student.id}
                  value={student.id}
                >
                  {student.name ||
                    student.username}
                </option>
              )
            )}
          </select>

          <button
            onClick={assignCourse}
            disabled={saving}
            className="w-full mt-3 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
          >
            Assign Course
          </button>
        </div>

        {/* BULK ACTION */}
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Bulk Actions
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Fast assign course to all students.
            </p>
          </div>

          <button
            onClick={assignAll}
            disabled={saving || !selectedCourse}
            className="mt-4 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
          >
            Assign To All Students
          </button>
        </div>
      </div>

      {/* ACCESS LIST */}
      <div className="bg-white rounded-2xl shadow">

        {/* HEADER */}
        <div className="p-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-800">
              Assigned Students
            </h2>

            <p className="text-sm text-slate-500">
              Total: {assignedStudents.length}
            </p>
          </div>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search student..."
            className="border rounded-xl px-4 py-2 w-full md:w-72"
          />
        </div>

        {/* BODY */}
        <div className="p-5">

          {!selectedCourse ? (
            <p className="text-slate-400">
              Select a course to manage access.
            </p>
          ) : loading ? (
            <p className="text-slate-500">
              Loading access list...
            </p>
          ) : filteredAssigned.length === 0 ? (
            <p className="text-slate-400">
              No students assigned yet.
            </p>
          ) : (
            <div className="space-y-3">

              {filteredAssigned.map(
                (item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.name ||
                          item.username}
                      </p>

                      <p className="text-sm text-slate-500">
                        @{item.username}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          item.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                      <button
                        onClick={() =>
                          removeAccess(
                            item.student_id
                          )
                        }
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAccess;