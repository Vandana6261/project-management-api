import prisma from "../config/prisma.js";
import { isProjectMember } from "../services/authorizeService.js";
import { permissions } from "../utils/permission.js";

export const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { projectId } = req.body;

      if (!projectId) {
        return res.status(400).json({
          message: "Project id missing",
        });
      }

      const projectMember = await isProjectMember(projectId, userId);

      if (!projectMember) {
        return res.status(403).json({
          message: "You are not a member of this project",
        });
      }

      const rolePermissions = permissions[projectMember.role];

      if (!rolePermissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "You don't have permission",
        });
      }

      // Store role for later use
      req.projectRole = projectMember.role;

      next();
    } catch (error) {
      next(error);
    }
  };
};
