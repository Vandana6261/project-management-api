import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required").max(100, "Project name too long"),
    description: z.string().max(3000, "Description too long").optional(),
    startDate: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.iso.date().optional()
    ),
    dueDate: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.iso.date().optional()
    ),
    status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.dueDate) {
      const start = new Date(data.startDate);
      const due = new Date(data.dueDate);

      if (due <= start) {
        ctx.addIssue({
          code: "custom",
          path: ["dueDate"],
          message: "Due date must be after the start date.",
        });
      }
    }
  });