import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  const listings = await prisma.produceListing.findMany({
    where: isAdmin ? {} : { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(listings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as never;
  const listing = await prisma.produceListing.create({ data: body });
  return NextResponse.json(listing, { status: 201 });
}
