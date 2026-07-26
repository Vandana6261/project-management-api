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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        "Project already exists with this name. Please choose another name.",
        409,
      );
    }

    throw error;
  }
};

export const projectExists = async (name = "", projectId = "") => {
  if (name) {
    const existingProject = await prisma.project.findUnique({
      where: {
        name,
      },
    });

    return existingProject;
  }

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    return project;
  }
};

export const getAllProjectService = async (userId) => {
  const projects = await prisma.projectMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      project: true,
    },
  });

  return projects;
};

export const addMemberService = async (email, role, projectId, userId) => {
  try {
    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
      include: {
        user: true,
        project: true,
      },
    });

    return member;
  } catch (error) {
    if (error.code === "P2002") {
      console.log(error, "error in add member service")
      throw new AppError("User is already a project member", 409);
    }
  }
};

export const getProjectMemberService = async (projectId) => {
  const members = await prisma.projectMember.findMany({
    where: {
      projectId,
    },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
    },
  });

  return members.map((member) => member.user);
};
