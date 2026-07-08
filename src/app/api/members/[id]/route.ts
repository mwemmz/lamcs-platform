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
  const member = await prisma.member.findUnique({ where: { id: params.id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const isAdmin = session.user?.role === "admin";
  const isSelf = session.user?.id === params.id;
  if (!isAdmin && !isSelf) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await req.json()) as { [key: string]: unknown };
  const allowed = isAdmin ? body : { name: body.name, phone: body.phone, email: body.email, farmLocation: body.farmLocation };
  const member = await prisma.member.update({ where: { id: params.id }, data: allowed });
  return NextResponse.json(member);
}
