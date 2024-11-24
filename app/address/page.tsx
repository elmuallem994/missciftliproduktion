"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/app/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import toast from "react-hot-toast";
import { useLoadingStore } from "@/utils/store";

// **تعريف نوع المنطقة والحي**
type Region = {
  id: number;
  name: string;
  neighborhoods: Neighborhood[];
};

type Neighborhood = {
  id: number;
  name: string;
};

// **تعريف نوع العنوان**
type SavedAddress = {
  regionName: string;
  neighborhoodName: string;
  il: string;
  adres: string;
};

// **تحديد القيم الافتراضية للتحقق**
const addressSchema = z.object({
  il: z.string().min(1, { message: "Lütfen şehri giriniz." }), // المدينة
  regionId: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "Lütfen bölgeyi seçiniz.",
    }), // المنطقة
  neighborhoodId: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "Lütfen mahalleyi seçiniz.",
    }), // الحي
  sokak: z.string().min(1, { message: "Lütfen sokağı giriniz." }), // الشارع
  bina: z.string().min(1, { message: "Lütfen bina numarasını giriniz." }), // رقم البناء
  daire: z.string().min(1, { message: "Lütfen daire numarasını giriniz." }), // رقم الشقة
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressPage: React.FC = () => {
  const { setLoading, isLoading } = useLoadingStore();
  const [regions, setRegions] = useState<Region[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [savedAddress, setSavedAddress] = useState<SavedAddress | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: "Istanbul", // تعيين القيمة الافتراضية
      regionId: null,
      neighborhoodId: null,
      sokak: "",
      bina: "",
      daire: "",
    },
  });

  // **جلب البيانات (المناطق + العنوان المحفوظ)**
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // جلب المناطق
        const regionsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`
        );
        const regionsData: Region[] = await regionsRes.json();
        setRegions(regionsData);

        // جلب العنوان المحفوظ
        const addressRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address`
        );
        if (addressRes.ok) {
          const savedData = await addressRes.json();
          if (savedData) {
            const [sokak, binaRaw, daireRaw] = savedData.adres.split(", ");
            const bina = binaRaw?.replace("Bina: ", "").trim() || "";
            const daire = daireRaw?.replace("Daire: ", "").trim() || "";

            setSavedAddress({
              il: savedData.il,
              regionName: savedData.regionName || "Bölge bulunamadı",
              neighborhoodName:
                savedData.neighborhoodName || "Mahalle bulunamadı",
              adres: savedData.adres,
            });

            // تحديث الحقول إذا لزم الأمر
            form.setValue("sokak", sokak || "");
            form.setValue("bina", bina);
            form.setValue("daire", daire);
          }
        } else {
          console.error("Failed to fetch saved address");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Veriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, form]);

  // **تحديث قائمة الأحياء عند تغيير المنطقة**
  const handleRegionChange = (regionId: number) => {
    const selectedRegion = regions.find((region) => region.id === regionId);
    if (selectedRegion) {
      setNeighborhoods(selectedRegion.neighborhoods);
      form.setValue("neighborhoodId", null, { shouldValidate: true });
    } else {
      setNeighborhoods([]);
      form.setValue("neighborhoodId", null, { shouldValidate: true });
    }
    form.setValue("regionId", regionId, { shouldValidate: true });
  };

  // **حفظ البيانات**
  const handleSubmit = async (data: AddressFormValues) => {
    try {
      setLoading(true);

      // دمج الحقول الإضافية في `adres`
      const fullAdres = `${data.sokak}, Bina: ${data.bina}, Daire: ${data.daire}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address`,
        {
          method: savedAddress ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            adres: fullAdres, // استخدام النص الكامل
          }),
        }
      );

      if (res.ok) {
        const region = regions.find((r) => r.id === data.regionId);
        const neighborhood = neighborhoods.find(
          (n) => n.id === data.neighborhoodId
        );

        setSavedAddress({
          regionName: region?.name || "Bölge bulunamadı",
          neighborhoodName: neighborhood?.name || "Mahalle bulunamadı",
          il: data.il,
          adres: fullAdres,
        });

        toast.success(
          savedAddress
            ? "Adres başarıyla güncellendi!"
            : "Adres başarıyla kaydedildi!"
        );
        form.reset();
        setNeighborhoods([]);
        setIsDialogOpen(false); // إغلاق النافذة
      } else {
        toast.error("Adres kaydedilemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // **تحميل البيانات المحفوظة عند التعديل**
  const handleEdit = () => {
    if (savedAddress) {
      const [sokak, binaRaw, daireRaw] = savedAddress.adres.split(", ");
      const bina = binaRaw?.replace("Bina: ", "").trim() || "";
      const daire = daireRaw?.replace("Daire: ", "").trim() || "";

      form.setValue("il", savedAddress.il);
      form.setValue("sokak", sokak || "");
      form.setValue("bina", bina);
      form.setValue("daire", daire);

      const region = regions.find((r) => r.name === savedAddress.regionName);
      if (region) {
        form.setValue("regionId", region.id);
        handleRegionChange(region.id);
      }
      const neighborhood = region?.neighborhoods.find(
        (n) => n.name === savedAddress.neighborhoodName
      );
      if (neighborhood) {
        form.setValue("neighborhoodId", neighborhood.id);
      }
    }
  };

  return (
    <div className=" flex items-center justify-center min-h-screen p-6 bg-gray-900">
      <div className="p-6 w-full max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
        <h1
          className="text-4xl font-bold text-center text-orange-300 mb-6"
          style={{ fontFamily: "AardvarkCafe, sans-serif" }}
        >
          Teslimat Adresi
        </h1>

        {savedAddress ? (
          <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 via-orange-50 to-orange-50 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-orange-500 mb-4 text-center">
              Kaydedilen Adres
            </h3>
            <ul className="space-y-5">
              <li className="text-lg">
                <strong className="text-orange-400 text-xl font-bold">
                  Şehir:
                </strong>{" "}
                <span className="text-gray-500 text-lg font-bold">
                  {savedAddress.il}
                </span>
              </li>
              <li className="text-lg flex justify-between">
                <div>
                  <strong className="text-orange-400 text-xl font-bold">
                    Bölge:
                  </strong>{" "}
                  <span className="text-gray-500 text-lg font-bold">
                    {savedAddress.regionName}
                  </span>
                </div>
                <div>
                  <strong className="text-orange-400 text-xl font-bold">
                    Mahalle:
                  </strong>{" "}
                  <span className="text-gray-500 text-lg font-bold">
                    {savedAddress.neighborhoodName}
                  </span>
                </div>
              </li>
              <li className="text-lg">
                <strong className="text-orange-400 text-xl font-bold">
                  Detaylı Adres:
                </strong>{" "}
                <span className="text-gray-500 text-lg font-bold">
                  {savedAddress.adres}
                </span>
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">Henüz kayıtlı bir adres yok.</p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="mt-6 bg-orange-400 hover:bg-orange-500"
              onClick={() => {
                if (savedAddress) handleEdit();
                setIsDialogOpen(true);
              }}
            >
              {savedAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm md:max-w-lg lg:max-w-xl bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-orange-300 font-bold">
                {savedAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="il"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şehir</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value="istanbul" // تحديد القيمة الثابتة
                          disabled
                          className="bg-gray-200 cursor-not-allowed" // لإظهار أن الحقل غير قابل للتعديل
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="regionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bölge Seçiniz</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            handleRegionChange(Number(e.target.value))
                          }
                          className="border p-2 w-full"
                        >
                          <option value="">Bölge Seçiniz</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhoodId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mahalle Seçiniz</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            form.setValue(
                              "neighborhoodId",
                              Number(e.target.value),
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                          className="border p-2 w-full"
                        >
                          <option value="">Mahalle Seçiniz</option>
                          {neighborhoods.map((neighborhood) => (
                            <option
                              key={neighborhood.id}
                              value={neighborhood.id}
                            >
                              {neighborhood.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sokak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sokak</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örnek: Mahalle Sokak" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bina"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bina</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örnek: 12" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daire</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Örnek: 3" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AddressPage;
