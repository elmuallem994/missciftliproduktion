"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  // التحقق مما إذا كانت الصفحة الحالية هي الصفحة الرئيسية
  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pb-8 px-4 ">
      {/* خط علوي */}
      <div className="w-[85%] h-[1px] bg-gray-500 mx-auto mb-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left space-y-5 md:space-y-0 md:space-x-10">
        {/* شعار المتجر */}
        <div className="md:flex-1">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-400 hover:text-orange-500 transition duration-300"
          >
            Miss çiftlik
          </Link>
        </div>

        {/* روابط الأقسام */}
        <div className="flex items-center justify-center">
          <ul className="flex items-center space-x-4 md:space-x-7 text-sm md:text-base">
            <li>
              <Link
                href="/about"
                className="hover:text-orange-500 transition duration-300"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-orange-500 transition duration-300"
              >
                Ekibimiz
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-orange-500 transition duration-300"
              >
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* العنوان */}
        <div className="md:flex-1 flex justify-center md:justify-end text-sm md:text-base text-gray-300">
          <p> karlıtepe mah, gaziosmanpaşa / istanbul, Türkiye</p>
        </div>
      </div>

      {/* نص الحقوق */}
      <div className="text-center text-xs text-gray-500 pt-4">
        © 2024 Miss çiftlik. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
