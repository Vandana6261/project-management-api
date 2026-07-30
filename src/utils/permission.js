export const permissions = {
  OWNER: [
    "PROJECT_UPDATE",
    "PROJECT_DELETE",
    "MEMBER_ADD",
    "MEMBER_REMOVE",
    "TASK_CREATE",
    "TASK_ASSIGN",
    "TASK_UPDATE",
    "TASK_DELETE",
    "ASSIGN_TASK"
  ],

  ADMIN: [
    "PROJECT_UPDATE",
    "MEMBER_ADD",
    "TASK_CREATE",
    "TASK_ASSIGN",
    "TASK_UPDATE",
    "ASSIGN_TASK"
  ],

  DEVELOPER: [
    "TASK_UPDATE",
    "TASK_COMMENT"
  ],

  MEMBER: [
    "TASK_VIEW",
    "TASK_COMMENT"
  ]
};
