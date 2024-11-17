// OrderStatusBar.tsx

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { OrderType } from "@/app/types/types";
import { useOrderStore } from "@/utils/store";

const OrderStatusBar: React.FC = () => {
  const { orderIds, removeOrderId } = useOrderStore(); // احصل على قائمة الطلبات ودالة الإزالة
  const [orders, setOrders] = useState<OrderType[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  // حالات الطلب ونماذج الحالات
  const statuses = ["Alındı", "hazırlanıyor", "Yolda", "teslim edildi"];

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders: OrderType[] = [];

      for (const orderId of orderIds) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`
          );
          if (response.ok) {
            const data = await response.json();
            fetchedOrders.push(data);
          } else if (response.status === 404) {
            console.warn("Order not found, removing from order list.");
            removeOrderId(orderId);
          }
        } catch (error) {
          console.error("Error fetching order status:", error);
        }
      }

      setOrders(fetchedOrders);
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 5000); // تحديث الطلبات كل 5 ثوانٍ
    return () => clearInterval(interval);
  }, [orderIds, removeOrderId]);

  // إخفاء جميع البطاقات إذا كانت الصفحة الحالية هي صفحة تفاصيل الطلب
  if (pathname.includes("/order-details/")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 flex flex-col items-center md:items-start gap-4 z-50">
      {orders.map((order) => {
        const currentStatusIndex = statuses.indexOf(order.status || "");
        const progressPercentage =
          ((currentStatusIndex + 1) / statuses.length) * 100;

        if (order.status === "teslim edildi") return null;

        return (
          <div
            key={order.id}
            className="relative cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push(`/order-details/${order.id}`)}
          >
            {/* تصميم الدائرة للشاشات الصغيرة */}
            <div className=" md:hidden bg-white w-24 h-24 rounded-full shadow-lg border border-gray-200 flex justify-center items-center">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-300"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  className="text-orange-500"
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${progressPercentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center text-center z-10">
                <span className="px-1  text-xs rounded-full bg-blue-200 text-blue-800 font-semibold">
                  #{order.id.replace(/\D/g, "").slice(-4)}
                </span>
                <span className="text-[12px] text-orange-500 font-semibold pt-1">
                  {order.status === "hazırlanıyor"
                    ? "Hazırlanıyor"
                    : order.status}
                </span>
              </div>
            </div>

            {/* تصميم البطاقة للشاشات الكبيرة */}
            <div className="hidden md:flex flex-col bg-white shadow-lg p-4 rounded-xl border border-gray-200 w-80">
              <p className="text-sm text-gray-500 font-bold pb-2">
                Sipariş Numarası:{" "}
                <span className="px-3 rounded-full bg-blue-100 text-blue-800 font-semibold">
                  # {order.id.replace(/\D/g, "").slice(-4)}
                </span>
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="w-3 h-3 rounded-full bg-orange-400 animate-pulsee"></span>
                <div className="flex gap-1 ml-2 flex-grow">
                  {statuses.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1 w-full rounded-md ${
                        index <= currentStatusIndex
                          ? "bg-orange-500 " +
                            (index === currentStatusIndex
                              ? "animate-current-bar"
                              : "")
                          : "bg-gray-300"
                      }`}
                    ></span>
                  ))}
                </div>
              </div>
              <div className="text-orange-600 text-base font-medium">
                {order.status === "hazırlanıyor"
                  ? "Hazırlanıyor"
                  : order.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusBar;
