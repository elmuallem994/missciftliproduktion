"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { MenuType } from "../types/types";

// دالة لجلب البيانات من الـ API
const getData = async (): Promise<MenuType> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};

const Categories = () => {
  const [categories, setCategories] = useState<MenuType>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getData();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen container mx-auto flex flex-col justify-center items-center px-4">
      {/* العنوان */}
      <div className="text-center pt-14 mt-1 pb-16">
        <h1
          className="glowing-text text-4xl md:text-5xl lg:text-6xl text-white"
          style={{ fontFamily: "AardvarkCafe, sans-serif" }}
        >
          Günlük Taze
        </h1>
        <p className="mt-10 text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto">
          Türkiyenin bereketli topraklarından doğanın sunduğu en taze ve doğal
          ürünleri sizler için özenle topladık. Çiftlikten sofranıza ulaşan bu
          ürünlerle، lezzet ve sağlık dolu bir yaşam sunuyoruz. Doğal
          lezzetlerin tadını çıkarın ve sağlıklı bir yaşam için güvenle tercih
          edin.
        </p>
      </div>

      {/* عرض الصور */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-14 w-full max-w-4xl md:max-w-5xl">
        {categories.map((category) => (
          <Link href={`/menu/${category.slug}`} key={category.id} passHref>
            <div className="group relative flex flex-col items-center transition-transform duration-300 transform hover:scale-105">
              <div className="relative w-full h-44 md:h-72">
                {" "}
                {/* تم زيادة الحجم هنا */}
                <Image
                  src={category.img}
                  alt={category.title}
                  fill
                  className="object-cover rounded-md" // استخدم object-cover لملء الحاوية بالكامل
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
