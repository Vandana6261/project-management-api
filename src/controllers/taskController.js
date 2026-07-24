import { projectExists } from "../services/projectService.js";
import { checkProjectMembers, createTaskService } from "../services/taskService.js";
import { AppError } from "../utils/AppError.js";
import { createTaskSchema } from "../validations/taskValidation.js";

export const createTask = async (req, res) => {
  const taskData = req.body;
  console.log(taskData, "taskData");

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

  console.log("line 27")
  const invalidMembers = await checkProjectMembers(
    taskData.projectId,
    taskData.members,
  );
  if(invalidMembers.length) {
    throw new AppError("All assigned user must belongs to the project", 409)
  }
  console.log("line 35")
  const task = await createTaskService(taskData);
  console.log(task, "create Task");

  return res.status(200).json({ message: true, task });
};
