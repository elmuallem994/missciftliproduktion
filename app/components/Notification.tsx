"use client";

import { Clock, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Notification = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/905348228865", "_blank");
  };

  const openGoogleMaps = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=Karlitepe+Mah.+Camii+Arkası+Sk.+Can+Ap+No:3+İç+Kapı+No:4+Gaziosmanpaşa,+Istanbul",
      "_blank"
    );
  };

  return (
    <div className="h-auto bg-orange-400 text-white px-4 py-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-14 text-xs md:text-base cursor-pointer">
      <div className="flex items-center gap-1 md:gap-2 flex-row">
        <Clock className="w-3 h-3 md:w-4 md:h-4" />
        <span className="pr-10 md:pr-0">08:00am - 17:30pm</span>
        <span className="hidden md:inline h-4 border-l border-white mx-2" />
        <button
          onClick={openWhatsApp}
          className="flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
        >
          <FaWhatsapp className="w-3 h-3 md:w-4 md:h-4" />
          <span>+90 0534 822 88 65</span>
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-row">
        <button
          onClick={openGoogleMaps}
          className="flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
        >
          <MapPin className="w-5 h-5 md:w-4 md:h-4" />
          <span>
            karlıtepe mah. camii arkası sk. can ap no: 3 iç kapı no: 4
            gaziosmanpaşa/istanbul
          </span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-1 md:gap-2">
        <span>dil: türkçe</span>
      </div>
    </div>
  );
};

export default Notification;
