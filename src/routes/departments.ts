import {
  createDepartment,
  deleteDepartment,
  getBriefDepartments,
  getDepartments,
  getDepartmentsBySchoolId,
} from "@/controllers/departments";
import express from "express";
const departmentRouter = express.Router();

departmentRouter.post("/departments", createDepartment);
departmentRouter.get("/departments", getDepartments);
departmentRouter.get("/departments/school/:schoolId", getDepartmentsBySchoolId);
departmentRouter.delete("/departments/:id", deleteDepartment);
departmentRouter.get("/departments/brief/:schoolId", getBriefDepartments);
// departmentRouter.get("/customers/:id", getCustomerById);
// departmentRouter.get("/api/v2/customers", getV2Customers);

export default departmentRouter;
