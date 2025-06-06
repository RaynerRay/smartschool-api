import {
  createSchool,
  getSchoolById,
  getSchools,
  getSchoolTitles,
} from "@/controllers/schools";
import express from "express";
const schoolRouter = express.Router();

schoolRouter.post("/schools", createSchool);
schoolRouter.get("/schools", getSchools);
schoolRouter.get("/schools/titles", getSchoolTitles);
schoolRouter.get("/schools/:id", getSchoolById);
// schoolRouter.get("/customers/:id", getCustomerById);
// schoolRouter.get("/api/v2/customers", getV2Customers);

export default schoolRouter;
