import { prisma } from "../config/db.js";

export const profileUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) throw (new Error("User not found").cause = 404);
  return user;
};
