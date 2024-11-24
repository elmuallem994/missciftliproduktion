// app/api/address/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;

    // جلب العنوان بناءً على userId
    const address = await prisma.address.findFirst({
      where: { userId },
      include: {
        region: true, // تضمين معلومات المنطقة
        neighborhood: true, // تضمين معلومات الحي
      },
    });

    // التحقق إذا لم يتم العثور على العنوان أو المنطقة أو الحي
    if (!address || !address.region || !address.neighborhood) {
      return NextResponse.json(
        { message: "Address, region, or neighborhood not found" },
        { status: 404 }
      );
    }

    // إرجاع جميع تفاصيل العنوان مع المنطقة والحي
    return NextResponse.json({
      addressId: address.id,
      il: address.il,
      adres: address.adres,
      regionId: address.regionId,
      regionName: address.region.name,
      neighborhoodId: address.neighborhoodId,
      neighborhoodName: address.neighborhood.name,
      isRegionAvailable: address.isRegionAvailable,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { message: "Error fetching address" },
      { status: 500 }
    );
  }
};
