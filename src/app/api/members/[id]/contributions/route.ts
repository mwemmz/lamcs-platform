import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const isAdmin = session.user?.role === "admin";
  const isSelf = session.user?.id === params.id;
  if (!isAdmin && !isSelf) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const contributions = await prisma.contribution.findMany({
    where: { memberId: params.id },
    orderBy: { deliveredAt: "desc" },
  });
  return NextResponse.json(contributions);
}
