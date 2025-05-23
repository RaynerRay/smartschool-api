import { PrismaClient, SubjectCategory, SubjectType } from "@prisma/client";

const prisma = new PrismaClient();
const SCHOOL_ID = "cm4kub0c40000o0bbt3xgzo5s";

async function main() {
  console.log("Starting seed operation...");

  // Create departments
  const departments = [
    {
      name: "Mathematics Department",
      slug: "mathematics",
    },
    {
      name: "Science Department",
      slug: "science",
    },
    {
      name: "Languages Department",
      slug: "languages",
    },
    {
      name: "Social Sciences Department",
      slug: "social-sciences",
    },
    {
      name: "Arts Department",
      slug: "arts",
    },
    {
      name: "Physical Education Department",
      slug: "physical-education",
    },
  ];

  // Create departments first
  const createdDepartments = await Promise.all(
    departments.map(async (dept) => {
      const department = await prisma.department.upsert({
        where: { slug: dept.slug },
        update: {},
        create: {
          name: dept.name,
          slug: dept.slug,
          schoolId: SCHOOL_ID,
          budget: Math.floor(Math.random() * 50000) + 50000, // Random budget between 50,000 and 100,000
          budgetYear: "2023-2024",
        },
      });
      console.log(`Created department: ${department.name}`);
      return department;
    })
  );

  // Map of department slugs to their IDs for easy reference
  const departmentMap = createdDepartments.reduce((map, dept) => {
    map[dept.slug] = { id: dept.id, name: dept.name };
    return map;
  }, {} as Record<string, { id: string; name: string }>);

  // Define subjects with their respective departments
  const subjects = [
    {
      name: "Mathematics",
      slug: "mathematics",
      code: "MATH101",
      shortName: "Math",
      departmentSlug: "mathematics",
      category: SubjectCategory.CORE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "Additional Mathematics",
      slug: "additional-mathematics",
      code: "MATH201",
      shortName: "Add Math",
      departmentSlug: "mathematics",
      category: SubjectCategory.ELECTIVE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "Physics",
      slug: "physics",
      code: "PHYS101",
      shortName: "Phys",
      departmentSlug: "science",
      category: SubjectCategory.CORE,
      type: SubjectType.BOTH,
      passingMarks: 40,
      totalMarks: 100,
      hasPractical: true,
      labRequired: true,
    },
    {
      name: "Chemistry",
      slug: "chemistry",
      code: "CHEM101",
      shortName: "Chem",
      departmentSlug: "science",
      category: SubjectCategory.CORE,
      type: SubjectType.BOTH,
      passingMarks: 40,
      totalMarks: 100,
      hasPractical: true,
      labRequired: true,
    },
    {
      name: "Biology",
      slug: "biology",
      code: "BIOL101",
      shortName: "Bio",
      departmentSlug: "science",
      category: SubjectCategory.CORE,
      type: SubjectType.BOTH,
      passingMarks: 40,
      totalMarks: 100,
      hasPractical: true,
      labRequired: true,
    },
    {
      name: "English",
      slug: "english",
      code: "ENGL101",
      shortName: "Eng",
      departmentSlug: "languages",
      category: SubjectCategory.CORE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "French",
      slug: "french",
      code: "FREN101",
      shortName: "Fr",
      departmentSlug: "languages",
      category: SubjectCategory.ELECTIVE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "History",
      slug: "history",
      code: "HIST101",
      shortName: "Hist",
      departmentSlug: "social-sciences",
      category: SubjectCategory.CORE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "Geography",
      slug: "geography",
      code: "GEOG101",
      shortName: "Geo",
      departmentSlug: "social-sciences",
      category: SubjectCategory.ELECTIVE,
      type: SubjectType.THEORY,
      passingMarks: 40,
      totalMarks: 100,
    },
    {
      name: "Art",
      slug: "art",
      code: "ART101",
      shortName: "Art",
      departmentSlug: "arts",
      category: SubjectCategory.ELECTIVE,
      type: SubjectType.BOTH,
      passingMarks: 40,
      totalMarks: 100,
      hasPractical: true,
    },
    {
      name: "Music",
      slug: "music",
      code: "MUS101",
      shortName: "Music",
      departmentSlug: "arts",
      category: SubjectCategory.EXTRA_CURRICULAR,
      type: SubjectType.BOTH,
      passingMarks: 40,
      totalMarks: 100,
      hasPractical: true,
    },
    {
      name: "Physical Education",
      slug: "physical-education",
      code: "PE101",
      shortName: "PE",
      departmentSlug: "physical-education",
      category: SubjectCategory.CORE,
      type: SubjectType.PRACTICAL,
      passingMarks: 40,
      totalMarks: 100,
      hasTheory: false,
      hasPractical: true,
    },
  ];

  // Create subjects
  for (const subject of subjects) {
    const departmentInfo = departmentMap[subject.departmentSlug];

    if (!departmentInfo) {
      console.error(`Department with slug ${subject.departmentSlug} not found`);
      continue;
    }

    const createdSubject = await prisma.subject.upsert({
      where: { slug: subject.slug },
      update: {},
      create: {
        name: subject.name,
        slug: subject.slug,
        code: subject.code,
        shortName: subject.shortName,
        category: subject.category,
        type: subject.type,
        passingMarks: subject.passingMarks,
        totalMarks: subject.totalMarks,
        departmentId: departmentInfo.id,
        departmentName: departmentInfo.name,
        schoolId: SCHOOL_ID,
        hasTheory: subject.hasTheory !== false,
        hasPractical: subject.hasPractical || false,
        labRequired: subject.labRequired || false,
        isActive: true,
        isOptional: subject.category === SubjectCategory.ELECTIVE,
      },
    });

    console.log(
      `Created subject: ${createdSubject.name} in ${departmentInfo.name}`
    );
  }

  console.log("Seed operation completed successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seed operation:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
