import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// وظيفة للحصول على التاريخ بالتنسيق المطلوب
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // إضافة صفر إذا كان الشهر أقل من 10
  const day = String(date.getDate()).padStart(2, "0"); // إضافة صفر إذا كان اليوم أقل من 10
  return `${year}-${month}-${day}`;
};

// تحديث الطلبات (POST)
export const POST = async () => {
  try {
    // ضبط الوقت وفقًا لمنطقة تركيا الزمنية
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
    );
    today.setHours(0, 0, 0, 0); // إزالة الوقت

    // تنسيق التاريخ باستخدام الدالة المخصصة
    const formattedToday = formatDate(today);

    // تحديث الطلبات التي تحتوي على تاريخ اليوم
    const updatedOrders = await prisma.order.updateMany({
      where: {
        deliveryDate: {
          contains: formattedToday, // البحث عن الطلبات التي تحتوي على التاريخ
        },
        status: "Alındı", // الطلبات بحالة "Alındı"
      },
      data: {
        status: "teslim edildi", // تحديث الحالة إلى "teslim edildi"
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
    const today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
    );
    today.setHours(0, 0, 0, 0); // إزالة الوقت

    const formattedToday = formatDate(today);

    // جلب الطلبات التي تحتوي على تاريخ اليوم
    const orders = await prisma.order.findMany({
      where: {
        deliveryDate: {
          contains: formattedToday, // التحقق من أن تاريخ اليوم موجود
        },
        status: "teslim edildi", // الحالة "تم التسليم"
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
