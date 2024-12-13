import Image from "next/image";

const Offer = () => {
  return (
    <div className="flex flex-col items-center w-full bg-primary-black ">
      {/* الصورة العلوية */}
      <div className="relative w-full h-[20vh] sm:h-[30vh] md:h-[40vh] lg:h-[50vh]">
        <Image
          src="/Kap1.jpg" // تأكد من مسار الصورة
          alt="Kapınıza Teslimat"
          fill
          objectFit="cover" // لضمان عرض متناسق
          priority
        />
      </div>

      {/* الصورة السفلية */}
      <div className="relative w-full">
        <Image
          src="/car.png" // تأكد من مسار الصورة
          alt="Delivery Cars"
          width={2000} // عرض الصورة
          height={1000} // ارتفاع الصورة
          className="object-cover" // لضمان تغطية الصورة بشكل كامل
        />
      </div>
    </div>
  );
};

export default Offer;
