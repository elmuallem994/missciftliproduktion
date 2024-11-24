"use client";

import { useCartStore } from "@/utils/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingBasket } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa"; // استيراد أيقونة واتساب
import { useUser } from "@clerk/nextjs"; // استيراد بيانات المستخدم

const LocalIcons = () => {
  const { totalItems, totalPrice } = useCartStore();
  const pathname = usePathname();
  const { user } = useUser(); // جلب بيانات المستخدم

  // إذا كان المستخدم في صفحة الكارت أو إذا كان المستخدم مشرفًا، إخفاء الأيقونات
  if (pathname === "/cart" || user?.publicMetadata?.role === "admin") {
    return null;
  }

  return (
    <>
      {/* أيقونة واتساب */}
      <Link
        href="https://wa.me/905348228865"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 md:bottom-1/2 md:right-10 md:transform md:-translate-y-1/2 bg-green-500 text-white rounded-full shadow-2xl p-2 flex items-center justify-center cursor-pointer"
      >
        <FaWhatsapp size={30} />
      </Link>

      {/* أيقونة السلة */}
      <Link href="/cart">
        <div className="fixed bottom-4 right-4 md:bottom-[42%] md:right-10 md:transform md:-translate-y-1/2 bg-orange-400 text-white rounded-full shadow-xl p-3 flex items-center gap-1 cursor-pointer animate-bounce-slow">
          <span className="text-sm">{totalPrice}₺</span>
          <FaShoppingBasket size={30} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-lg font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </Link>
    </>
  );
};

export default LocalIcons;
