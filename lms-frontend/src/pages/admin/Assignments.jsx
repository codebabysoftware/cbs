import { useEffect, useState } from "react";
import API from "../../api/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const Assignments = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const s = await API.get("/auth/students/");
    const c = await API.get("/courses/admin-list/");
    setStudents(s.data);
    setCourses(c.data);
  };

  const assign = async () => {
    await API.post("/courses/assign/", {
      student,
      course,
      is_active: true,
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Assignments</h1>

      <Card className="flex gap-2">
        <select onChange={(e) => setStudent(e.target.value)}>
          <option>Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.username}
            </option>
          ))}
        </select>

        <select onChange={(e) => setCourse(e.target.value)}>
          <option>Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <Button onClick={assign}>Assign</Button>
      </Card>
    </div>
  );
};

export default Assignments;