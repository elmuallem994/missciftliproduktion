// utils/sendOrderToWhatsApp.ts

import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Product {
  title: string;
  quantity: number;
  price: number;
}

export const sendOrderToWhatsApp = (
  products: Product[],
  recipientInfo: string,
  totalPrice: number,
  selectedDay: Date,
  regionName: string | null,
  neighborhoods: string | null,
  startTime: string | null,
  endTime: string | null,
  orderDate: Date,
  orderId: string,
  fullAddress: string | null
) => {
  const [recipientName, recipientPhone] = recipientInfo.split("\n");

  const formattedDay = `${format(selectedDay, "EEEE", {
    locale: tr,
  })} - ${format(selectedDay, "d MMMM yyyy", { locale: tr })}`;
  const formattedOrderDate = format(orderDate, "d MMMM yyyy, HH:mm", {
    locale: tr,
  });

  const orderDetails = products
    .map(
      (product, index) =>
        `*${index + 1}.* 🛍️ _Ürün:_ *${product.title}*\n    _Adet:_ *${
          product.quantity
        }*\n    _Fiyat:_ *${product.price} TL*`
    )
    .join("\n\n");

  const message = `
✅ *Yeni Sipariş Alındı!*
#️⃣ *Sipariş Numarası:* *#${orderId.replace(/\D/g, "").slice(-4)}*

🛒 *Sipariş Bilgileri:*
-------------------------
📅 *Sipariş Tarihi:*
 ${formattedOrderDate}

📍 *Bölge:* ${regionName || "Belirtilmemiş"} - ${
    neighborhoods || "Belirtilmemiş"
  }


⏰ *Zaman:*  ${startTime || "Belirtilmemiş"} - ${endTime || "Belirtilmemiş"}

👤 *Alıcı:* ${recipientName}
📞 *Telefon:* ${recipientPhone}

🗓️ *Teslimat Günü:*
 ${formattedDay}

🏠 *Adres:* 
${fullAddress || "Belirtilmemiş"}

🛍️ *Sipariş Detayları:*
-------------------------
${orderDetails}

💰 *Toplam Fiyat:*
 *${totalPrice.toFixed(2)} TL*
`;

  const encodedMessage = encodeURIComponent(message);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const companyPhone = "905348228865"; // رقم الشركة

  const whatsappUrl = isMobile
    ? `whatsapp://send?phone=${companyPhone}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${companyPhone}&text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
};
