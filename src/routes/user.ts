import { createContact, getContacts } from "@/controllers/admin";
import { createSchool, getSchools } from "@/controllers/schools";
import {
  createUser,
  getAllUsers,
  getStaffMembers,
  getUserProfileId,
  loginUser,
} from "@/controllers/users";
import express from "express";
const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/users", getAllUsers);
userRouter.get("/users/:userId", getUserProfileId);
userRouter.post("/staff", getUserProfileId);
userRouter.get("/staff/:schoolId", getStaffMembers);
// userRouter.get("/api/v2/customers", getV2Customers);

export default userRouter;
