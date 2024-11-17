"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@/app/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Pencil, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useLoadingStore } from "@/utils/store";

// Define the Region type
type Region = {
  id: number;
  name: string;
  neighborhoods: string;
};

// Zod schema for form validation
const addressSchema = z.object({
  il: z.string().min(1, { message: "Lütfen şehir adını giriniz." }),
  adres: z.string().min(1, { message: "Lütfen tam adresi giriniz." }),
  regionId: z.number().min(1, { message: "Lütfen bölgeyi seçiniz." }),
  bina: z
    .string()
    .min(1, { message: "Lütfen bina adını veya numarasını giriniz." }),
  kat: z.string().min(1, { message: "Lütfen kat numarasını giriniz." }),
  daire: z.string().min(1, { message: "Lütfen daire numarasını giriniz." }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressPage: React.FC = () => {
  const { setLoading, isLoading } = useLoadingStore();
  const [regions, setRegions] = useState<Region[]>([]); // Array of regions
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressFormValues | null>(null);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: address?.il || "Istanbul",
      adres: address?.adres || "",
      regionId: address?.regionId || undefined,
      bina: address?.bina || "", // القيمة الافتراضية لحقل Bina
      kat: address?.kat || "", // القيمة الافتراضية لحقل Kat
      daire: address?.daire || "", // القيمة الافتراضية لحقل Daire
    },
  });

  // Fetch regions and address when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/regions`
        );
        const data: Region[] = await res.json();

        // لا نقوم بفلترة أو دمج الأسماء، نعرض كل شيء كما هو من قاعدة البيانات
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    const fetchAddress = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address`
        );
        if (res.ok) {
          const data: AddressFormValues[] = await res.json();
          if (data.length > 0) {
            // استخراج القيم من النصوص
            const fullAddress = data[0].adres;
            const match = fullAddress.match(
              /Bina: (.*?), Kat: (.*?), Daire: (.*?), (.*)/
            );
            if (match) {
              setAddress({
                il: data[0].il,
                regionId: data[0].regionId,
                bina: match[1]?.trim() || "", // وضع القيمة في الحقل الخاص بها
                kat: match[2]?.trim() || "",
                daire: match[3]?.trim() || "",
                adres: match[4]?.trim() || "",
              });
              form.reset({
                il: data[0].il,
                regionId: data[0].regionId,
                bina: match[1]?.trim() || "",
                kat: match[2]?.trim() || "",
                daire: match[3]?.trim() || "",
                adres: match[4]?.trim() || "",
              });
            }
          } else {
            setIsEditModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchRegions();
    fetchAddress();
  }, [form, setLoading]);

  // Handle form submission for creating a new address
  const createAddress = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (res.ok) {
          setAddress(data);
          toast.success("تم إنشاء العنوان بنجاح");
          setIsEditModalOpen(false);
          router.refresh();
        } else {
          toast.error("حدث خطأ أثناء إنشاء العنوان");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submission for updating the address
  const updateAddress = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        data.adres = data.adres.trim().replace(/,+/g, ","); // تنظيف النص قبل الإرسال
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/address`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );

        if (res.ok) {
          setAddress(data);
          toast.success("تم تحديث العنوان بنجاح");
          setIsEditModalOpen(false);
        } else {
          toast.error("حدث خطأ أثناء تحديث العنوان");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  // Determine the correct submit handler based on whether an address exists
  const onSubmit = (data: AddressFormValues) => {
    // دمج القيم مع النصوص التوضيحية
    const fullAddress = `Bina: ${data.bina || ""}, Kat: ${
      data.kat || ""
    }, Daire: ${data.daire || ""}, ${data.adres || ""}`
      .trim()
      .replace(/,+/g, ",");

    const updatedData = {
      ...data,
      bina: data.bina,
      kat: data.kat,
      daire: data.daire,
      adres: fullAddress, // تحديث حقل Tam Adres (Full) مع النصوص
    };

    if (address) {
      updateAddress(updatedData); // التحديث إذا كان العنوان موجودًا مسبقًا
    } else {
      createAddress(updatedData); // الإضافة إذا كان العنوان جديدًا
    }
  };

  return (
    <div className="p-3 md:p-16 main-content ">
      <div className="flex flex-col justify-center items-center gap-3 ">
        <h2
          className="glowing-text text-4xl md:text-5xl lg:text-6xl text-white pb-5"
          style={{ fontFamily: "AardvarkCafe, sans-serif" }}
        >
          Teslimat adresi
        </h2>
        <p className="text-base text-muted-foreground text-white text-center">
          Burada teslimat adresinizi ekleyebilir ve değiştirebilirsiniz
        </p>
      </div>

      {address && (
        <div className="flex justify-center items-center pt-10">
          <div className="p-6 max-w-3xl w-full mx-auto bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl border border-gray-200">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full shadow-md">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-3xl font-extrabold text-green-400 ml-4">
                  Adresim
                </h3>
              </div>
              <div>
                <Button
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={isLoading}
                >
                  <Pencil className="w-5 h-5" />
                  <span className="text-sm font-medium">Düzenle</span>
                </Button>
              </div>
            </div>

            {/* Adres Detayları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-orange-300">
                  Şehir:
                </span>
                <p className="text-lg font-semibold text-gray-700">
                  {address.il}
                </p>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-orange-300">
                  Mahalle:
                </span>
                <p className="text-lg font-semibold text-gray-700">
                  {regions.find((region) => region.id === address.regionId)
                    ? `${
                        regions.find((region) => region.id === address.regionId)
                          ?.name
                      } - ${
                        regions.find((region) => region.id === address.regionId)
                          ?.neighborhoods
                      }`
                    : "Mevcut değil"}
                </p>
              </div>

              <div className="col-span-2 flex flex-col">
                <span className="text-2xl font-bold text-orange-300">
                  Tam Adres:
                </span>
                <p className="text-lg font-semibold text-gray-700">
                  {address.adres}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Dialogu */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="min-h-[50vh] bg-white shadow-xl rounded-2xl p-4 sm:p-8 w-full max-w-md sm:max-w-lg mx-auto overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {address ? "Adresi Düzenle" : "Yeni Adres Ekle"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {address
                ? "Mevcut adres bilgilerini düzenleyin ve değişiklikleri kaydedin."
                : "Yeni adres bilgilerini girin ve kaydedin."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Form Alanları */}
              <FormField
                control={form.control}
                name="il"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Şehir</FormLabel>
                    <FormControl>
                      <Input
                        {...field} // alanı formda tutmak için spread operator
                        readOnly // düzenlemeyi engelle
                        autoFocus={false} // sayfa veya modal açıldığında otomatik odaklanmayı engelle
                        className=" bg-gray-100 text-gray-500"
                        style={{ pointerEvents: "none" }} // fare ile tıklamayı devre dışı bırak
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">
                      ilçe - mahalle
                    </FormLabel>
                    <FormControl>
                      <select
                        disabled={isLoading}
                        {...field}
                        className="p-2 border rounded w-full"
                        onChange={(e) => {
                          const selectedRegionId = Number(e.target.value); // değeri sayıya çevir
                          field.onChange(selectedRegionId); // formdaki bölge kimliğini güncelle
                        }}
                      >
                        <option value="">Bölge ve mahalleyi seçin</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name} - {region.neighborhoods}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adres"
                render={() => (
                  <FormItem>
                    {/* تقسيم الحقول */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* حقل Bina */}
                      <FormItem>
                        <FormLabel className="text-orange-400">Bina</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bina"
                            value={form.getValues("bina") || ""}
                            onChange={(e) => {
                              form.setValue("bina", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                            className="border border-gray-300 rounded-lg p-2"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      {/* حقل Kat */}
                      <FormItem>
                        <FormLabel className="text-orange-400">Kat</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kat"
                            value={form.getValues("kat") || ""}
                            onChange={(e) => {
                              form.setValue("kat", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                            className="border border-gray-300 rounded-lg p-2"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      {/* حقل Daire */}
                      <FormItem>
                        <FormLabel className="text-orange-400">Daire</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Daire"
                            value={form.getValues("daire") || ""}
                            onChange={(e) => {
                              form.setValue("daire", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                            className="border border-gray-300 rounded-lg p-2"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    {/* الحقل الطويل لعنوان النص الكامل */}
                    <FormItem>
                      <FormLabel className="text-orange-400">
                        Tam Adres
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tam Adres"
                          value={form.getValues("adres")} // يعرض القيمة الحالية
                          onChange={(e) => {
                            const fullAddress = e.target.value;
                            form.setValue(
                              "adres",
                              fullAddress.trim().replace(/,+/g, ","),
                              {
                                shouldValidate: true,
                              }
                            );
                          }}
                          className="border border-gray-300 rounded-lg p-2 w-full"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-4 mt-4">
                <Button
                  disabled={isLoading}
                  className="w-full text-md bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2"
                  type="submit"
                >
                  {address ? "Değişiklikleri Kaydet" : "Gönder"}
                </Button>

                <Separator />

                {/* رسالة بجانب الزر */}
                <div className="flex flex-col items-center">
                  <p className="text-sm text-red-600 text-center mt-2">
                    Eğer bölgeniz listede yoksa, lütfen WhatsApp üzerinden{" "}
                    <br /> bizimle iletişime geçin.
                  </p>

                  {/* زر واتساب */}
                  <Link
                    href="https://wa.me/905348228865"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4 mr-2" />
                    WhatsApp ile iletişime geç
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressPage;
