import prisma from "../config/prisma.js";

export const createTaskService = async (taskData) => {
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

  const existingMemberIds = projectMembers.map((member) => member.userId);

  const invalidMembers = userIds.filter((userId) => !existingMemberIds.includes(userId));

  return invalidMembers;
};

export const getAssignedTaskService = async (userId) => {
  const userTasks = await prisma.taskAssignment.findMany({
    where: {
      userId,
    },
    select: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          startDate: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return userTasks;
};

export const getTaskByIdService = async (taskId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true,
          priority: true,
          members: {
            select: {
              role: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      assignments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });
  return task;
};

export const updateTaskService = async (taskId, updateData) => {
  const { title, description, status, priority, startDate, dueDate, members } = updateData;

  return await prisma.$transaction(async (tx) => {
    if (members && Array.isArray(members)) {
      await tx.taskAssignment.deleteMany({
        where: { taskId },
      });
      if (members.length > 0) {
        await tx.taskAssignment.createMany({
          data: members.map((userId) => ({
            taskId,
            userId,
          })),
        });
      }
    }

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (status !== undefined) dataToUpdate.status = status;
    if (priority !== undefined) dataToUpdate.priority = priority;
    if (startDate !== undefined) dataToUpdate.startDate = startDate ? new Date(startDate) : null;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTask = await tx.task.update({
      where: { id: taskId },
      data: dataToUpdate,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    return updatedTask;
  });
};
