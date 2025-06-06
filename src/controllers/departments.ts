import { db } from "@/db/db";
import {
  ClassCreateProps,
  ContactProps,
  DepartmentCreateProps,
  StreamCreateProps,
  TypedRequestBody,
} from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export async function createDepartment(
  req: TypedRequestBody<DepartmentCreateProps>,
  res: Response
) {
  const data = req.body;
  const slug = generateSlug(data.name);
  data.slug = slug;
  try {
    // Check if the school already exists\
    const existingDepartment = await db.department.findUnique({
      where: {
        slug,
      },
    });

    if (existingDepartment) {
      return res.status(409).json({
        data: null,
        error: "Department Already exists",
      });
    }
    const newDep = await db.department.create({
      data,
    });
    console.log(
      `Department created successfully: ${newDep.name} (${newDep.id})`
    );
    return res.status(201).json({
      data: newDep,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getDepartments(req: Request, res: Response) {
  try {
    const deps = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        teachers: true,
        subjects: true,
      },
    });
    return res.status(200).json(deps);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch departments" });
  }
}
export async function getDepartmentsBySchoolId(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const deps = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        schoolId,
      },
      include: {
        teachers: true,
        subjects: true,
      },
    });
    return res.status(200).json(deps);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch departments" });
  }
}
export async function getBriefDepartments(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const deps = await db.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        schoolId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return res.status(200).json(deps);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch departments" });
  }
}

// export async function getCustomerById(req: Request, res: Response) {
//   const { id } = req.params;
//   try {
//     const customer = await db.customer.findUnique({
//       where: {
//         id,
//       },
//     });
//     return res.status(200).json(customer);
//   } catch (error) {
//     console.log(error);
//   }
// }
export async function deleteDepartment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const dep = await db.department.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(dep);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch subs" });
  }
}
