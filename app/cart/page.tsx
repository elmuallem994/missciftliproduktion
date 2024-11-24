"use client";

import { useEffect, useState } from "react";
import { useCartStore, useLoadingStore, useOrderStore } from "@/utils/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/app/components/ui/alert-dialog";
import { format, addDays, getDay } from "date-fns";
import { tr } from "date-fns/locale";
import LoadingSpinner from "@/app/components/ui/loadingSpinner";
import { Pencil } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "../components/ui/button";

import { sendOrderToWhatsApp } from "@/utils/sendToWhatsApp";
import Price from "../components/Price";

const CartPage = () => {
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientPhone, setRecipientPhone] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deliveryDays, setDeliveryDays] = useState<number[]>([]);
  const [neighborhoodName, setNeighborhoodName] = useState<string | null>(null);

  const [deliveryDates, setDeliveryDates] = useState<Date[]>([]);
  const [regionName, setRegionName] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { products, totalItems, totalPrice } = useCartStore();

  const addOrderId = useOrderStore((state) => state.addOrderId);

  const { isSignedIn, user } = useUser();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  // دالة لحساب نفس اليوم من الأسبوع القادم
  const getNextWeekSameDay = (dayNumber: number): Date => {
    const today = new Date();
    const todayDay = getDay(today);
    const dayDifference = (dayNumber + 7 - todayDay) % 7;
    return addDays(today, dayDifference + 7); // نضيف 7 للحصول على نفس اليوم الأسبوع القادم
  };

  const calculateDeliveryDates = (days: number[]): Date[] => {
    const today = new Date();
    const todayDay = getDay(today);

    // حساب التواريخ للأسبوع الحالي بناءً على الأيام المحددة فقط
    const currentWeekDates = days.map((day) => {
      const dayDifference = (day + 7 - todayDay) % 7;
      return addDays(today, dayDifference);
    });

    // إضافة نفس اليوم للأسبوع القادم فقط إذا كان اليوم الحالي موجودًا في لوحة التحكم
    const nextWeekDates = days.includes(todayDay) ? [addDays(today, 7)] : [];

    // دمج التواريخ الحالية مع تواريخ الأسبوع القادم
    const allDates = [...currentWeekDates, ...nextWeekDates];

    // ترتيب التواريخ
    return allDates.sort((a, b) => a.getTime() - b.getTime());
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        console.log("Selected day before checkout:", selectedDay); // تسجيل اليوم المحدد

        if (!selectedDay || !recipientName || !recipientPhone) {
          setErrorMessage("Lütfen tüm zorunlu alanları doldurun.");
          setLoading(false);
          return;
        }

        const regionData = await fetchRegionId();

        if (!regionData) {
          throw new Error("Bölge kimliği eksik.");
        }

        // استخراج الحقول من regionData
        const {
          regionId,
          startTime,
          endTime,
          regionName,
          neighborhoodName,
          fullAddress, // لا حاجة لـ deliveryDays
        } = regionData;

        const addressResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/${user?.id}`
        );
        const addressData = await addressResponse.json();
        const addressId = addressData?.addressId;

        if (!addressId) {
          throw new Error("Address ID is missing.");
        }

        const recipientInfo = `${recipientName}\n${recipientPhone}`;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userData: {
                id: user.id,
              },
              orderData: {
                price: totalPrice,
                products: products.map((product) => ({
                  id: product.id,
                  title: product.title,
                  desc: product.desc,
                  img: product.img,
                  quantity: product.quantity,
                  price: product.price,
                })),
                status: "Alındı",
                deliveryDay: `${format(selectedDay, "EEEE")} - ${format(
                  selectedDay,
                  "yyyy-MM-dd"
                )}`,
                regionId: regionId,
                addressId: addressId,
                recipientInfo: recipientInfo,
                startTime: startTime,
                endTime: endTime,
                fullAddress: fullAddress,
                regionName: regionName,
                neighborhoodName: neighborhoodName, // إضافة اسم الحي
              },
            }),
          }
        );

        const responseData = await res.json();
        if (res.ok) {
          const orderId = responseData.orderId;

          // استخراج تاريخ الطلب
          const orderDate = new Date();

          // إرسال الطلب إلى WhatsApp
          sendOrderToWhatsApp(
            products,
            recipientInfo,
            totalPrice,
            selectedDay,
            regionName,
            neighborhoodName,
            startTime,
            endTime,
            orderDate, // تاريخ الطلب
            orderId,
            fullAddress // العنوان الكامل
          );

          useCartStore.getState().clearCart();
          addOrderId(orderId);

          return orderId;
        } else {
          console.error("Error occurred during checkout:", responseData);
        }
      } catch (err) {
        console.error("Something went wrong during the checkout process:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchRegionId = async () => {
    try {
      setLoading(true);

      // جلب بيانات العنوان
      const addressResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address/${user?.id}`
      );

      if (!addressResponse.ok) {
        throw new Error("Kullanıcı adresi alınamadı");
      }

      const addressData = await addressResponse.json();
      console.log("Address Data:", addressData); // إضافة تسجيل البيانات

      if (!addressData.regionId) {
        throw new Error("Adres bilgisi eksik");
      }

      // جلب بيانات المنطقة مع الأحياء
      const regionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions/${addressData.regionId}`
      );

      if (!regionResponse.ok) {
        throw new Error("Bölge bilgisi alınamadı");
      }

      const regionData = await regionResponse.json();
      console.log("Region Data:", regionData); // إضافة تسجيل البيانات

      // افتراض وجود حي واحد مرتبط بالعنوان
      const currentNeighborhood = regionData.neighborhoods.find(
        (n) => n.id === addressData.neighborhoodId
      );
      console.log(deliveryDays);

      setRegionName(regionData.name); // اسم المنطقة
      setNeighborhoodName(currentNeighborhood?.name || ""); // اسم الحي
      setStartTime(currentNeighborhood?.startTime || ""); // وقت البدء
      setEndTime(currentNeighborhood?.endTime || ""); // وقت النهاية
      setFullAddress(`${addressData.il}, ${addressData.adres}`); // العنوان الكامل
      setDeliveryDays(currentNeighborhood?.deliveryDays || []); // الأيام المتاحة للتسليم

      return {
        regionId: addressData.regionId, // إضافة regionId هنا
        fullAddress: `${addressData.il}, ${addressData.adres}`,
        regionName: regionData.name,
        neighborhoodName: currentNeighborhood?.name,
        startTime: currentNeighborhood?.startTime,
        endTime: currentNeighborhood?.endTime,
        deliveryDays: currentNeighborhood?.deliveryDays, // إرسال الأيام المتاحة
      };
    } catch (error) {
      console.error("Error fetching region and address data:", error);
      setError("Bir hata oluştu");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryDays = async () => {
    if (!isSignedIn) {
      setMessage("Devam etmek için lütfen giriş yapın.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
      return;
    }

    try {
      setLoading(true);

      const addressData = await fetchRegionId();
      if (!addressData) {
        setMessage("Adres bilgisi eksik. Lütfen adres ekleyin.");
        // إذا لم يتم العثور على العنوان، تحويل المستخدم إلى صفحة العنوان
        setTimeout(() => {
          router.push("/address");
        }, 800);

        return;
      }

      const {
        fullAddress,
        regionName,
        neighborhoodName,
        startTime,
        endTime,
        deliveryDays, // إضافة `deliveryDays` من البيانات المسترجعة
      } = addressData;

      setFullAddress(fullAddress);
      setRegionName(regionName);
      setNeighborhoodName(neighborhoodName);
      setStartTime(startTime);
      setEndTime(endTime);

      if (deliveryDays && deliveryDays.length > 0) {
        // استدعاء الدالة لحساب التواريخ
        const calculatedDates = calculateDeliveryDates(deliveryDays);
        setDeliveryDates(calculatedDates); // تخزين النتائج في `deliveryDates`
      } else {
        setDeliveryDates([]); // إذا لم تكن هناك أيام متاحة، يتم تعيينها كقائمة فارغة
      }
    } catch (error) {
      console.log(error);
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main-content flex flex-col lg:flex-row text-orange-500 bg-gray-100">
      {message && (
        <div className=" fixed top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-red-500 text-white text-center p-8 z-50 rounded-md shadow-lg">
          {message}
        </div>
      )}

      {/* قسم المنتجات */}

      <div className="w-full lg:w-2/3 p-6 bg-gray-900 shadow-md lg:shadow-none border border-gray-700 ">
        <h1 className="block sm:hidden  glowing-text text-center text-3xl   pb-4 text-white font-bold mb-12">
          Sepetim
        </h1>
        {products.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4 px-0 md:px-10"
          >
            {item.img && (
              <Image
                src={item.img}
                alt=""
                width={80}
                height={80}
                className="rounded-md"
              />
            )}
            <div className="flex-1 px-4 text-gray-300 space-y-1">
              <h1 className="uppercase text-lg font-bold text-orange-400">
                {item.title}
              </h1>
              <p className="text-gray-200 text-[13px] md:text-sm max-w-[150px]  md:max-w-60">
                {item.desc}
              </p>
              <p className="text-lg font-semibold text-orange-300">
                {item.price} TL
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Price product={item} />
            </div>
          </div>
        ))}
      </div>

      {/* قسم ملخص السلة */}
      <div className="w-full lg:w-1/3 p-6 bg-gray-800 flex flex-col gap-6 shadow-md mt-4 md:mt-0 lg:ml-4 text-xl">
        <div className="text-2xl font-semibold text-orange-400 mb-4">
          Sipariş Özeti
        </div>

        <div className="flex justify-between items-center border-b border-gray-700 pb-4 text-gray-200">
          <span>Ara toplam ({totalItems} öğeler)</span>
          <span className="font-bold text-lg text-green-500">
            {totalPrice} TL
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-700 pb-4 text-gray-200">
          <span>Teslimat Ücreti</span>
          <span className="text-green-500 font-semibold text-xl">Ücretsiz</span>
        </div>

        <div className="flex justify-between items-center text-xl font-bold text-gray-200">
          <span>TOPLAM </span>
          <span className=" text-xl font-bold text-green-500">
            {totalPrice} TL
          </span>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              onClick={() => {
                if (products.length === 0) {
                  setMessage("Lütfen sipariş vermeden önce ürün ekleyin."); // رسالة الخطأ
                  setTimeout(() => setMessage(null), 3000); // إخفاء الرسالة بعد 3 ثوانٍ
                  return;
                }
                fetchDeliveryDays(); // استدعاء الدالة إذا كانت السلة تحتوي على منتجات
              }}
              className="bg-orange-500 text-white py-3 rounded-md w-full text-center font-semibold hover:bg-orange-600 transition duration-300"
            >
              DEVAM ET
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="w-full max-w-[400px] md:max-w-[600px] transform scale-90 sm:scale-100 overflow-y-auto max-h-[80vh]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-orange-300 font-bold text-3xl pb-7">
                {" "}
                Teslimat gününü seçin{" "}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 mt-4">
                {regionName && (
                  <p className="text-xl font-semibold text-red-400">
                    Bölge: {regionName}
                  </p>
                )}
                {neighborhoodName && (
                  <p className="text-xl font-semibold text-blue-400">
                    Mahalle: {neighborhoodName}
                  </p>
                )}
                {startTime && endTime && (
                  <p className="text-sm text-green-600 font-bold">
                    Teslimat Süresi: {startTime} - {endTime}
                  </p>
                )}
                {fullAddress ? (
                  <div className="flex items-start justify-between space-y-2">
                    <p className="text-gray-800  rounded-lg p-4 shadow-md bg-orange-100 leading-relaxed">
                      {fullAddress}
                    </p>

                    <button
                      className="bg-orange-400 p-1 rounded-md ml-4 hover:bg-gray-300 transition-colors"
                      onClick={() => router.push("/address")}
                    >
                      <Pencil className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <p className="text-red-500">
                    Adres: Tam adresiniz bulunamadı
                  </p>
                )}

                <div className="space-y-3 text-left">
                  {" "}
                  {/* إضافة text-left هنا */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Alıcının adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-lg w-[82%] p-2 sm:w-[65%]" // استخدم sm:w-[65%] للشاشات الكبيرة
                      placeholder="Alıcının adını girin"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Alıcının telefon numarası{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      country={"tr"}
                      value={recipientPhone}
                      onChange={(phone) => setRecipientPhone(phone)}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: true,
                      }}
                      containerClass="w-full"
                      inputClass="border border-gray-300 rounded-lg w-full p-2"
                      buttonClass="bg-transparent"
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-500">{errorMessage}</p>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <p className="text-sm text-green-600 pt-3 ">
              Teslimat için uygun olan günlerden uygun bir gün seçin.
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <LoadingSpinner />
              </div>
            ) : deliveryDates.length > 0 ? (
              <div>
                {deliveryDates.map((date, index) => {
                  const today = new Date();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  const nextWeekSameDay = getNextWeekSameDay(getDay(today));
                  const isNextWeek =
                    date.getDate() === nextWeekSameDay.getDate() &&
                    date.getMonth() === nextWeekSameDay.getMonth() &&
                    date.getFullYear() === nextWeekSameDay.getFullYear();

                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 my-4 ${
                        isToday ? "bg-red-100 text-red-600" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id={`day-${index}`}
                        name="deliveryDay"
                        value={date.getTime()}
                        checked={selectedDay?.getTime() === date.getTime()}
                        onChange={() => {
                          if (!isToday) {
                            setSelectedDay(date);
                            setError(null);
                          } else {
                            setError(
                              "Geçerli günü teslimat tarihi olarak ayarlayamazsınız."
                            );
                          }
                        }}
                        disabled={isToday}
                      />
                      <label
                        htmlFor={`day-${index}`}
                        className="flex items-center gap-2"
                      >
                        {format(date, "EEEE - d MMMM yyyy", { locale: tr })}
                        {isToday && (
                          <span className="text-sm text-red-600 font-bold">
                            Bugün (Kapalı - Aynı gün sipariş verilemez)
                          </span>
                        )}
                        {isNextWeek && (
                          <span className="text-sm text-green-500 font-bold">
                            (Açık - Haftaya sipariş verebilirsiniz)
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p> Uygun gün bulunamadı</p>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex  justify-end gap-2 mt-4">
              <AlertDialogCancel>iptal</AlertDialogCancel>
              <Button
                onClick={async () => {
                  // تحقق من تعبئة الحقول
                  if (!selectedDay || !recipientName || !recipientPhone) {
                    setErrorMessage("Lütfen tüm zorunlu alanları doldurun.");
                    return; // لا تغلق النافذة إذا كانت الحقول غير مكتملة
                  }

                  setErrorMessage(""); // مسح رسالة الخطأ

                  // تعطيل الزر أثناء الإرسال
                  setIsSubmitting(true);

                  try {
                    const orderId = await handleCheckout(); // تنفيذ عملية الدفع والحصول على orderId

                    if (orderId) {
                      router.push(`/order-details/${orderId}`); // توجيه المستخدم إلى صفحة تفاصيل الطلب باستخدام orderId
                    }
                  } catch (error) {
                    console.error("Error during checkout:", error);
                    setIsSubmitting(false); // في حال حدوث خطأ، إعادة تمكين الزر
                  }
                }}
                className={`bg-orange-500 text-white p-2 rounded-md mt-2 md:mt-0 ${
                  !selectedDay || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!selectedDay || isSubmitting} // تعطيل الزر أثناء الإرسال
              >
                {isSubmitting ? "İşleniyor..." : "Sipariş Onayla"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CartPage;
