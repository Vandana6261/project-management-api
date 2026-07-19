import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100, "Project name too long"),
  description: z.string().max(3000, "Description too long").optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["PLANNING","ACTIVE","ON_HOLD","COMPLETED","CANCELLED"]).optional(),
  priority: z.enum(["LOW","MEDIUM","HIGH"]).optional(),
});