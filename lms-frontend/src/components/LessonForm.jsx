import { useEffect, useState } from "react";
import API from "../api/api";
import Button from "./ui/Button";
import Input from "./ui/Input";

const LessonForm = ({ courseId, refresh }) => {
  const [modules, setModules] = useState([]);

  const [form, setForm] = useState({
    module: "",
    title: "",
    lesson_type: "video",
    content: "",
    order: 1,
  });

  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const res = await API.get(`/courses/content/${courseId}/`);
      setModules(res.data);
    } catch {
      console.error("Failed to load modules");
    }
  };

  /**
   * RESET FILES WHEN TYPE CHANGES
   */
  useEffect(() => {
    setVideo(null);
    setPdf(null);
    setForm((prev) => ({ ...prev, content: "" }));
  }, [form.lesson_type]);

  /**
   * CREATE LESSON
   */
  const createLesson = async () => {
    if (!form.module) return alert("Select module");
    if (!form.title) return alert("Enter title");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("module", form.module);
      formData.append("title", form.title);
      formData.append("lesson_type", form.lesson_type);
      formData.append("order", form.order);

      // TYPE BASED DATA
      if (form.lesson_type === "video") {
        if (!video) return alert("Video required");
        formData.append("video", video);
      }

      if (form.lesson_type === "note") {
        if (!form.content) return alert("Content required");
        formData.append("content", form.content);
      }

      if (form.lesson_type === "pdf") {
        if (!pdf) return alert("PDF required");
        formData.append("pdf", pdf);
      }

      await API.post("/courses/lesson/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Lesson created successfully");

      // RESET FORM
      setForm({
        module: "",
        title: "",
        lesson_type: "video",
        content: "",
        order: 1,
      });

      setVideo(null);
      setPdf(null);

      refresh && refresh();
    } catch (err) {
      console.error(err.response?.data);
      alert("Error creating lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h3 className="font-semibold mb-4">Create Lesson</h3>

      <div className="grid gap-4">
        {/* MODULE SELECT */}
        <select
          className="input"
          value={form.module}
          onChange={(e) =>
            setForm({ ...form, module: e.target.value })
          }
        >
          <option value="">Select Module</option>
          {modules.map((m) => (
            <option key={m.module_id} value={m.module_id}>
              {m.module_title}
            </option>
          ))}
        </select>

        {/* TITLE */}
        <Input
          placeholder="Lesson title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* TYPE */}
        <select
          className="input"
          value={form.lesson_type}
          onChange={(e) =>
            setForm({ ...form, lesson_type: e.target.value })
          }
        >
          <option value="video">Video</option>
          <option value="note">Note</option>
          <option value="pdf">PDF</option>
        </select>

        {/* VIDEO */}
        {form.lesson_type === "video" && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}

        {/* NOTES */}
        {form.lesson_type === "note" && (
          <textarea
            className="input"
            placeholder="Enter notes content..."
            rows={6}
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
          />
        )}

        {/* PDF */}
        {form.lesson_type === "pdf" && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        )}

        {/* ORDER */}
        <Input
          type="number"
          value={form.order}
          onChange={(e) =>
            setForm({ ...form, order: e.target.value })
          }
        />

        {/* BUTTON */}
        <Button onClick={createLesson} disabled={loading}>
          {loading ? "Creating..." : "Create Lesson"}
        </Button>
      </div>
    </div>
  );
};

export default LessonForm;