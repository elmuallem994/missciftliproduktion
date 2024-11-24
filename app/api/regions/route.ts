// app/api/regions/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const regions = await prisma.region.findMany({
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

    return NextResponse.json(regions, { status: 200 });
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { message: "Error fetching regions" },
      { status: 500 }
    );
  }
}

// POST endpoint in your API file
// POST endpoint in your API file
export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json(); // جلب اسم المنطقة من الطلب

    if (!name) {
      return NextResponse.json(
        { message: "Region name is required" },
        { status: 400 }
      );
    }

    const existingRegion = await prisma.region.findUnique({
      where: { name },
    });

    if (existingRegion) {
      return NextResponse.json(
        { message: "Region with the same name already exists" },
        { status: 409 }
      );
    }

    // إنشاء منطقة جديدة
    const newRegion = await prisma.region.create({
      data: {
        name, // استخدام المتغير 'name' من الطلب
      },
      include: {
        neighborhoods: true, // تضمين الأحياء
      },
    });

    return NextResponse.json(
      {
        ...newRegion,
        neighborhoods: newRegion.neighborhoods || [], // تأكد من وجود خاصية الأحياء
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating region:", error);
    return NextResponse.json(
      { message: "Error creating region" },
      { status: 500 }
    );
  }
}
