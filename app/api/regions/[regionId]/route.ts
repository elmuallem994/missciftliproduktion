// app/api/regions/[regionId]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  try {
    const regionId = parseInt(params.regionId);

    const region = await prisma.region.findUnique({
      where: { id: regionId },
      include: {
        neighborhoods: {
          select: {
            id: true,
            name: true,
            deliveryDays: true, // تأكد من تضمين الحقل
            startTime: true, // تأكد من تضمين الحقل
            endTime: true, // تأكد من تضمين الحقل
          },
        },
      },
    });

    if (!region) {
      return NextResponse.json(
        { message: "Region not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(region, { status: 200 });
  } catch (error) {
    console.error("Error fetching region:", error);
    return NextResponse.json(
      { message: "Error fetching region" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  try {
    const regionId = parseInt(params.regionId);
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Region name is required" },
        { status: 400 }
      );
    }

    const updatedRegion = await prisma.region.update({
      where: { id: regionId },
      data: { name },
    });

    return NextResponse.json(updatedRegion, { status: 200 });
  } catch (error) {
    console.error("Error updating region:", error);
    return NextResponse.json(
      { message: "Error updating region" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  try {
    const regionId = parseInt(params.regionId);

    const existingRegion = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!existingRegion) {
      return NextResponse.json(
        { message: "Region not found" },
        { status: 404 }
      );
    }

    await prisma.region.delete({
      where: { id: regionId },
    });

    return NextResponse.json(
      { message: "Region deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting region:", error);
    return NextResponse.json(
      { message: "Error deleting region" },
      { status: 500 }
    );
  }
}
