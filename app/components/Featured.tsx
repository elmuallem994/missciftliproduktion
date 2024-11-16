import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const featuredProducts = [
  {
    id: 1,
    title: "İnek sütü",
    desc: "3 LT. Çiğ inek sütü Karışık 50% Jersey ve Simental",
    price: "115",
    img: "/cat33.png",
  },
  {
    id: 2,
    title: "gezen tavuk yumurtası ",
    desc: "15 adet serbest gezen tavuk yumurtası ",
    price: "80",
    img: "/cat22.png",
  },
  {
    id: 3,
    title: " İnek yoğurdu  ",
    desc: " 1 kg. Ev tipi inek yoğurdu ",
    price: "55",
    img: "/cat35.png",
  },
  {
    id: 4,
    title: "Acı Biber salçası ",
    desc: "1 kg. Hatay biber salçası Güneş kurutma",
    price: "150",
    img: "/cat49.png",
  },
  {
    id: 5,
    title: "manda sütü",
    desc: "1 kg. çiğ manda sütü ",
    price: "100",
    img: "/cat145.png",
  },
  {
    id: 6,
    title: "Zeytinyağı",
    desc: "1 litre Hatay'dan soğuk sıkım zeytinyağı ",
    price: "350",
    img: "/cat5.png",
  },
];

const Featured = () => {
  return (
    <div className="w-full text-orange-500 my-36">
      <h1
        className="glowing-text text-center text-4xl md:text-5xl lg:text-6xl text-white  pb-20"
        style={{ fontFamily: "AardvarkCafe, sans-serif" }}
      >
        Ürünler
      </h1>
      <div className="w-full flex justify-center items-center py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className="w-full h-full flex flex-col items-center justify-between p-2 md:p-4 border-2 border-orange-500 rounded-lg shadow-lg bg-dark-100"
            >
              <div className="relative w-full h-40 md:h-48 lg:h-64">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-2 md:mt-4">
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold">
                  {item.title}
                </h2>
                <p className="my-1 md:my-2 text-xs md:text-lg text-white pb-4">
                  {item.desc}
                </p>
                <div className="flex text-yellow-500 mb-2 bg-white rounded-md px-2 py-1">
                  {Array(5)
                    .fill("")
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-white font-bold">
                  {item.price} TL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center pt-16 md:mt-8">
        <Link href="/menu">
          <button className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300">
            Daha Fazlasını Göster
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Featured;
