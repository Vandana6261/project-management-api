import { projectExists } from "../services/projectService.js";
import { checkProjectMembers, createTaskService, getAssignedTaskService } from "../services/taskService.js";
import { AppError } from "../utils/AppError.js";
import { createTaskSchema } from "../validations/taskValidation.js";

export const createTask = async (req, res) => {
  const taskData = req.body;

  const validationResult = createTaskSchema.safeParse(req.body);

  if (!validationResult.success) {
    console.log(validationResult, "validate Result");
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: validationResult.error.issues,
    });
  }

  const projectId = taskData.projectId;

  const isProjectNameExist = await projectExists("", taskData.projectId);
  if (!isProjectNameExist)
    throw new AppError("Project doesn't exist with this name", 409);

  const invalidMembers = await checkProjectMembers(
    taskData.projectId,
    taskData.members,
  );
  if(invalidMembers.length) {
    throw new AppError("All assigned user must belongs to the project", 409)
  }

  const task = await createTaskService(taskData);

  return res.status(200).json({ message: true, task });
};

export const getAssignedTask = async (req, res) => {
  const userId = req.user.userId;
  const userTasks = await getAssignedTaskService(userId);
  return res.status(200).json({success: true, message: userTasks});
}