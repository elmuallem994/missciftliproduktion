"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const Slider = () => {
  return (
    <div className="h-screen w-full relative my-swiper-container z-0 ">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        effect="fade"
        speed={800}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide1.jpg"
              alt="Slide 1"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide2.jpg"
              alt="Slide 2"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide5.jpg"
              alt="Slide 3"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* نص الترحيب والوصف */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white px-4  bg-black bg-opacity-40">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-orange-400 drop-shadow-lg">
          Hoş Geldiniz
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl text-gray-100 leading-relaxed px-4 md:px-8 drop-shadow-md ">
          Firmamız, İstanbul ve çevresinde taze süt, peynir ve süt ürünlerinin
          dağıtımını yapmaktadır. En kaliteli süt ve süt ürünleri ile
          hizmetinizdeyiz.
        </p>
      </div>

      {/* صورة أمواج الحليب */}
      <div className="absolute bottom-[-2px] md:bottom-[-10px] left-0 w-full  z-20">
        <Image
          src="/mog.png" // ضع رابط صورة الأمواج هنا
          alt="Milk Waves"
          width={1920}
          height={200}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Slider;
