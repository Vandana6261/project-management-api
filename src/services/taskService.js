import prisma from "../config/prisma.js";

export const createTaskService = async (taskData) => {
  console.log("task Service")
  console.log(taskData, "taskData")
  console.log(prisma.task);
  const task = await prisma.task.create({
    data: {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      startDate: taskData.startDate,
      dueDate: taskData.dueDate,

      projectId: taskData.projectId,

      assignments: {
        create: taskData.members.map((userId) => ({
          userId: userId,
        })),
      },
    },

    include: {
      assignments: {
        include: {
          user: true,
        },
      },
    },
  });

  return task;
};


export const checkProjectMembers = async (projectId, userIds) => {
  const projectMembers = await prisma.projectMember.findMany({
    where: {
      projectId,
      userId: {
        in: userIds
      }
    },
    select: {
      userId: true
    }
  });

  const existingMemberIds = projectMembers.map(
    member => member.userId
  );

  const invalidMembers = userIds.filter(
    userId => !existingMemberIds.includes(userId)
  );

  return invalidMembers;
};
