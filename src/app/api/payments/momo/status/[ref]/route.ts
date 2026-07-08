import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { ref: string } }
) {
  const payment = await prisma.payment.findFirst({
    where: { providerRef: params.ref },
    include: { order: { select: { status: true, reference: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: payment.status,
    providerRef: payment.providerRef,
    orderRef: payment.order.reference,
    orderStatus: payment.order.status,
    amount: payment.amount,
    loggedAt: payment.loggedAt,
  });
}
