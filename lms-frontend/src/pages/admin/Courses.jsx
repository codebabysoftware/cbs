import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  PlusCircle,
  Search,
  RefreshCcw,
  Trash2,
  Layers,
  Image as ImageIcon,
  FileText,
  GraduationCap,
} from "lucide-react";
import API from "../../api/api";

const initialForm = {
  title: "",
  description: "",
  thumbnail: null,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [preview, setPreview] = useState("");
  const [form, setForm] = useState(initialForm);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchCourses();
  }, []);

  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/courses/admin-list/"
      );

      setCourses(res.data || []);
    } catch (error) {
      console.error(
        "Failed loading courses",
        error
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const refreshData = async () => {
    await fetchCourses();
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
  // THUMBNAIL CHANGE
  // =========================
  const handleThumbnail =
    (e) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      setForm((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  // =========================
  // CREATE COURSE
  // =========================
  const createCourse =
    async () => {
      if (
        !form.title.trim()
      ) {
        alert(
          "Enter course title."
        );
        return;
      }

      try {
        setSaving(true);

        const payload =
          new FormData();

        payload.append(
          "title",
          form.title.trim()
        );

        payload.append(
          "description",
          form.description.trim()
        );

        if (
          form.thumbnail
        ) {
          payload.append(
            "thumbnail",
            form.thumbnail
          );
        }

        await API.post(
          "/courses/create/",
          payload,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        setForm(
          initialForm
        );
        setPreview("");

        fetchCourses();
      } catch (error) {
        console.error(
          "Create course failed",
          error
        );

        alert(
          error
            ?.response
            ?.data
            ? JSON.stringify(
                error
                  .response
                  .data
              )
            : "Failed to create course."
        );
      } finally {
        setSaving(false);
      }
    };

  // =========================
  // DELETE COURSE
  // =========================
  const deleteCourse =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this course?"
        );

      if (!ok) return;

      try {
        await API.delete(
          `/courses/${id}/delete/`
        );

        fetchCourses();
      } catch (error) {
        console.error(
          "Delete failed",
          error
        );

        alert(
          "Failed to delete course."
        );
      }
    };

  // =========================
  // FILTERED COURSES
  // =========================
  const filteredCourses =
    useMemo(() => {
      if (
        !search.trim()
      )
        return courses;

      const q =
        search.toLowerCase();

      return courses.filter(
        (course) => {
          const title = (
            course.title ||
            ""
          ).toLowerCase();

          const desc = (
            course.description ||
            ""
          ).toLowerCase();

          return (
            title.includes(
              q
            ) ||
            desc.includes(
              q
            )
          );
        }
      );
    }, [courses, search]);

  // =========================
  // STATS
  // =========================
  const totalCourses =
    courses.length;

  const withThumbnail =
    courses.filter(
      (c) =>
        c.thumbnail
    ).length;

  const withDescription =
    courses.filter(
      (c) =>
        c.description
    ).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Courses
              Management
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Create premium
              learning
              programs and
              manage all
              published
              courses.
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
                Total Courses
              </p>

              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {
                  totalCourses
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
                With Thumbnail
              </p>

              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {
                  withThumbnail
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <ImageIcon
                size={22}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                With Description
              </p>

              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {
                  withDescription
                }
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText
                size={22}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CREATE COURSE */}
      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center gap-2 mb-5">
          <PlusCircle
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-slate-800">
            Create New
            Course
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEFT */}
          <div className="space-y-4">

            <input
              name="title"
              value={
                form.title
              }
              onChange={
                handleChange
              }
              placeholder="Course Title"
              className="w-full border rounded-xl p-3"
            />

            <textarea
              rows="5"
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="Course Description"
              className="w-full border rounded-xl p-3 resize-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={
                handleThumbnail
              }
              className="w-full border rounded-xl p-3"
            />

            <button
              onClick={
                createCourse
              }
              disabled={
                saving
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
            >
              Create Course
            </button>
          </div>

          {/* RIGHT */}
          <div className="border rounded-2xl p-5 bg-slate-50">

            <p className="text-sm text-slate-500 mb-4">
              Live Preview
            </p>

            <div className="bg-white rounded-2xl overflow-hidden border">

              <div className="h-44 bg-slate-100 flex items-center justify-center">
                {preview ? (
                  <img
                    src={
                      preview
                    }
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Layers className="text-slate-300" />
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-slate-800">
                  {form.title ||
                    "Course Title"}
                </h3>

                <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                  {form.description ||
                    "Course description preview will appear here."}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  <GraduationCap
                    size={13}
                  />
                  Premium Course
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COURSES LIST */}
      <div className="bg-white rounded-2xl shadow">

        {/* LIST HEADER */}
        <div className="p-5 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <h2 className="font-semibold text-slate-800">
              Published
              Courses
            </h2>

            <p className="text-sm text-slate-500">
              Total:{" "}
              {
                totalCourses
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
              placeholder="Search courses..."
              className="w-full border rounded-xl pl-10 pr-4 py-3"
            />
          </div>
        </div>

        {/* LIST BODY */}
        <div className="p-5">

          {loading ? (
            <p className="text-slate-500">
              Loading
              courses...
            </p>
          ) : filteredCourses.length ===
            0 ? (
            <p className="text-slate-400">
              No courses
              found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {filteredCourses.map(
                (
                  course
                ) => (
                  <div
                    key={
                      course.id
                    }
                    className="border rounded-2xl overflow-hidden hover:shadow-lg transition"
                  >
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

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          Published
                        </span>

                        <button
                          onClick={() =>
                            deleteCourse(
                              course.id
                            )
                          }
                          className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-xl hover:bg-red-200"
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

export default Courses;