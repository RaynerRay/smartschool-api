import {
  createTeacher,
  getTeachers,
  getTeachersBriefBySchoolId,
  getTeachersBySchoolId,
} from "@/controllers/teachers";
import express from "express";
const teacherRouter = express.Router();

teacherRouter.post("/teachers", createTeacher);
teacherRouter.get("/teachers", getTeachers);
teacherRouter.get("/teachers/school/:schoolId", getTeachersBySchoolId);
teacherRouter.get(
  "/teachers-brief/school/:schoolId",
  getTeachersBriefBySchoolId
);
// teacherRouter.get("/customers/:id", getCustomerById);
// teacherRouter.get("/api/v2/customers", getV2Customers);

export default teacherRouter;
