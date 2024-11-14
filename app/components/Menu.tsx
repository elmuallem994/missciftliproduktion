"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import CartIcon from "./CartIcon";

import { Separator } from "./ui/separator";

const links = [
  { id: 1, title: "Anasayfa", url: "/" },
  { id: 2, title: "Hakkımızda", url: "/" },
  { id: 3, title: "Ürünler", url: "/menu" },
  { id: 4, title: "Çiftliğimiz", url: "/" },
];

const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="ml-auto  mr-4 p-2 bg-orange-400 rounded-2xl">
          <MenuIcon className="text-white  " />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-orange-50  flex flex-col items-center justify-center gap-8 max-w-sm p-6 box-border "
      >
        <div className="flex flex-col items-center gap-2">
          <SheetHeader>
            <SheetTitle className="text-center text-2xl tracking-wide leading-tight">
              القائمة
            </SheetTitle>
          </SheetHeader>
          <Separator />
        </div>

        <div className="flex flex-col gap-2 items-center text-lg w-full max-w-xs mx-auto">
          {links.map((item) => (
            <SheetClose asChild key={item.id}>
              <Link
                href={item.url}
                key={item.id}
                className="hover:underline text-white bg-orange-400 text-center rounded-2xl py-2 w-full"
                style={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                  margin: "0.5rem 0",
                }}
              >
                {item.title}
              </Link>
            </SheetClose>
          ))}
        </div>

        <div className="flex flex-col items-center gap-8 w-full max-w-xs mx-auto mt-12 z-50">
          <Link href="/cart">
            <CartIcon />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
