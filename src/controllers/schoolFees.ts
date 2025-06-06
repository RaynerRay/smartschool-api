import { db } from "@/db/db";
import {
  PeriodCreateProps,
  SchoolFeeProps,
  TypedRequestBody,
} from "@/types/types";
import { Request, Response } from "express";
import { groupBy } from "lodash";
export async function createSchoolFee(
  req: TypedRequestBody<SchoolFeeProps>,
  res: Response
) {
  const formData = req.body;
  const { fees, ...others } = formData;
  try {
    const schoolFee = await db.schoolFee.create({
      data: {
        ...others,
      },
    });
    const feesData = fees.map((fee) => {
      return {
        ...fee,
        schoolFeeId: schoolFee.id,
      };
    });
    const newFees = await db.fee.createMany({
      data: feesData,
    });
    console.log(`School created successfully: ${schoolFee} `);
    return res.status(201).json({
      data: schoolFee,
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

export async function getSchoolFees(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const schFees = await db.schoolFee.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        term: true,
        title: true,
        className: true,
        fees: true,
        year: true,
      },
    });

    const currentYear = new Date().getFullYear();
    const result = schFees
      .filter((item) => item.year === currentYear)
      .map((item) => {
        const totalFees = item.fees.reduce((acc, item) => acc + item.amount, 0);
        return {
          ...item,
          fees: totalFees,
        };
      });

    return res.status(200).json({
      data: result,
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
export async function getSchoolFeesByClass(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const { className, term } = req.query;
    // console.log(className);
    const schFees = await db.schoolFee.findMany({
      where: {
        schoolId,
        className: className as string,
        term: term as string,
      },
      select: {
        id: true,
        term: true,
        title: true,
        className: true,
        fees: true,
        year: true,
      },
    });

    const currentYear = new Date().getFullYear();
    const result = schFees
      .filter((item) => item.year === currentYear)
      // .filter((item) => item.className === className)
      .map((item) => {
        const totalFees = item.fees.reduce((acc, item) => acc + item.amount, 0);
        return {
          ...item,
          totalFees: totalFees,
        };
      });

    return res.status(201).json({
      data: result,
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
