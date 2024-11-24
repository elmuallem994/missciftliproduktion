import Image from "next/image";

const Offer = () => {
  return (
    <div className="flex flex-col items-center w-full bg-primary-black mb-20 md:mb-32">
      {/* القسم الأول: الصورة الأولى كـ بنر */}
      <div className="relative w-full h-[20vh] sm:h-[30vh] md:h-[40vh] lg:h-[50vh]  ">
        <Image
          src="/Kap1.jpg" // تأكد من مسار الصورة
          alt="Kapınıza Teslimat"
          fill
          objectFit="cover" // لضمان عرض متناسق
          priority
        />
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-lg md:text-3xl lg:text-6xl font-bold text-orange-400 px-4 py-2 rounded-md">
            Kapınıza Teslimat
          </h1>
        </div>
      </div>

      {/* القسم الثاني: تحسين عرض الصورة الثانية مع خلفية bg-gray-900 */}
      <div className="w-full py-10 md:py-16 flex flex-col items-center bg-gray-900">
        {/* النص التوضيحي */}
        <div className="text-center mb-10">
          <h2 className="text-orange-400 text-lg md:text-xl lg:text-2xl font-bold">
            Teslimat Araçlarımız
          </h2>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg mt-2">
            Özel olarak tasarlanmış araçlarımızla her zaman hızlı ve güvenilir
            teslimat sağlıyoruz.
          </p>
        </div>

        {/* الصورة */}
        <div className="relative w-full ">
          <Image
            src="/car.png" // تأكد من مسار الصورة
            alt="Delivery Cars"
            width={2000} // عرض الصورة
            height={1000} // ارتفاع الصورة
            className="object-contain" // زوايا دائرية على الشاشات الكبيرة فقط
          />
        </div>
      </div>
    </div>
  );
};

export default Offer;
