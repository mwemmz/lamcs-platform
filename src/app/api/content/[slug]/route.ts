import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  const page = await prisma.contentPage.findUnique({ where: { slug: params.slug } });
  if (!page || (!page.published && !isAdmin)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as never;
  const page = await prisma.contentPage.update({ where: { slug: params.slug }, data: body });
  return NextResponse.json(page);
}
