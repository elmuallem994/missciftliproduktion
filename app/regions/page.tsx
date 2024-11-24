"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLoadingStore } from "@/utils/store";

type RegionType = {
  id: number;
  name: string;
  neighborhoods: NeighborhoodType[];
};

type NeighborhoodType = {
  id: number;
  name: string;
  deliveryDays: number[];
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
};

const allDays = [1, 2, 3, 4, 5, 6, 0];

const ManageLocations = () => {
  const [regions, setRegions] = useState<RegionType[]>([]);
  const [regionName, setRegionName] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [neighborhoodName, setNeighborhoodName] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [editingRegion, setEditingRegion] = useState<RegionType | null>(null);
  const [editingNeighborhood, setEditingNeighborhood] =
    useState<NeighborhoodType | null>(null);

  const setLoading = useLoadingStore((state) => state.setLoading);

  // Fetch regions function

  // Fetch regions on component mount

  const fetchRegions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch regions");
      }
      const data = await response.json();
      setRegions(data);
    } catch {
      toast.error("Failed to load regions");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setRegions]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Add a new region
  const handleAddRegion = async () => {
    if (!regionName) {
      toast.error("يرجى إدخال اسم المنطقة");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: regionName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add region");
      }
      const savedRegion = await response.json();
      setRegions((prevRegions) => [...prevRegions, savedRegion]);
      setRegionName("");
      toast.success("تمت إضافة المنطقة بنجاح");
    } catch {
      toast.error("فشل في إضافة المنطقة");
    } finally {
      setLoading(false);
    }
  };

  // Add a new neighborhood
  const handleAddNeighborhood = async () => {
    if (
      !selectedRegionId ||
      !neighborhoodName ||
      selectedDays.length === 0 ||
      !startTime ||
      !endTime
    ) {
      toast.error("يرجى ملء جميع الحقول لإضافة حي");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/neighborhoods`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regionId: selectedRegionId,
            name: neighborhoodName,
            deliveryDays: selectedDays,
            startTime,
            endTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add neighborhood");
      }

      await fetchRegions(); // Reload regions

      setNeighborhoodName("");
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
      toast.success("تمت إضافة الحي بنجاح");
    } catch {
      toast.error("فشل في إضافة الحي");
    } finally {
      setLoading(false);
    }
  };

  // Delete a neighborhood
  const handleDeleteNeighborhood = async (neighborhoodId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/neighborhoods/${neighborhoodId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete neighborhood");
      }

      await fetchRegions();

      toast.success("تم حذف الحي بنجاح");
    } catch {
      toast.error("فشل في حذف الحي");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegion = async (regionId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions/${regionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete region");
      }

      await fetchRegions(); // تحديث قائمة المناطق بعد الحذف

      toast.success("تم حذف المنطقة بنجاح");
    } catch (error) {
      toast.error("فشل في حذف المنطقة");
      console.error("Error deleting region:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update region
  const handleUpdateRegion = async () => {
    if (!editingRegion) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions/${editingRegion.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: regionName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update region");
      }

      await fetchRegions();
      setEditingRegion(null);
      setRegionName("");
      toast.success("تم تعديل المنطقة بنجاح");
    } catch {
      toast.error("فشل تعديل المنطقة");
    } finally {
      setLoading(false);
    }
  };

  // Update neighborhood
  const handleUpdateNeighborhood = async () => {
    if (!editingNeighborhood) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/neighborhoods/${editingNeighborhood.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: neighborhoodName,
            deliveryDays: selectedDays,
            startTime,
            endTime,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update neighborhood");
      }

      await fetchRegions();
      setEditingNeighborhood(null);
      setNeighborhoodName("");
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
      toast.success("تم تعديل الحي بنجاح");
    } catch {
      toast.error("فشل تعديل الحي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md max-w-full lg:max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-500">إدارة المناطق</h1>
        <Separator className="my-4" />

        {/* Add Region Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">إضافة منطقة جديدة</h2>
          <Input
            placeholder="اسم المنطقة"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={editingRegion ? handleUpdateRegion : handleAddRegion}
          >
            {editingRegion ? "تعديل" : "إضافة"}
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Add Neighborhood Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editingNeighborhood ? "تعديل الحي" : "إضافة حي جديد"}
          </h2>
          <select
            onChange={(e) => setSelectedRegionId(Number(e.target.value))}
            value={selectedRegionId || ""}
            className="mb-4 w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">اختر منطقة</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="اسم الحي"
            value={neighborhoodName}
            onChange={(e) => setNeighborhoodName(e.target.value)}
            className="mb-4"
          />
          <div className="flex flex-wrap gap-4 mb-4">
            {allDays.map((dayNumber) => (
              <label key={dayNumber} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(dayNumber)}
                  onChange={(e) =>
                    setSelectedDays((prevDays) =>
                      e.target.checked
                        ? [...prevDays, dayNumber]
                        : prevDays.filter((d) => d !== dayNumber)
                    )
                  }
                />
                {dayNamesMap["ar"][dayNumber]}
              </label>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <Button
            onClick={
              editingNeighborhood
                ? handleUpdateNeighborhood
                : handleAddNeighborhood
            }
          >
            {editingNeighborhood ? "تعديل" : "إضافة"}
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Regions and Neighborhoods Table */}
        <div>
          <h2 className="text-lg font-semibold mb-2">المناطق والأحياء</h2>
          {regions.map((region) => (
            <div key={region.id} className="mb-6">
              <h3 className="text-lg font-bold mb-2 text-orange-500">
                {region.name}
              </h3>

              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setEditingRegion(region);
                  setRegionName(region.name);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-700 pl-4"
                onClick={() => handleDeleteRegion(region.id)}
              >
                <FaTrash />
              </button>

              {region.neighborhoods.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 text-xs sm:text-sm lg:text-base">
                    <thead>
                      <tr>
                        <th className="border p-2">اسم الحي</th>
                        <th className="border p-2">أيام التوصيل</th>
                        <th className="border p-2">وقت البدء</th>
                        <th className="border p-2">وقت النهاية</th>
                        <th className="border p-2">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {region.neighborhoods.map((neighborhood) => (
                        <tr key={neighborhood.id}>
                          <td className="border p-2">{neighborhood.name}</td>
                          <td className="border p-2">
                            {neighborhood.deliveryDays &&
                            neighborhood.deliveryDays.length > 0
                              ? neighborhood.deliveryDays
                                  .map((day) => dayNamesMap["ar"][day])
                                  .join(", ")
                              : "لا توجد أيام توصيل"}
                          </td>
                          <td className="border p-2">
                            {neighborhood.startTime}
                          </td>
                          <td className="border p-2">{neighborhood.endTime}</td>
                          <td className="border p-2 text-center">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setEditingNeighborhood(neighborhood);
                                setNeighborhoodName(neighborhood.name);
                                setSelectedDays(neighborhood.deliveryDays);
                                setStartTime(neighborhood.startTime);
                                setEndTime(neighborhood.endTime);
                              }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-500 pl-6"
                              onClick={() =>
                                handleDeleteNeighborhood(
                                  String(neighborhood.id)
                                )
                              } // تحويل المعرف إلى نص
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">لا توجد أحياء</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageLocations;
