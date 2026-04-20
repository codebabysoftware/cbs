import API from "../api/api";
import Button from "./ui/Button";
import DragList from "./DragList";
import { useState } from "react";

const LessonList = ({ data, refresh }) => {
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");

  const deleteLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;

    await API.delete(`/courses/lesson/delete/${id}/`);
    refresh();
  };

  const startEdit = (lesson) => {
    setEditing(lesson.id);
    setTitle(lesson.title);
  };

  const saveEdit = async (id) => {
    await API.put(`/courses/lesson/update/${id}/`, {
      title,
    });

    setEditing(null);
    refresh();
  };

  const reorderLessons = async (updatedLessons) => {
    const payload = updatedLessons.map((l, index) => ({
      id: l.id,
      order: index + 1,
    }));

    await API.post("/courses/lesson/reorder/", payload);
    refresh();
  };

  return (
    <div className="card">
      <h3 className="font-bold mb-3">Course Content</h3>

      {data.map((module) => (
        <div key={module.module_id} className="mb-4">
          <h4 className="font-semibold">{module.module_title}</h4>

          <DragList
            items={module.lessons}
            onReorder={reorderLessons}
            renderItem={(lesson) => (
              <div className="flex justify-between items-center p-2 border rounded mb-2">
                {editing === lesson.id ? (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                  />
                ) : (
                  <span>{lesson.title}</span>
                )}

                <div className="flex gap-2">
                  {editing === lesson.id ? (
                    <Button onClick={() => saveEdit(lesson.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => startEdit(lesson)}
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    onClick={() => deleteLesson(lesson.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default LessonList;