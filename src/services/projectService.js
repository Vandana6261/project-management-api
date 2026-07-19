import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

export const createProjectService = async (userId, data) => {
  const { name, description, status, priority, dueDate } = data;
  console.log("project service called");
  // If no due date is provided, set it to 6 months from now.
  const finalDueDate = dueDate
    ? new Date(dueDate)
    : (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 6);
        return date;
      })();

  try {
    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          status,
          priority,
          dueDate: finalDueDate,
        },
      });

      // Add the creator as the OWNER
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId,
          role: "OWNER",
        },
      });

      return newProject;
    });

    return project;
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError("Project already exists with this name. Please choose another name.", 409);
    }

    throw error;
  }
};

export const projectExists = async (name) => {
  const existingProject = await prisma.project.findUnique({
    where: {
      name,
    },
  });
  
  return existingProject;
};
