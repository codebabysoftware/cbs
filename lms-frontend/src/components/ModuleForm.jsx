import { useState } from "react";
import API from "../api/api";
import Button from "./ui/Button";
import Input from "./ui/Input";

const ModuleForm = ({ courseId, refresh }) => {
  const [title, setTitle] = useState("");

  const createModule = async () => {
    await API.post("/courses/module/create/", {
      title,
      course: courseId,
      order: 1,
    });

    setTitle("");
    refresh();
  };

  return (
    <div className="mb-4 flex gap-2">
      <Input
        placeholder="Module title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Button onClick={createModule}>Add</Button>
    </div>
  );
};

export default ModuleForm;