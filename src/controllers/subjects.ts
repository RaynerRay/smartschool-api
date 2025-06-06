import { db } from "@/db/db";
import { SubjectCreateProps, TypedRequestBody } from "@/types/types";
import { generateSlug } from "@/utils/generateSlug";
import { Request, Response } from "express";

export async function createSubject(
  req: TypedRequestBody<SubjectCreateProps>,
  res: Response
) {
  const data = req.body;
  const slug = generateSlug(data.name);
  data.slug = slug;
  try {
    // Check if the school already exists\
    const existingSubject = await db.subject.findUnique({
      where: {
        slug,
      },
    });

    if (existingSubject) {
      return res.status(409).json({
        data: null,
        error: "Subject Already exists",
      });
    }
    const newSub = await db.subject.create({
      data,
    });
    console.log(`Subject created successfully: ${newSub.name} (${newSub.id})`);
    return res.status(201).json({
      data: newSub,
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

export async function getSubjects(req: Request, res: Response) {
  try {
    const subjects = await db.subject.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(subjects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch subjects" });
  }
}
export async function getSubjectsBySchoolId(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const subjects = await db.subject.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        schoolId,
      },
    });
    return res.status(200).json(subjects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch subjects" });
  }
}
export async function getBriefSubjects(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const subjects = await db.subject.findMany({
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
    return res.status(200).json(subjects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch subs" });
  }
}
export async function deleteSubject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const subject = await db.subject.delete({
      where: {
        id,
      },
    });
    return res.status(200).json(subject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to fetch subs" });
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
