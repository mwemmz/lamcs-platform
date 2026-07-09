import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const isAdmin = session.user?.role === "admin";
  const isSelf = session.user?.id === params.id;
  if (!isAdmin && !isSelf) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const payouts = await prisma.payout.findMany({
    where: { memberId: params.id },
    orderBy: { paidAt: "desc" },
  });
  return NextResponse.json(payouts);
}
