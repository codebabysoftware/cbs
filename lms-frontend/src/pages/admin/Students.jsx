import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Trash2,
  RefreshCcw,
  Shield,
  GraduationCap,
} from "lucide-react";
import API from "../../api/api";

const Students = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/auth/students/"
      );

      setStudents(res.data || []);
    } catch (error) {
      console.error(
        "Failed to load students",
        error
      );
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const refreshData = async () => {
    await fetchStudents();
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE STUDENT
  // =========================
  const createStudent = async () => {
    if (!form.name.trim()) {
      alert("Enter full name.");
      return;
    }

    if (!form.username.trim()) {
      alert("Enter username.");
      return;
    }

    if (!form.password.trim()) {
      alert("Enter password.");
      return;
    }

    try {
      setSaving(true);

      await API.post(
        "/auth/register/",
        {
          name: form.name.trim(),
          username:
            form.username.trim(),
          email:
            form.email.trim(),
          password:
            form.password,
          role: "student",
        }
      );

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
      });

      fetchStudents();
    } catch (error) {
      console.error(
        "Create student failed",
        error
      );

      alert(
        error?.response?.data
          ? JSON.stringify(
              error.response.data
            )
          : "Failed to create student."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const deleteStudent = async (
    studentId
  ) => {
    const ok =
      window.confirm(
        "Delete this student?"
      );

    if (!ok) return;

    try {
      await API.delete(
        `/auth/students/${studentId}/delete/`
      );

      fetchStudents();
    } catch (error) {
      console.error(
        "Delete failed",
        error
      );
      alert(
        "Failed to delete student."
      );
    }
  };

  // =========================
  // FILTERED STUDENTS
  // =========================
  const filteredStudents =
    useMemo(() => {
      if (!search.trim())
        return students;

      const q =
        search.toLowerCase();

      return students.filter(
        (student) => {
          const name = (
            student.name || ""
          ).toLowerCase();

          const username = (
            student.username ||
            ""
          ).toLowerCase();

          const email = (
            student.email || ""
          ).toLowerCase();

          return (
            name.includes(q) ||
            username.includes(
              q
            ) ||
            email.includes(q)
          );
        }
      );
    }, [students, search]);

  // =========================
  // STATS
  // =========================
  const totalStudents =
    students.length;

  const activeStudents =
    students.length;

  const withEmail =
    students.filter(
      (item) => item.email
    ).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Students Management
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Create, manage and
              monitor learner
              accounts.
            </p>
          </div>

          <button
            onClick={
              refreshData
            }
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            <RefreshCcw
              size={16}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Students
              </p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {
                  totalStudents
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active Users
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {
                  activeStudents
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <GraduationCap
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Email Added
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {
                  withEmail
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Mail
                size={22}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CREATE STUDENT */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center gap-2 mb-5">
          <UserPlus
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-slate-800">
            Add Student
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <input
            name="name"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            placeholder="Full Name"
            className="border rounded-xl p-3"
          />

          <input
            name="username"
            value={
              form.username
            }
            onChange={
              handleChange
            }
            placeholder="Username"
            className="border rounded-xl p-3"
          />

          <input
            name="email"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            placeholder="Email (optional)"
            className="border rounded-xl p-3"
          />

          <input
            type="password"
            name="password"
            value={
              form.password
            }
            onChange={
              handleChange
            }
            placeholder="Password"
            className="border rounded-xl p-3"
          />
        </div>

        <button
          onClick={
            createStudent
          }
          disabled={saving}
          className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Create Student
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow">

        {/* LIST HEADER */}
        <div className="p-5 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h2 className="font-semibold text-slate-800">
              Students List
            </h2>

            <p className="text-sm text-slate-500">
              Total:{" "}
              {
                totalStudents
              }
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={16}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              placeholder="Search students..."
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />
          </div>
        </div>

        {/* LIST BODY */}
        <div className="p-5">

          {loading ? (
            <p className="text-slate-500">
              Loading students...
            </p>
          ) : filteredStudents.length ===
            0 ? (
            <p className="text-slate-400">
              No students found.
            </p>
          ) : (
            <div className="space-y-3">

              {filteredStudents.map(
                (
                  student
                ) => (
                  <div
                    key={
                      student.id
                    }
                    className="border rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">
                          {student.name ||
                            student.username}
                        </p>

                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          Student
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        @
                        {
                          student.username
                        }
                      </p>

                      {student.email && (
                        <p className="text-sm text-slate-500">
                          {
                            student.email
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                        <Shield
                          size={
                            12
                          }
                        />
                        Active
                      </span>

                      <button
                        onClick={() =>
                          deleteStudent(
                            student.id
                          )
                        }
                        className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200"
                      >
                        <Trash2
                          size={
                            15
                          }
                        />
                        Delete
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

export default Students;