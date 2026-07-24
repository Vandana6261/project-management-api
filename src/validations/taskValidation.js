import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(255, "Task title is too long"),

  description: z.string().max(1000, "Description is too long").optional(),

  status: z.enum(["TODO","IN_PROGRESS","IN_REVIEW","DONE","CANCELLED"]).optional().default("TODO"),

  priority: z.enum(["LOW","MEDIUM","HIGH","URGENT"]).optional().default("MEDIUM"),

  startDate: z.iso.datetime().optional(),

  dueDate: z.iso.datetime().optional(),

  projectId: z.string().cuid("Invalid project id"),

  members: z.array(z.string().cuid("Invalid user id")).optional().default([])
}).refine(
  (data) => {
    if (!data.startDate || !data.dueDate) {
      return true;
    }

    return new Date(data.startDate) <= new Date(data.dueDate);
  },
  {
    message: "Start date cannot be after due date",
    path: ["dueDate"]
  }
);
