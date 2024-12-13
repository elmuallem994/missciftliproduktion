"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { OrderType } from "@/app/types/types";
import { useOrderStore } from "@/utils/store";

const fetchOrder = async (orderId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${orderId}`
  );
  if (!response.ok) {
    throw new Error("Order not found");
  }
  return response.json();
};

const OrderStatusBar: React.FC = () => {
  const { orderIds, removeOrderId } = useOrderStore();
  const router = useRouter();
  const pathname = usePathname();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", orderIds], // مفتاح الاستعلام
    queryFn: async () => {
      const results = await Promise.all(
        orderIds.map((id) =>
          fetchOrder(id).catch(() => {
            removeOrderId(id); // إزالة الطلب إذا لم يتم العثور عليه
            return null;
          })
        )
      );
      return results.filter(Boolean); // استبعاد الطلبات التي لم يتم العثور عليها
    },
    refetchInterval: 10000, // إعادة الجلب كل 10 ثوانٍ
    staleTime: 10000, // استخدام البيانات المؤقتة
  });

  if (pathname.includes("/order-details/")) {
    return null;
  }

  const statuses = ["Alındı", "hazırlanıyor", "Yolda", "teslim edildi"];

  return (
    <div className="fixed bottom-4 left-4 right-4 flex flex-col items-center md:items-start gap-4">
      {orders.map((order: OrderType) => {
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
            {/* تصميم المستطيل ليكون في أقصى اليسار على شاشات الجوال */}
            <div className="md:hidden absolute right-12 bottom-4 flex justify-start items-center">
              <div className="bg-white w-36 h-16 rounded-md shadow-lg border border-gray-200 flex justify-between items-center px-4">
                <div className="flex flex-col items-start">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-200 text-blue-800 font-semibold mb-1">
                    #{order.id.replace(/\D/g, "").slice(-4)}
                  </span>
                  <span className="text-sm text-orange-500 font-semibold">
                    {order.status === "hazırlanıyor"
                      ? "Hazırlanıyor"
                      : order.status}
                  </span>
                </div>
                <div className="relative w-10 h-10 flex justify-center items-center">
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
                  <span className="absolute text-xs text-gray-500 font-semibold">
                    %{Math.round(progressPercentage)}
                  </span>
                </div>
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
