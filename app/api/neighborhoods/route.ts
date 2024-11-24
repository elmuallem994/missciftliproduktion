// app/api/neighborhoods/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const regionId = req.nextUrl.searchParams.get("regionId");

  if (!regionId) {
    return NextResponse.json(
      { message: "Region ID is required" },
      { status: 400 }
    );
  }

  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      where: { regionId: parseInt(regionId) },
      select: {
        id: true,
        name: true,
        deliveryDays: true,
        startTime: true,
        endTime: true,
      },
    });

    return NextResponse.json(neighborhoods, { status: 200 });
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return NextResponse.json(
      { message: "Error fetching neighborhoods" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { regionId, name, deliveryDays, startTime, endTime } =
      await req.json();

    if (
      !regionId ||
      !name ||
      !Array.isArray(deliveryDays) ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    // التحقق من وجود حي بنفس الاسم في نفس المنطقة
    const existingNeighborhood = await prisma.neighborhood.findFirst({
      where: { name, regionId },
    });

    if (existingNeighborhood) {
      return NextResponse.json(
        {
          message:
            "Neighborhood with the same name already exists in this region",
        },
        { status: 409 }
      );
    }

    // إضافة الحي الجديد
    const newNeighborhood = await prisma.neighborhood.create({
      data: {
        name,
        regionId: parseInt(regionId),
        deliveryDays, // يتم إرسالها مباشرة كمصفوفة
        startTime,
        endTime,
      },
    });

    return NextResponse.json(newNeighborhood, { status: 201 });
  } catch (error) {
    console.error("Error adding neighborhood:", error);
    return NextResponse.json(
      { message: "Error adding neighborhood" },
      { status: 500 }
    );
  }
}
