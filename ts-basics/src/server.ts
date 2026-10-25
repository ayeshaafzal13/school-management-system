import express, { Request, Response } from "express";
import { ApiResponse, Repository, Student, fail, ok } from "./types";

const app = express();
app.use(express.json());

// Generic Repository used with the Student type
const students = new Repository<Student>([
  { id: 1, name: "Ayesha", surname: "Afzal", className: "1A" },
  { id: 2, name: "Ali", surname: "Khan", className: "2B" },
]);

// Typed request pieces for each route
type IdParams = { id: string };
type CreateStudentBody = Omit<Student, "id">;

// GET /students  -> list all students
app.get(
  "/students",
  (_req: Request, res: Response<ApiResponse<Student[]>>) => {
    res.json(ok(students.getAll()));
  }
);

// GET /students/:id  -> one student
app.get(
  "/students/:id",
  (req: Request<IdParams>, res: Response<ApiResponse<Student>>) => {
    const student = students.getById(Number(req.params.id));
    if (!student) {
      res.status(404).json(fail("Student not found"));
      return;
    }
    res.json(ok(student));
  }
);

// POST /students  -> create a student
app.post(
  "/students",
  (
    req: Request<Record<string, never>, ApiResponse<Student>, CreateStudentBody>,
    res: Response<ApiResponse<Student>>
  ) => {
    const { name, surname, className } = req.body ?? {};
    if (!name || !surname || !className) {
      res.status(400).json(fail("name, surname and className are required"));
      return;
    }
    res.status(201).json(ok(students.add({ name, surname, className })));
  }
);

// DELETE /students/:id  -> remove a student
app.delete(
  "/students/:id",
  (req: Request<IdParams>, res: Response<ApiResponse<{ id: number }>>) => {
    const id = Number(req.params.id);
    if (!students.remove(id)) {
      res.status(404).json(fail("Student not found"));
      return;
    }
    res.json(ok({ id }));
  }
);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`ts-basics API running on http://localhost:${PORT}`);
});