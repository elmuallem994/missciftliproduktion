import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// تحديث الطلبات (POST)
export const POST = async () => {
  try {
    // احصل على تاريخ اليوم بدون الوقت
    const today = new Date();
    today.setHours(0, 0, 0, 0); // إزالة الوقت للتأكد من مقارنة التاريخ فقط

    const formattedToday = today.toISOString().split("T")[0];

    // تحديث الطلبات التي تحتوي على تاريخ اليوم
    const updatedOrders = await prisma.order.updateMany({
      where: {
        deliveryDate: {
          contains: formattedToday,
        },
        status: "Alındı",
      },
      data: {
        status: "teslim edildi",
      },
    });

    console.log(`${updatedOrders.count} طلب تم تحديثه إلى "تم التسليم".`);
    return NextResponse.json({
      success: true,
      message: `${updatedOrders.count} طلب تم تحديثه`,
    });
  } catch (error) {
    console.error("خطأ أثناء تحديث الطلبات:", error);
    return NextResponse.json(
      { success: false, message: "خطأ أثناء تحديث الطلبات", error },
      { status: 500 }
    );
  }
};

// جلب الطلبات (GET)
export const GET = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedToday = today.toISOString().split("T")[0];

    // جلب الطلبات التي تم تحديث حالتها اليوم
    const orders = await prisma.order.findMany({
      where: {
        deliveryDate: {
          contains: formattedToday,
        },
        status: "teslim edildi",
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "لا توجد طلبات محدثة اليوم" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("خطأ أثناء جلب الطلبات:", error);
    return NextResponse.json(
      { success: false, message: "خطأ أثناء جلب الطلبات", error },
      { status: 500 }
    );
  }
};
