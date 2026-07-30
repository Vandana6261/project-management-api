import prisma from "../config/prisma.js";

export const isProjectMember = async (projectId, userId) => {
  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });
  
  return projectMember;
};
