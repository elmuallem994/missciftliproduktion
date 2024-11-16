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

      {/* القسم السفلي: صور الطريق والسيارات في نفس الصف */}
      <div className="w-full max-w-[400px] md:max-w-[1500px] mx-auto flex flex-row gap-4 mt-6">
        {/* صورة الطريق */}
        <div className="w-full md:w-1/2 overflow-hidden rounded-3xl">
          <Image
            src="/kap2.png" // تأكد من المسار الصحيح لصورة الطريق
            alt="Delivery Road"
            width={500} // عرض الصورة الطبيعي
            height={500} // ارتفاع الصورة الطبيعي
            className="w-full h-auto object-contain" // لجعل الصورة تتناسب مع الحاوية
          />
        </div>

        {/* صورة السيارات */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full h-auto md:h-auto md:scale-100 scale-110 p-2">
            <Image
              src="/Car.png" // تأكد من المسار الصحيح لصورة السيارة
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
