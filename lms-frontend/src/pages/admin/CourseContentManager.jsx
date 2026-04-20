import { useEffect, useMemo, useState } from "react";
import API from "../../api/api";

const initialLessonState = {
  module: "",
  title: "",
  type: "video",
  youtube_url: "",
  pdf_url: "",
  notes_url: "",
};

const CourseContentManager = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [content, setContent] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [moduleTitle, setModuleTitle] = useState("");

  const [lessonForm, setLessonForm] = useState(initialLessonState);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const selectedCourseObj = useMemo(() => {
    return courses.find((c) => String(c.id) === String(selectedCourse));
  }, [courses, selectedCourse]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchContent(selectedCourse);
    } else {
      setContent([]);
    }
  }, [selectedCourse]);

  // =========================
  // FETCH COURSES
  // =========================
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/admin-list/");
      setCourses(res.data || []);
    } catch (error) {
      console.error("Failed to load courses", error);
    }
  };

  // =========================
  // FETCH CONTENT
  // =========================
  const fetchContent = async (courseId = selectedCourse) => {
    if (!courseId) return;

    try {
      setLoading(true);
      const res = await API.get(`/courses/content/${courseId}/`);
      setContent(res.data || []);
    } catch (error) {
      console.error("Failed to load content", error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE MODULE
  // =========================
  const createModule = async () => {
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    if (!moduleTitle.trim()) {
      alert("Please enter module title.");
      return;
    }

    try {
      setSaving(true);

      await API.post("/courses/module/create/", {
        course: Number(selectedCourse),
        title: moduleTitle.trim(),
        order: content.length,
      });

      setModuleTitle("");
      fetchContent();
    } catch (error) {
      console.error("Module create failed", error);
      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to create module"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LESSON FORM CHANGE
  // =========================
  const handleLessonChange = (e) => {
    const { name, value } = e.target;

    setLessonForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET LESSON FORM
  // =========================
  const resetLessonForm = () => {
    setLessonForm(initialLessonState);
    setEditingLessonId(null);
  };

  // =========================
  // PREPARE PAYLOAD
  // =========================
  const buildLessonPayload = () => {
    const payload = {
      module: Number(lessonForm.module),
      title: lessonForm.title.trim(),
      type: lessonForm.type,
      youtube_url: "",
      pdf_url: "",
      notes_url: "",
      order: 0,
    };

    if (lessonForm.type === "video") {
      payload.youtube_url = lessonForm.youtube_url.trim();
    }

    if (lessonForm.type === "pdf") {
      payload.pdf_url = lessonForm.pdf_url.trim();
    }

    if (lessonForm.type === "note") {
      payload.notes_url = lessonForm.notes_url.trim();
    }

    return payload;
  };

  // =========================
  // VALIDATE LESSON
  // =========================
  const validateLesson = () => {
    if (!lessonForm.module) {
      alert("Please select module.");
      return false;
    }

    if (!lessonForm.title.trim()) {
      alert("Please enter lesson title.");
      return false;
    }

    if (
      lessonForm.type === "video" &&
      !lessonForm.youtube_url.trim()
    ) {
      alert("Please enter YouTube URL.");
      return false;
    }

    if (
      lessonForm.type === "pdf" &&
      !lessonForm.pdf_url.trim()
    ) {
      alert("Please enter PDF URL.");
      return false;
    }

    if (
      lessonForm.type === "note" &&
      !lessonForm.notes_url.trim()
    ) {
      alert("Please enter Notes URL.");
      return false;
    }

    return true;
  };

  // =========================
  // CREATE LESSON
  // =========================
  const createLesson = async () => {
    if (!validateLesson()) return;

    try {
      setSaving(true);

      await API.post(
        "/courses/lesson/create/",
        buildLessonPayload()
      );

      resetLessonForm();
      fetchContent();
    } catch (error) {
      console.error("Lesson create failed", error);

      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to create lesson"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UPDATE LESSON
  // =========================
  const updateLesson = async () => {
    if (!editingLessonId) return;
    if (!validateLesson()) return;

    try {
      setSaving(true);

      await API.put(
        `/courses/lesson/update/${editingLessonId}/`,
        buildLessonPayload()
      );

      resetLessonForm();
      fetchContent();
    } catch (error) {
      console.error("Lesson update failed", error);

      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to update lesson"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT LESSON
  // =========================
  const startEditLesson = (lesson, moduleId) => {
    setEditingLessonId(lesson.id);

    setLessonForm({
      module: String(moduleId),
      title: lesson.title || "",
      type: lesson.type || "video",
      youtube_url: lesson.youtube_url || "",
      pdf_url: lesson.pdf_url || "",
      notes_url: lesson.notes_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE LESSON
  // =========================
  const deleteLesson = async (lessonId) => {
    const ok = window.confirm("Delete this lesson?");
    if (!ok) return;

    try {
      await API.delete(
        `/courses/lesson/${lessonId}/delete/`
      );

      fetchContent();
    } catch (error) {
      console.error("Delete lesson failed", error);
      alert("Failed to delete lesson.");
    }
  };

  // =========================
  // DELETE MODULE
  // =========================
  const deleteModule = async (moduleId) => {
    const ok = window.confirm(
      "Delete this module and its lessons?"
    );

    if (!ok) return;

    try {
      await API.delete(
        `/courses/module/${moduleId}/delete/`
      );

      fetchContent();
    } catch (error) {
      console.error("Delete module failed", error);
      alert("Failed to delete module.");
    }
  };

  // =========================
  // MOVE LESSON
  // =========================
  const moveLesson = async (
    moduleLessons,
    lessonId,
    direction
  ) => {
    const cloned = [...moduleLessons];

    const index = cloned.findIndex(
      (item) => item.id === lessonId
    );

    if (index === -1) return;

    const target =
      direction === "up" ? index - 1 : index + 1;

    if (target < 0 || target >= cloned.length) return;

    [cloned[index], cloned[target]] = [
      cloned[target],
      cloned[index],
    ];

    const payload = cloned.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    try {
      await API.post(
        "/courses/lesson/reorder/",
        { lessons: payload }
      );

      fetchContent();
    } catch (error) {
      console.error("Reorder failed", error);
      alert("Failed to reorder lessons.");
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h1 className="text-2xl font-bold text-slate-800">
          Content Builder
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Create modules, manage lessons, update learning content.
        </p>
      </div>

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
          <option value="">Choose Course</option>

          {courses.map((course) => (
            <option
              key={course.id}
              value={course.id}
            >
              {course.title}
            </option>
          ))}
        </select>

        {selectedCourseObj && (
          <p className="text-sm text-blue-600 mt-2">
            Selected: {selectedCourseObj.title}
          </p>
        )}
      </div>

      {/* CREATE MODULE */}
      {selectedCourse && (
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="font-semibold text-slate-800 mb-3">
            Add Module
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={moduleTitle}
              onChange={(e) =>
                setModuleTitle(e.target.value)
              }
              placeholder="Enter module title"
              className="flex-1 border rounded-xl p-3"
            />

            <button
              onClick={createModule}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
            >
              Add Module
            </button>
          </div>
        </div>
      )}

      {/* LESSON FORM */}
      {selectedCourse && (
        <div className="bg-white rounded-2xl shadow p-5 space-y-4">
          <h2 className="font-semibold text-slate-800">
            {editingLessonId
              ? "Edit Lesson"
              : "Create Lesson"}
          </h2>

          <select
            name="module"
            value={lessonForm.module}
            onChange={handleLessonChange}
            className="w-full border rounded-xl p-3"
          >
            <option value="">Choose Module</option>

            {content.map((module) => (
              <option
                key={module.module_id}
                value={module.module_id}
              >
                {module.module}
              </option>
            ))}
          </select>

          <input
            name="title"
            value={lessonForm.title}
            onChange={handleLessonChange}
            placeholder="Lesson title"
            className="w-full border rounded-xl p-3"
          />

          <select
            name="type"
            value={lessonForm.type}
            onChange={handleLessonChange}
            className="w-full border rounded-xl p-3"
          >
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="note">Note</option>
          </select>

          {lessonForm.type === "video" && (
            <input
              name="youtube_url"
              value={lessonForm.youtube_url}
              onChange={handleLessonChange}
              placeholder="YouTube URL"
              className="w-full border rounded-xl p-3"
            />
          )}

          {lessonForm.type === "pdf" && (
            <input
              name="pdf_url"
              value={lessonForm.pdf_url}
              onChange={handleLessonChange}
              placeholder="Google Drive PDF URL"
              className="w-full border rounded-xl p-3"
            />
          )}

          {lessonForm.type === "note" && (
            <input
              name="notes_url"
              value={lessonForm.notes_url}
              onChange={handleLessonChange}
              placeholder="Google Drive Notes URL"
              className="w-full border rounded-xl p-3"
            />
          )}

          <div className="flex flex-wrap gap-3">
            {editingLessonId ? (
              <button
                onClick={updateLesson}
                disabled={saving}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Update Lesson
              </button>
            ) : (
              <button
                onClick={createLesson}
                disabled={saving}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl"
              >
                Create Lesson
              </button>
            )}

            <button
              onClick={resetLessonForm}
              className="bg-slate-200 px-5 py-2 rounded-xl"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* CONTENT LIST */}
      {selectedCourse && (
        <div className="space-y-5">
          {loading ? (
            <div className="bg-white rounded-2xl shadow p-5">
              Loading content...
            </div>
          ) : content.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-5">
              No modules created yet.
            </div>
          ) : (
            content.map((module) => (
              <div
                key={module.module_id}
                className="bg-white rounded-2xl shadow p-5"
              >
                {/* MODULE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {module.module}
                  </h3>

                  <button
                    onClick={() =>
                      deleteModule(module.module_id)
                    }
                    className="text-red-600 text-sm"
                  >
                    Delete Module
                  </button>
                </div>

                {/* LESSONS */}
                <div className="space-y-3">
                  {module.lessons?.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No lessons inside this module.
                    </p>
                  ) : (
                    module.lessons.map(
                      (lesson, index) => (
                        <div
                          key={lesson.id}
                          className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {lesson.title}
                            </p>

                            <p className="text-xs text-slate-500 mt-1 uppercase">
                              {lesson.type}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                moveLesson(
                                  module.lessons,
                                  lesson.id,
                                  "up"
                                )
                              }
                              disabled={index === 0}
                              className="px-3 py-1 bg-slate-100 rounded-lg text-sm"
                            >
                              ↑
                            </button>

                            <button
                              onClick={() =>
                                moveLesson(
                                  module.lessons,
                                  lesson.id,
                                  "down"
                                )
                              }
                              disabled={
                                index ===
                                module.lessons.length - 1
                              }
                              className="px-3 py-1 bg-slate-100 rounded-lg text-sm"
                            >
                              ↓
                            </button>

                            <button
                              onClick={() =>
                                startEditLesson(
                                  lesson,
                                  module.module_id
                                )
                              }
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteLesson(lesson.id)
                              }
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CourseContentManager;