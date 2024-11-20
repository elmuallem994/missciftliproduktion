"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const textAnimation = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.1,
    },
  }),
};

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const companyName = "MISS ÇİFTLİK";
  const welcomeText = "Hoş Geldiniz";

  return (
    <div
      className="h-screen w-full relative my-swiper-container z-0 "
      style={{ fontFamily: "AardvarkCafe, sans-serif" }}
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        effect="fade"
        speed={800}
        className="w-full h-full"
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
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

      {/* نص الترحيب يظهر فقط على الشريحة الأولى */}
      {activeSlide === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white px-4 bg-black bg-opacity-40">
          {/* تأثير الكتابة لاسم الشركة */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-2 text-orange-400 drop-shadow-[0_5px_10px_rgba(0,0,0,0.7)] tracking-wide"
            initial="hidden"
            animate="visible"
            variants={textAnimation}
          >
            {Array.from(companyName).map((char, i) => (
              <motion.span key={i} custom={i} variants={textAnimation}>
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* تأثير الكتابة لكلمة الترحيب */}
          <motion.p
            className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-100 drop-shadow-[0_3px_8px_rgba(0,0,0,0.5)]"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delay: companyName.length * 0.1,
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {Array.from(welcomeText).map((char, i) => (
              <motion.span key={i} custom={i} variants={textAnimation}>
                {char}
              </motion.span>
            ))}
          </motion.p>
        </div>
      )}

      {/* صورة أمواج الحليب مع تأثير ارتفاع وانخفاض */}
      <motion.div
        className="absolute bottom-[-10px] md:bottom-[-10px] left-0 w-full z-20"
        animate={{
          y: [0, -10, 0], // حركة العمودية للأعلى ثم الأسفل
        }}
        transition={{
          duration: 3, // مدة الحركة
          repeat: Infinity, // تكرار الحركة بلا نهاية
          ease: "easeInOut", // نوع الحركة
        }}
      >
        <Image
          src="/mog.png" // ضع رابط صورة الأمواج هنا
          alt="Milk Waves"
          width={1920}
          height={200}
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
};

export default Slider;
