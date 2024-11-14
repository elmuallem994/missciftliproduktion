"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa"; // مكتبة الأيقونات
import { useLoadingStore } from "@/utils/store";
import TimePicker from "react-time-picker"; // استيراد TimePicker
import "react-time-picker/dist/TimePicker.css"; // تأكد من أنك قمت بإضافة هذا السطر لإضافة الأنماط الخاصة بالمكون

type EntryType = {
  id: number; // إضافة حقل 'id' هنا
  name: string;
  neighborhoods: string | null;
  deliveryDays: string[];
  startTime: string;
  endTime: string;
};

const dayNamesMap: { [key: string]: { [key: number]: string } } = {
  ar: {
    1: "الإثنين",
    2: "الثلاثاء",
    3: "الأربعاء",
    4: "الخميس",
    5: "الجمعة",
    6: "السبت",
    0: "الأحد",
  },
  en: {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
  },
};

const allDays = [1, 2, 3, 4, 5, 6, 0]; // الأرقام تمثل الأيام من الإثنين إلى الأحد

const ManageLocations = () => {
  const [region, setRegion] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<Array<string | number>>([]);

  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const [entries, setEntries] = useState<EntryType[]>([]);
  const [editingRegionId, setEditingRegionId] = useState<number | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  // Handle day selection
  const handleDayChange = (dayNumber: number, isChecked: boolean) => {
    setSelectedDays((prevDays) =>
      isChecked
        ? [...prevDays, dayNumber]
        : prevDays.filter((d) => d !== dayNumber)
    );
  };

  // Fetch existing entries from API on page load
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true); // تفعيل التحميل عند بدء الجلب
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("فشل جلب الإدخالات");
        }

        const data = await response.json();
        setEntries(data);
      } catch (error) {
        toast.error("فشل تحميل الإدخالات");
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false); // إيقاف التحميل عند الانتهاء
      }
    };

    fetchEntries();
  }, [setLoading]);

  // Handle adding new entry and saving it to API
  const handleAddEntry = async () => {
    if (
      region &&
      neighborhoods &&
      selectedDays.length > 0 &&
      startTime &&
      endTime
    ) {
      const newEntry = {
        name: region,
        deliveryDays: selectedDays, // لا تحتاج لتحويل JSON هنا
        neighborhoods: neighborhoods,
        startTime: startTime,
        endTime: endTime,
      };

      // إرسال البيانات إلى الخادم
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEntry),
        }
      );

      if (response.status === 409) {
        toast.error("المنطقة التي تحمل نفس الاسم والحي موجودة بالفعل.");
        return;
      }

      if (!response.ok) {
        toast.error("فشل حفظ الإدخال.");
        return;
      }

      // جلب البيانات المحدثة
      const savedEntry = await response.json();
      setEntries([...entries, savedEntry]);
      // إعادة تعيين المدخلات
      setRegion("");
      setNeighborhoods(null);
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
    } else {
      toast.error("برجاء ملء كافة الحقول واختيار أيام التسليم.");
    }
  };

  const handleEdit = (entry: EntryType & { id: number }) => {
    setEditingRegionId(entry.id); // Store the ID of the region being edited
    setRegion(entry.name);
    setNeighborhoods(entry.neighborhoods);
    setSelectedDays(entry.deliveryDays);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
  };

  // إرسال طلب التعديل
  const handleUpdateEntry = async (regionId: number) => {
    // Construct updated entry data
    const updatedEntry = {
      name: region,
      deliveryDays: selectedDays,
      neighborhoods: neighborhoods,
      startTime: startTime,
      endTime: endTime,
    };

    setLoading(true); // تفعيل التحميل عند بدء الإضافة

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions/${regionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEntry),
        }
      );

      if (!response.ok) {
        toast.error("فشل تحديث المنطقة.");
        return;
      }

      // Refresh entries with updated data
      const updatedData = await response.json();
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === regionId ? { ...entry, ...updatedData } : entry
        )
      );

      // Reset editing mode and clear the input fields
      setEditingRegionId(null);
      setRegion("");
      setNeighborhoods(null);
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
      toast.success("تم تحديث المنطقة بنجاح.");
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("حدث خطأ أثناء تحديث المنطقة.");
    } finally {
      setLoading(false); // إيقاف التحميل عند الانتهاء
    }
  };

  const handleDelete = async (regionId: number) => {
    setLoading(true); // تفعيل التحميل عند بدء الحذف
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions/${regionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("فشل حذف المنطقة.");
        return;
      }

      // تحديث الإدخالات بعد الحذف
      setEntries(entries.filter((entry) => entry.id !== regionId));
      toast.success("تم حذف المنطقة بنجاح.");
    } catch (error) {
      console.error("Error deleting region:", error);
      toast.error("حدث خطأ أثناء حذف المنطقة.");
    } finally {
      setLoading(false); // إيقاف التحميل عند الانتهاء
    }
  };

  return (
    <div className="main-content flex items-center justify-center p-4 sm:p-6 lg:p-8 ">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full md:w-2/3">
        <h1 className="text-xl text-orange-400 sm:text-2xl font-bold">
          إدارة المناطق
        </h1>
        <Separator className="my-4" />

        {/* Region Input */}
        <div className="flex flex-col gap-4 mb-4 w-full md:w-1/3">
          <Input
            placeholder="أدخل المنطقة"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Neighborhood Input */}
        <div className="flex flex-col gap-4 mb-4 w-full md:w-1/3">
          <Input
            placeholder="أدخل الحي"
            value={neighborhoods || ""}
            onChange={(e) => setNeighborhoods(e.target.value || null)}
            className="w-full"
          />
        </div>

        {/* Days of the Week Selection */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {allDays.map((dayNumber) => (
            <div key={dayNumber} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDays.includes(dayNumber)}
                onChange={(e) => handleDayChange(dayNumber, e.target.checked)}
                className="mr-1"
              />
              <label>{dayNamesMap["ar"][dayNumber]}</label>{" "}
              {/* استخدم "tr" للغة التركية */}
            </div>
          ))}
        </div>

        {/* Delivery Time Selection */}
        <div className="flex flex-col gap-4 mb-4">
          <label className="text-lg font-semibold">موعد التسليم:</label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <TimePicker
              onChange={setStartTime}
              value={startTime}
              disableClock
              locale="en-US"
              format="HH:mm" // تحديد تنسيق 24 ساعة
              clearIcon={null} // إخفاء أيقونة "X"
              className="text-lg p-2 border border-gray-300 rounded-md w-full sm:w-auto"
            />
            <span className="text-lg font-semibold">الى</span>
            <TimePicker
              onChange={setEndTime}
              value={endTime}
              disableClock
              locale="en-US"
              format="HH:mm" // تحديد تنسيق 24 ساعة
              clearIcon={null} // إخفاء أيقونة "X"
              className="text-lg p-2 border border-gray-300 rounded-md w-full sm:w-auto"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            if (editingRegionId) {
              handleUpdateEntry(editingRegionId);
            } else {
              handleAddEntry();
            }
          }}
          className="w-full sm:w-auto"
        >
          {editingRegionId ? "تحديث الإدخال" : "إضافة إدخال"}
        </Button>

        {/* عرض الإدخالات في جدول */}
        <div className="overflow-x-auto">
          <table className="min-w-full  border-collapse mt-4">
            <thead>
              <tr>
                <th className="border p-2">منطقة</th>
                <th className="border p-2">حيّ</th>
                <th className="border p-2">أيام التسليم</th>
                <th className="border p-2">وقت البدء</th>
                <th className="border p-2">وقت النهاية</th>
                <th className="border p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{entry.name}</td>
                  <td className="border p-2">
                    {entry.neighborhoods ? entry.neighborhoods : "جميع الأحياء"}
                  </td>
                  <td className="border p-2">
                    {entry.deliveryDays
                      .map((dayNumber) => dayNamesMap["ar"][Number(dayNumber)])
                      .join(", ")}
                  </td>

                  <td className="border p-2">{entry.startTime}</td>
                  <td className="border p-2">{entry.endTime}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleEdit(entry)}>
                      <FaEdit className="text-blue-600 " />
                    </button>
                    <button onClick={() => handleDelete(entry.id)}>
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLocations;
