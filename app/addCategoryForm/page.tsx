"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { Separator } from "@/app/components/ui/separator";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/utils/store";

type CategoryData = {
  id: string;
  title: string;
  desc: string;
  slug: string;
  img: string; // الصورة المحفوظة سابقًا
};

// Schema for validation
const categorySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Başlık gereklidir (en az 3 karakter olmalıdır)" }),
  desc: z
    .string()
    .min(5, { message: "Açıklama gerekli (en az 5 karakter olmalıdır)" }),

  slug: z.string().min(3, { message: "الـ Slug مطلوب" }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AddCategoryForm = ({ categoryData }: { categoryData?: CategoryData }) => {
  const { isLoading, setLoading } = useLoadingStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // قم بتحديث حالة المعاينة عند تحميل الصفحة إذا كانت الصورة موجودة
  useEffect(() => {
    if (categoryData?.img) {
      setPreview(categoryData.img); // تعيين الصورة المحفوظة كمعاينة
    }
  }, [categoryData]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: categoryData?.title || "",
      desc: categoryData?.desc || "",
      slug: categoryData?.slug || "",
    },
  });

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = (target.files as FileList)[0];
    setFile(selectedFile);
    const filePreview = URL.createObjectURL(selectedFile);
    setPreview(filePreview); // تحديث المعاينة عند رفع صورة جديدة
  };

  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    data.append("upload_preset", "missciftlik");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmdupmxws/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const resData = await res.json();
    return resData.url;
  };

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      let imgUrl = categoryData?.img || "";

      if (file) {
        imgUrl = await upload();
      }

      const method = categoryData ? "PUT" : "POST";
      const url = categoryData
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${categoryData.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, img: imgUrl }),
      });

      if (res.ok) {
        toast.success(
          categoryData
            ? "Öğe başarıyla değiştirildi!"
            : "Öğe başarıyla eklendi!"
        );
        router.push("/menu");
      } else {
        toast.error("حدث خطأ أثناء العملية.");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ في الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content p-4 md:p-8 max-w-lg md:max-w-xl lg:max-w-3xl mx-auto">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {categoryData ? "Kategoriyi Düzenle" : "Yeni bir kategori ekle"}
        </h2>
        <Separator className="mb-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <label
                className="text-sm cursor-pointer flex gap-4 items-center"
                htmlFor="file"
              >
                <Image src="/upload.png" alt="" width={30} height={20} />
                <span>Resmi indirin</span>
              </label>
              <input
                type="file"
                onChange={handleChangeImg}
                id="file"
                className="hidden"
              />
              {preview && (
                <div className="mt-4">
                  <Image
                    src={preview}
                    alt="Uploaded Preview"
                    width={100}
                    height={100}
                    className="object-cover aspect-square rounded-md"
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adresi girin"
                      disabled={isLoading}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Açıklamayı girin"
                      disabled={isLoading}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل الـ Slug"
                      disabled={isLoading}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-2"
            >
              {categoryData ? "Değişiklikleri kaydet" : "Kategori ekle"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCategoryForm;
