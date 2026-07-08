import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [memberCount, orderCount, pendingPaymentCount, revenue] = await Promise.all([
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
  ]);

  return NextResponse.json({
    totalMembers: memberCount,
    activeOrders: orderCount,
    pendingPayments: pendingPaymentCount,
    revenue: revenue._sum.amount || 0,
  });
}
