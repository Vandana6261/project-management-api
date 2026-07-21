import { createProjectService, getAllProjectService, projectExists } from "../services/projectService.js";
import { AppError } from "../utils/AppError.js";
import { projectSchema } from "../validations/projectValidation.js";

export const createProject = async (req, res, next) => {
  const projectData = req.body;
  const { userId } = req.user;
  // console.log(projectData, "projectData");
  // console.log(userId, "userId");

  const validationResult = projectSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    // console.log(validationResult, "validate Result")
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: validationResult.error.issues,
    });
  }
  const isProjectNameExist = await projectExists(projectData.name);
  if(isProjectNameExist) throw new AppError("Project already exist with this name, project name should be unique", 409);

  const result = await createProjectService(userId, projectData);
  
  return res.status(200).json({success: true, result});
};


export const getAllProject = async (req, res, next) => {
  const project = await getAllProjectService(req.user.userId);
  console.log(project, "project")
  return res.status(200).json({success: true, project});
}
