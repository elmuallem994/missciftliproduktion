"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Categories = () => {
  const categories = [
    { id: 1, title: "Eggs", image: "/categ1.jpg" },
    { id: 2, title: "Milk", image: "/categ2.jpg" },
    { id: 3, title: "Olive Oil", image: "/categ3.jpg" },
    { id: 4, title: "Olive ", image: "/categ4.jpg" },
    { id: 5, title: "Olive ", image: "/categ5.jpg" },
  ];

  return (
    <div className="min-h-screen container mx-auto flex flex-col justify-center items-center px-4">
      <div className="text-center pt-14 mt-1 pb-16">
        <h1 className="glowing-text text-4xl md:text-5xl lg:text-6xl text-white font-bold">
          Günlük Taze
        </h1>
        <p className="mt-10 text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto">
          Türkiye nin bereketli topraklarından doğanın sunduğu en taze ve doğal
          ürünleri sizler için özenle topladık. Çiftlikten sofranıza ulaşan bu
          ürünlerle, lezzet ve sağlık dolu bir yaşam sunuyoruz. Doğal
          lezzetlerin tadını çıkarın ve sağlıklı bir yaşam için güvenle tercih
          edin
        </p>
      </div>

      <Carousel
        opts={{ align: "center" }}
        className="w-full max-w-4xl space-y-4"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="flex basis-[90%] sm:basis-[45%] md:basis-[30%] px-2"
            >
              <div className="transition-transform duration-300 transform hover:scale-105">
                <Card className="rounded-lg shadow-lg overflow-hidden">
                  <CardContent className=" flex items-center justify-center p-0 aspect-square">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover" // استخدم object-cover لملء البطاقة بالكامل
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="text-gray-600 hover:text-gray-800" />
        <CarouselNext className="text-gray-600 hover:text-gray-800" />
      </Carousel>
    </div>
  );
};

export default Categories;
