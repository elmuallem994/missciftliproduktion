// app/api/neighborhoods/[neighborhoodId]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { neighborhoodId: string } }
) {
  try {
    const neighborhoodId = parseInt(params.neighborhoodId);

    if (isNaN(neighborhoodId)) {
      return NextResponse.json(
        { message: "Invalid neighborhood ID" },
        { status: 400 }
      );
    }

    // جلب بيانات الحي
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
      include: { region: true }, // تضمين معلومات المنطقة
    });

    if (!neighborhood) {
      return NextResponse.json(
        { message: "Neighborhood not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(neighborhood, { status: 200 });
  } catch (error) {
    console.error("Error fetching neighborhood:", error);
    return NextResponse.json(
      { message: "Error fetching neighborhood" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { neighborhoodId: string } }
) {
  try {
    const neighborhoodId = parseInt(params.neighborhoodId);
    const { name, deliveryDays, startTime, endTime } = await req.json();

    if (!name || !deliveryDays || !startTime || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // تحقق من وجود الحي
    const existingNeighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
    });

    if (!existingNeighborhood) {
      return NextResponse.json(
        { message: "Neighborhood not found" },
        { status: 404 }
      );
    }

    // تعديل بيانات الحي
    const updatedNeighborhood = await prisma.neighborhood.update({
      where: { id: neighborhoodId },
      data: {
        name,
        deliveryDays,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(updatedNeighborhood, { status: 200 });
  } catch (error) {
    console.error("Error updating neighborhood:", error);
    return NextResponse.json(
      { message: "Error updating neighborhood" },
      { status: 500 }
    );
  }
}

// Handler for DELETE requests
export async function DELETE(
  req: NextRequest,
  { params }: { params: { neighborhoodId: string } }
) {
  const neighborhoodId = Number(params.neighborhoodId); // تحويل إلى رقم

  if (isNaN(neighborhoodId) || neighborhoodId <= 0) {
    return NextResponse.json(
      { message: "Invalid neighborhood ID" },
      { status: 400 }
    );
  }

  try {
    // التحقق من وجود الحي
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
    });

    if (!neighborhood) {
      return NextResponse.json(
        { message: "Neighborhood not found." },
        { status: 404 }
      );
    }

    // حذف العناوين المرتبطة بالحي
    await prisma.address.deleteMany({
      where: { neighborhoodId },
    });

    // حذف الحي نفسه
    await prisma.neighborhood.delete({
      where: { id: neighborhoodId },
    });

    return NextResponse.json(
      { message: "Neighborhood deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting neighborhood:", error);
    return NextResponse.json(
      { message: "Error deleting neighborhood." },
      { status: 500 }
    );
  }
}
