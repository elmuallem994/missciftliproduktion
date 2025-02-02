// app/hakkimizda/page.tsx
import Image from "next/image";

const Hakkimizda = () => {
  return (
    <div className="main-content container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden shadow-lg">
        <Image
          src="/slide2.jpg"
          alt="Miss Çiftlik"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <h1 className="text-4xl font-extrabold text-orange-400 tracking-wide">
            Hakkımızda
          </h1>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-orange-100 p-6 rounded-xl shadow-md border border-orange-300">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-4">
          Biz Kimiz?
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg text-justify">
          <strong>Miss Çiftlik</strong> olarak, doğal ve taze süt ürünlerini
          sizlere sunmaktan gurur duyuyoruz. Çiftliğimizde hijyen ve kaliteye
          büyük önem veriyoruz. Misyonumuz, sağlıklı ve lezzetli ürünler üretmek
          ve müşterilerimize en iyi hizmeti sunmaktır.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-orange-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-orange-700 mb-2 text-left">
            Misyonumuz
          </h3>
          <p className="text-gray-800 text-justify">
            Sağlıklı, doğal ve taze süt ürünlerini en yüksek kaliteyle sunmak.
          </p>
        </div>
        <div className="bg-orange-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105">
          <h3 className="text-2xl font-semibold text-orange-700 mb-2 text-left">
            Vizyonumuz
          </h3>
          <p className="text-gray-800 text-justify">
            Türkiye’nin lider doğal süt ürünleri markası olmak.
          </p>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-red-50 p-6 rounded-xl shadow-md border border-gray-300 text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">
          İletişim Bilgilerimiz
        </h2>
        <div className="text-gray-700 text-lg leading-relaxed space-y-3">
          <p>
            <strong>Adres:</strong> Karlıtepe Mah. Camii Arkası Sk,
            Gaziosmanpaşa / İstanbul
          </p>
          <p>
            <strong>Telefon:</strong>
            <a
              href="tel:+905348228865"
              className="text-orange-500 hover:underline hover:text-orange-700 transition"
            >
              {" "}
              +90 534 822 88 65
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hakkimizda;
