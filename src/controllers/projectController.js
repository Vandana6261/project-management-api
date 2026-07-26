import { getUserByMail } from "../services/authService.js";
import { addMemberService, createProjectService, getAllProjectService, projectExists, getProjectMemberService } from "../services/projectService.js";
import { AppError } from "../utils/AppError.js";
import { projectSchema } from "../validations/projectValidation.js";


export const createProject = async (req, res) => {
  const projectData = req.body;
  const { userId } = req.user;

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


export const getAllProject = async (req, res) => {
  const project = await getAllProjectService(req.user.userId);
  return res.status(200).json({success: true, project});
}


export const addMember = async (req, res) => {
  const {email, role, projectId} = req.body;

  if(!email || !role) {
    throw new AppError("Required fields are missing", 400);
  }

  const user = await getUserByMail(email);
  if(!user) throw new AppError("User with this email not registered in our application", 404);

  const userId = user.id;

  const isProject = await projectExists("", projectId);
  if(!isProject) throw new AppError("This project doesn't exists in db");

  const isMemberAdded = await addMemberService(email, role, projectId, userId);

  return res.status(200).json({success: true, isMemberAdded});
}


export const getProjectMember = async (req, res) => {
  const { projectId } = req.params;

  const isProjectNameExist = await projectExists("", projectId);
  if(!isProjectNameExist) throw new AppError("Project doesn't exist with this name", 409);

  const members = await getProjectMemberService(projectId);

  res.status(200).json({success: true, members});
}