
export const getOptions = (req, res, next) => {
  return res.json({
    success: true,
    data: {
      status: [
        {
          value: "PLANNING",
          label: "Planning",
        },
        {
          value: "ACTIVE",
          label: "Active",
        },
        {
          value: "ON_HOLD",
          label: "On Hold",
        },
        {
          value: "COMPLETED",
          label: "Completed",
        },
        {
          value: "CANCELLED",
          label: "Cancelled",
        },
      ],
      priority: [
        {
          value: "LOW",
          label: "Low",
        },
        {
          value: "MEDIUM",
          label: "Medium",
        },
        {
          value: "HIGH",
          label: "High",
        },
      ],
      roles: [
        {
          value: "OWNER",
          label: "Owner",
        },
        {
          value: "ADMIN",
          label: "Admin",
        },
        {
          value: "MEMBER",
          label: "Member",
        },
      ],
    },
  });
};
