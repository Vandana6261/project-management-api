import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "error",
    },
  ],
});

prisma.$on("error", (event) => {
  console.error("Prisma Error:", event);
});


export default prisma;