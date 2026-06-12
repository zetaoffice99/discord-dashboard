// app/dashboard/page.js
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import DashboardClient from "./DashboardClient";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Not logged in → send to login
  if (!session) redirect("/login");

  // Get latest user data from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return <DashboardClient user={user} />;
}