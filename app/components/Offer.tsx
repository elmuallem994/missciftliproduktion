import Image from "next/image";

const Offer = () => {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* القسم العلوي: صورة الشخص بحجمها الطبيعي مع العنوان بداخلها */}
      <div className="w-full max-w-[1000px] mx-auto relative overflow-hidden rounded-3xl">
        <Image
          src="/Kap1.jpg" // تأكد من المسار الصحيح للصورة
          alt="Kapınıza Teslimat"
          width={1000} // عرض الصورة الطبيعي
          height={800} // ارتفاع الصورة الطبيعي
          className="w-full h-auto object-contain" // لجعل الصورة تظهر بالكامل بدون اقتطاع
        />
        <div className="absolute top-20 md:top-52 left-[18%] md:left-[20%] transform -translate-x-1/3">
          <h1 className="text-2xl md:text-5xl font-bold text-orange-400 bg-opacity-80 px-4 py-2 rounded-md">
            Kapınıza Teslimat
          </h1>
        </div>
      </div>

      {/* القسم السفلي: النص والسيارات */}
      <div className="w-full max-w-[1000px] mx-auto flex flex-col md:flex-row items-center mt-16  sm:mt-6">
        {/* النص */}
        <div className="text-center md:text-left md:w-1/2">
          <h2 className="text-xl md:text-3xl font-bold text-orange-400">
            Hızlı ve Güvenilir Teslimat
          </h2>
          <p className="text-sm md:text-base text-gray-300 mt-2">
            Teslimat araçlarımızla siparişlerinizi kapınıza kadar getiriyoruz.
          </p>
        </div>

        {/* صورة السيارات */}
        <div className="w-[85%] md:w-1/2 flex items-center justify-center">
          <div className="w-full h-auto md:h-auto md:scale-100 scale-110 p-2">
            <Image
              src="/car.webp" // تأكد من المسار الصحيح لصورة السيارة
              alt="Delivery Cars"
              width={800} // عرض الصورة الطبيعي
              height={800} // ارتفاع الصورة الطبيعي
              className="w-full h-auto object-contain" // لجعل الصورة تتناسب مع الحاوية دون قصها
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
