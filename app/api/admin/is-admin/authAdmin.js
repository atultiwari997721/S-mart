import prisma from "@/lib/prisma";

export default async function authAdmin(userId) {
  if (!userId) return false;
  // Get user from DB
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.email) return false;
  // Get admin emails from env
  const adminEmails =
    process.env.ADMIN_EMAIL?.split(",").map((e) => e.trim().toLowerCase()) ||
    [];
  return adminEmails.includes(user.email.toLowerCase());
}
