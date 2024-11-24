import prisma from "@/utils/connect";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // احصل على تاريخ اليوم بدون الوقت
    const today = new Date();
    today.setHours(0, 0, 0, 0); // إزالة الوقت للتأكد من مقارنة التاريخ فقط

    // تحويل اليوم إلى النص بصيغة YYYY-MM-DD
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
    res
      .status(200)
      .json({ success: true, message: `${updatedOrders.count} طلب تم تحديثه` });
  } catch (error) {
    console.error("خطأ أثناء تحديث الطلبات:", error);
    res
      .status(500)
      .json({ success: false, message: "خطأ أثناء تحديث الطلبات", error });
  }
}
